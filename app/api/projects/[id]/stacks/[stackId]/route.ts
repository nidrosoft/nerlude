import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string; stackId: string }> };

// PATCH /api/projects/[id]/stacks/[stackId] - Update stack
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id, stackId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const allowedFields = ['name', 'description', 'color', 'icon', 'sort_order'];
    const filteredUpdates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    filteredUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('service_stacks')
      .update(filteredUpdates)
      .eq('id', stackId)
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

    // Create audit log for stack update
    if (project) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'stack_updated',
        entity_type: 'service',
        entity_id: stackId,
        metadata: { 
          name: data.name,
          project_id: id,
          updated_fields: Object.keys(filteredUpdates).filter(k => k !== 'updated_at')
        },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update stack error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/stacks/[stackId] - Delete stack
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id, stackId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get stack and project info before deletion for audit log
    const { data: stack } = await supabase
      .from('service_stacks')
      .select('name')
      .eq('id', stackId)
      .eq('project_id', id)
      .single();

    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('service_stacks')
      .delete()
      .eq('id', stackId)
      .eq('project_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for stack deletion
    if (project) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'stack_deleted',
        entity_type: 'service',
        entity_id: stackId,
        metadata: { 
          name: stack?.name || 'Unknown stack',
          project_id: id
        },
      });
    }

    return NextResponse.json({ message: 'Stack deleted successfully' });
  } catch (error) {
    console.error('Delete stack error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
