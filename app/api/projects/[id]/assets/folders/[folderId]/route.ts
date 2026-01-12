import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string; folderId: string }> };

// GET /api/projects/[id]/assets/folders/[folderId] - Get folder details with assets
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id, folderId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get folder with its assets
    const { data: folder, error: folderError } = await supabase
      .from('asset_folders' as any)
      .select('*')
      .eq('id', folderId)
      .eq('project_id', id)
      .single();

    if (folderError) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Get assets in this folder
    const { data: assets, error: assetsError } = await supabase
      .from('project_assets')
      .select('*')
      .eq('folder_id', folderId)
      .order('created_at', { ascending: false });

    if (assetsError) {
      console.error('Get folder assets error:', assetsError);
    }

    return NextResponse.json({
      ...(folder as unknown as Record<string, unknown>),
      assets: assets || [],
    });
  } catch (error) {
    console.error('Get folder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/projects/[id]/assets/folders/[folderId] - Update folder
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id, folderId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const allowedFields = ['name', 'description', 'color', 'icon', 'parent_folder_id'];
    const filteredUpdates: Record<string, unknown> = {};
    
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    filteredUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('asset_folders' as any)
      .update(filteredUpdates)
      .eq('id', folderId)
      .eq('project_id', id)
      .select()
      .single();

    if (error) {
      console.error('Update folder error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get project for workspace_id to create audit log
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    // Create audit log for folder update
    if (project) {
      const { error: auditError } = await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'folder_updated',
        entity_type: 'folder',
        entity_id: folderId,
        metadata: { 
          name: (data as any).name,
          project_id: id,
          updated_fields: Object.keys(filteredUpdates).filter(k => k !== 'updated_at'),
        },
      });
      if (auditError) {
        console.error('Error logging folder update:', auditError);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update folder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/assets/folders/[folderId] - Delete folder
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id, folderId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get folder name before deletion for audit log
    const { data: folderData } = await supabase
      .from('asset_folders' as any)
      .select('name')
      .eq('id', folderId)
      .eq('project_id', id)
      .single();

    // First, get all assets in this folder to delete from storage
    const { data: assets } = await supabase
      .from('project_assets')
      .select('file_path')
      .eq('folder_id', folderId);

    const assetCount = assets?.length || 0;

    // Delete files from storage
    if (assets && assets.length > 0) {
      const filePaths = assets.map(a => a.file_path);
      await supabase.storage.from('assets').remove(filePaths);
    }

    // Delete the folder (cascade will delete assets records)
    const { error } = await supabase
      .from('asset_folders' as any)
      .delete()
      .eq('id', folderId)
      .eq('project_id', id);

    if (error) {
      console.error('Delete folder error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get project for workspace_id to create audit log
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    // Create audit log for folder deletion
    if (project) {
      const { error: auditError } = await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'folder_deleted',
        entity_type: 'folder',
        entity_id: folderId,
        metadata: { 
          name: (folderData as any)?.name || 'Unknown folder',
          project_id: id,
          assets_deleted: assetCount,
        },
      });
      if (auditError) {
        console.error('Error logging folder deletion:', auditError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete folder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
