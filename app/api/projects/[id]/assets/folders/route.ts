import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id]/assets/folders - List project asset folders
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('asset_folders' as any)
      .select(`
        *,
        assets:project_assets(count)
      `)
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('List folders error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('List folders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects/[id]/assets/folders - Create a new folder
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, color, icon, parent_folder_id } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Folder name is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('asset_folders' as any)
      .insert({
        project_id: id,
        name,
        description,
        color: color || 'slate',
        icon: icon || 'folder',
        parent_folder_id,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Create folder error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Get project for workspace_id to create audit log
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    if (project) {
      const { error: auditError } = await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'folder_created',
        entity_type: 'folder',
        entity_id: (data as any).id,
        metadata: { 
          name: (data as any).name,
          project_id: id,
        },
      });
      if (auditError) {
        console.error('Error logging folder creation:', auditError);
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create folder error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
