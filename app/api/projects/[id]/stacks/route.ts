import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

// GET /api/projects/[id]/stacks - List service stacks
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('service_stacks')
      .select(`
        *,
        services:project_services (count)
      `)
      .eq('project_id', id)
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('List stacks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects/[id]/stacks - Create stack
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, color, icon } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('service_stacks')
      .insert({
        project_id: id,
        name,
        description,
        color: color || 'slate',
        icon,
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

    // Create audit log for stack creation
    if (project) {
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'stack_created',
        entity_type: 'service',
        entity_id: data.id,
        metadata: { 
          name: data.name,
          project_id: id,
          color: data.color
        },
      });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create stack error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
