import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// POST /api/projects/[id]/archive - Archive a project
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get project and check access
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id, name, status')
      .eq('id', id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.status === 'archived') {
      return NextResponse.json({ error: 'Project is already archived' }, { status: 400 });
    }

    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', project.workspace_id!)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin', 'member'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Archive the project
    const { data, error } = await supabase
      .from('projects')
      .update({
        status: 'archived',
        archived_at: new Date().toISOString(),
        archived_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for project archive
    await supabase.from('audit_logs').insert({
      workspace_id: project.workspace_id,
      user_id: user.id,
      action: 'project_archived',
      entity_type: 'project',
      entity_id: id,
      metadata: { 
        name: project.name
      },
    });

    return NextResponse.json({ 
      message: 'Project archived successfully',
      project: data 
    });
  } catch (error) {
    console.error('Archive project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/archive - Restore a project (unarchive)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get project and check access
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id, name, status')
      .eq('id', id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.status !== 'archived') {
      return NextResponse.json({ error: 'Project is not archived' }, { status: 400 });
    }

    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', project.workspace_id!)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin', 'member'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Restore the project
    const { data, error } = await supabase
      .from('projects')
      .update({
        status: 'active',
        archived_at: null,
        archived_by: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for project restore
    await supabase.from('audit_logs').insert({
      workspace_id: project.workspace_id,
      user_id: user.id,
      action: 'project_restored',
      entity_type: 'project',
      entity_id: id,
      metadata: { 
        name: project.name
      },
    });

    return NextResponse.json({ 
      message: 'Project restored successfully',
      project: data 
    });
  } catch (error) {
    console.error('Restore project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
