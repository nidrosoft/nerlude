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

// GET /api/projects/[id]/services - List project services
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

    // Verify project access
    const { hasAccess } = await verifyProjectAccess(supabase, user.id, id);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('project_services')
      .select(`
        *,
        stack:service_stacks (id, name, color),
        quick_links:service_quick_links (*),
        notification_settings:service_notification_settings (*)
      `)
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('List services error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects/[id]/services - Add service to project
export async function POST(request: NextRequest, { params }: Params) {
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

    // Verify project access - need edit permissions
    const { hasAccess, workspaceId, role } = await verifyProjectAccess(supabase, user.id, id);
    if (!hasAccess || !workspaceId) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (!role || !['owner', 'admin', 'member'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      registry_id,
      category_id,
      sub_category_id,
      name,
      custom_logo_url,
      plan,
      cost_amount,
      cost_frequency,
      currency,
      renewal_date,
      notes,
      stack_id,
    } = body;

    if (!category_id || !name) {
      return NextResponse.json(
        { error: 'category_id and name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('project_services')
      .insert({
        project_id: id,
        registry_id,
        category_id,
        sub_category_id,
        name,
        custom_logo_url,
        plan,
        cost_amount: cost_amount || 0,
        cost_frequency: cost_frequency || 'monthly',
        currency: currency || 'USD',
        renewal_date,
        notes,
        stack_id,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create default notification settings
    await supabase
      .from('service_notification_settings')
      .insert({
        project_service_id: data.id,
      });

    // Log activity for service addition
    await supabase
      .from('audit_logs')
      .insert({
        workspace_id: workspaceId,
        user_id: user.id,
        action: 'service_added',
        entity_type: 'service',
        entity_id: data.id,
        metadata: { name, registry_id, category_id, plan, cost_amount },
      });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Add service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
