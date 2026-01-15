import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string; assetId: string }> };

// PATCH /api/projects/[id]/assets/[assetId] - Update asset (move to folder)
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id, assetId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { folder_id } = body;

    // Update asset folder
    const { data, error } = await supabase
      .from('project_assets')
      .update({ folder_id: folder_id || null })
      .eq('id', assetId)
      .eq('project_id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update asset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/assets/[assetId] - Delete asset
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id, assetId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get asset to delete from storage
    const { data: asset } = await supabase
      .from('project_assets')
      .select('file_path')
      .eq('id', assetId)
      .eq('project_id', id)
      .single();

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    // Get asset name before deletion for audit log
    const { data: assetData } = await supabase
      .from('project_assets')
      .select('name, file_type')
      .eq('id', assetId)
      .eq('project_id', id)
      .single();

    // Get project for workspace_id
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    // Delete from storage
    if (asset.file_path) {
      await supabase.storage.from('assets').remove([asset.file_path]);
    }

    // Delete from database
    const { error } = await supabase
      .from('project_assets')
      .delete()
      .eq('id', assetId)
      .eq('project_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for asset deletion
    if (project) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'asset_deleted',
        entity_type: 'asset',
        entity_id: assetId,
        metadata: { 
          name: assetData?.name || 'Unknown asset',
          project_id: id,
          file_type: assetData?.file_type
        },
      });
    }

    return NextResponse.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Delete asset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
