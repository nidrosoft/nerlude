import { createServerSupabaseClient } from '@/lib/db/server';
import { applyRateLimit } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// Allowed file types for security
const ALLOWED_FILE_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'text/markdown',
  // Archives
  'application/zip',
  'application/x-zip-compressed',
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Verify user has access to a project via workspace membership
 */
async function verifyProjectAccess(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  userId: string,
  projectId: string
): Promise<{ hasAccess: boolean; workspaceId: string | null; role: string | null }> {
  const { data: project } = await supabase
    .from('projects')
    .select('workspace_id')
    .eq('id', projectId)
    .single();

  if (!project?.workspace_id) {
    return { hasAccess: false, workspaceId: null, role: null };
  }

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('workspace_id', project.workspace_id)
    .eq('user_id', userId)
    .single();

  return {
    hasAccess: !!membership,
    workspaceId: project.workspace_id,
    role: membership?.role || null,
  };
}

// POST /api/projects/[id]/assets/upload - Upload asset file to storage
export async function POST(request: NextRequest, { params }: Params) {
  try {
    // Apply strict rate limiting for uploads (10 per minute)
    const rateLimitResponse = await applyRateLimit(request, 'upload');
    if (rateLimitResponse) return rateLimitResponse;

    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project access
    const { hasAccess, workspaceId, role } = await verifyProjectAccess(supabase, user.id, id);
    if (!hasAccess || !workspaceId) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!role || !['owner', 'admin', 'member'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const folderId = formData.get('folder_id') as string | null;

    if (!file || !name) {
      return NextResponse.json(
        { error: 'file and name are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed. Allowed types: images, PDFs, documents, and archives.` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Validate file name doesn't contain path traversal
    if (name.includes('..') || name.includes('/') || name.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid file name' },
        { status: 400 }
      );
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const sanitizedName = name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
    const filePath = `${id}/${folderId || 'general'}/${timestamp}-${sanitizedName}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    // Get public URL for response (not stored in DB)
    const { data: urlData } = supabase.storage
      .from('assets')
      .getPublicUrl(filePath);

    // Create asset record in database
    const { data, error } = await supabase
      .from('project_assets')
      .insert({
        project_id: id,
        name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        folder_id: folderId || null,
        metadata: {
          originalName: file.name,
          url: urlData.publicUrl,
        },
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (error) {
      // If database insert fails, try to clean up the uploaded file
      await supabase.storage.from('assets').remove([filePath]);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for asset upload
    await supabase.from('audit_logs').insert({
      workspace_id: workspaceId,
      user_id: user.id,
      action: 'asset_uploaded',
      entity_type: 'asset',
      entity_id: data.id,
      metadata: { 
        name: data.name,
        project_id: id,
        file_type: data.file_type,
        file_size: data.file_size,
        folder_id: folderId || null,
      },
    });

    return NextResponse.json({
      id: data.id,
      name: data.name,
      file_path: data.file_path,
      file_type: data.file_type,
      file_size: data.file_size,
      folder_id: folderId || null,
      url: urlData.publicUrl,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload asset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
