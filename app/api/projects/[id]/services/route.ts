import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id]/services - List project services
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Get project to find workspace_id for activity log
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    // Log activity for service addition
    if (project) {
      await supabase
        .from('audit_logs')
        .insert({
          workspace_id: project.workspace_id,
          user_id: user.id,
          action: 'service_added',
          entity_type: 'service',
          entity_id: data.id,
          metadata: { name, registry_id, category_id, plan, cost_amount },
        });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Add service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
