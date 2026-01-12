import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/workspaces - List user's workspaces
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get workspaces where user is a member
    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        role,
        workspace:workspaces (
          id,
          name,
          slug,
          workspace_type,
          owner_id,
          settings,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    const workspaces = data.map(item => ({
      ...item.workspace,
      role: item.role,
    }));

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error('List workspaces error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/workspaces - Create a new workspace
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, workspace_type = 'personal' } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Workspace name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create workspace
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        name,
        slug: `${slug}-${Date.now()}`,
        owner_id: user.id,
        workspace_type,
      })
      .select()
      .single();

    if (workspaceError) {
      return NextResponse.json(
        { error: workspaceError.message },
        { status: 400 }
      );
    }

    // Add owner as workspace member
    await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'owner',
        accepted_at: new Date().toISOString(),
      });

    // Create free subscription for workspace
    await supabase
      .from('subscriptions')
      .insert({
        workspace_id: workspace.id,
        plan: 'free',
        status: 'active',
      });

    // Create audit log for workspace creation
    await supabase.from('audit_logs').insert({
      workspace_id: workspace.id,
      user_id: user.id,
      action: 'workspace_created',
      entity_type: 'workspace',
      entity_id: workspace.id,
      metadata: { 
        name: workspace.name,
        workspace_type
      },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error('Create workspace error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
