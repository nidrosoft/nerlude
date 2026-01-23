import { createServerSupabaseClient } from '@/lib/db/server';
import { applyRateLimit } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

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

// GET /api/projects/[id] - Get project details
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await applyRateLimit(request, 'api');
    if (rateLimitResponse) return rateLimitResponse;

    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        workspace:workspaces (id, name, slug),
        services:project_services (*),
        documents:project_documents (*),
        assets:project_assets (*),
        stacks:service_stacks (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check workspace membership
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', data.workspace_id!)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/projects/[id] - Update project
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await applyRateLimit(request, 'api');
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

    const updates = await request.json();
    const allowedFields = ['name', 'description', 'icon', 'type', 'status', 'settings'];
    const filteredUpdates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    filteredUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('projects')
      .update(filteredUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for project update
    await supabase.from('audit_logs').insert({
      workspace_id: workspaceId,
      user_id: user.id,
      action: 'project_updated',
      entity_type: 'project',
      entity_id: id,
      metadata: { 
        name: data.name,
        updated_fields: Object.keys(filteredUpdates).filter(k => k !== 'updated_at')
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await applyRateLimit(request, 'api');
    if (rateLimitResponse) return rateLimitResponse;

    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify project access - only owners and admins can delete
    const { hasAccess, workspaceId, role } = await verifyProjectAccess(supabase, user.id, id);

    if (!hasAccess || !workspaceId) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!role || !['owner', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get project name before deletion for audit log
    const { data: projectData } = await supabase
      .from('projects')
      .select('name')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for project deletion
    await supabase.from('audit_logs').insert({
      workspace_id: workspaceId,
      user_id: user.id,
      action: 'project_deleted',
      entity_type: 'project',
      entity_id: id,
      metadata: { 
        name: projectData?.name || 'Unknown project'
      },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
