import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// POST /api/projects/[id]/duplicate - Duplicate a project
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the original project
    const { data: originalProject, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError || !originalProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check workspace membership
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', originalProject.workspace_id!)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin', 'member'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Create the duplicated project
    const { data: newProject, error: createError } = await supabase
      .from('projects')
      .insert({
        workspace_id: originalProject.workspace_id,
        name: `${originalProject.name} (Copy)`,
        description: originalProject.description,
        icon: originalProject.icon,
        type: originalProject.type,
        status: 'active',
        settings: originalProject.settings,
        created_by: user.id,
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    // Add creator as project owner
    await supabase
      .from('project_members')
      .insert({
        project_id: newProject.id,
        user_id: user.id,
        role: 'owner',
      });

    // Optionally duplicate services (without credentials for security)
    const { data: originalServices } = await supabase
      .from('project_services')
      .select('*')
      .eq('project_id', id);

    if (originalServices && originalServices.length > 0) {
      const duplicatedServices = originalServices.map(service => ({
        project_id: newProject.id,
        registry_id: service.registry_id,
        category_id: service.category_id,
        sub_category_id: service.sub_category_id,
        name: service.name,
        custom_logo_url: service.custom_logo_url,
        plan: service.plan,
        cost_amount: service.cost_amount,
        cost_frequency: service.cost_frequency,
        currency: service.currency,
        renewal_date: service.renewal_date,
        renewal_reminder_days: service.renewal_reminder_days,
        status: service.status,
        notes: service.notes,
        settings: service.settings,
        created_by: user.id,
      }));

      await supabase
        .from('project_services')
        .insert(duplicatedServices);
    }

    // Create audit log for project duplication
    await supabase.from('audit_logs').insert({
      workspace_id: originalProject.workspace_id,
      user_id: user.id,
      action: 'project_duplicated',
      entity_type: 'project',
      entity_id: newProject.id,
      metadata: { 
        name: newProject.name,
        original_project_id: id,
        original_project_name: originalProject.name
      },
    });

    return NextResponse.json({ 
      message: 'Project duplicated successfully',
      project: newProject 
    }, { status: 201 });
  } catch (error) {
    console.error('Duplicate project error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
