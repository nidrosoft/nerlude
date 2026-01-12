import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id]/assets - List project assets
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('project_assets')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('List assets error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects/[id]/assets - Upload asset metadata
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, file_path, file_type, file_size, folder_id, metadata } = await request.json();

    if (!name || !file_path) {
      return NextResponse.json(
        { error: 'name and file_path are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('project_assets')
      .insert({
        project_id: id,
        name,
        file_path,
        file_type,
        file_size,
        folder_id: folder_id || null,
        metadata: metadata || {},
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get project for workspace_id
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
          folder_id: (data as any).folder_id
        },
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Upload asset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
