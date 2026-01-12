import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// POST /api/projects/[id]/assets/upload - Upload asset file to storage
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Get project for workspace_id to create audit log
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    // Create audit log for asset upload
    if (project) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
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
    }

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
