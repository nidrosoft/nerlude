import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string; serviceId: string }> };

// GET /api/projects/[id]/services/[serviceId] - Get service details
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id, serviceId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('project_services')
      .select(`
        *,
        stack:service_stacks (id, name, color, icon),
        quick_links:service_quick_links (*),
        notification_settings:service_notification_settings (*),
        credentials:service_credentials (id, environment, credentials_encrypted, credential_type, key_name, description, last_rotated_at, created_at)
      `)
      .eq('id', serviceId)
      .eq('project_id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/projects/[id]/services/[serviceId] - Update service
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id, serviceId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const allowedFields = [
      'name', 'category_id', 'sub_category_id', 'custom_logo_url',
      'plan', 'cost_amount', 'cost_frequency', 'currency',
      'renewal_date', 'last_payment_date', 'renewal_reminder_days', 'status', 'notes',
      'settings', 'stack_id'
    ];
    const filteredUpdates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    filteredUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('project_services')
      .update(filteredUpdates)
      .eq('id', serviceId)
      .eq('project_id', id)
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

    // Create audit log for service update
    if (project) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'service_updated',
        entity_type: 'service',
        entity_id: serviceId,
        metadata: { 
          name: data.name,
          project_id: id,
          updated_fields: Object.keys(filteredUpdates).filter(k => k !== 'updated_at')
        },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/services/[serviceId] - Remove service
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id, serviceId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get service and project info before deletion for audit log
    const { data: service } = await supabase
      .from('project_services')
      .select('name, registry_id')
      .eq('id', serviceId)
      .eq('project_id', id)
      .single();

    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('project_services')
      .delete()
      .eq('id', serviceId)
      .eq('project_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for service removal
    if (project) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'service_removed',
        entity_type: 'service',
        entity_id: serviceId,
        metadata: { 
          name: service?.name || 'Unknown service',
          project_id: id,
          registry_id: service?.registry_id
        },
      });
    }

    return NextResponse.json({ message: 'Service removed successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
