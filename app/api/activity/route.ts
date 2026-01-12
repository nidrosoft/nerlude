import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/activity - Get recent activity logs from audit_logs table
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const entityId = searchParams.get('entity_id');
    const projectId = searchParams.get('project_id');

    // Get user's workspaces
    const { data: memberships } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id);

    const workspaceIds = memberships?.map(m => m.workspace_id) || [];

    if (workspaceIds.length === 0) {
      return NextResponse.json([]);
    }

    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:users (id, name, avatar_url)
      `)
      .in('workspace_id', workspaceIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (entityId) {
      query = query.eq('entity_id', entityId);
    }

    // Filter by project_id - check both entity_id (for project actions) and metadata->project_id (for related entities)
    if (projectId) {
      query = query.or(`entity_id.eq.${projectId},metadata->>project_id.eq.${projectId}`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Get activity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/activity - Log an activity to audit_logs table
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workspace_id, action, entity_type, entity_id, old_data, new_data, metadata } = body;

    if (!workspace_id || !action || !entity_type) {
      return NextResponse.json(
        { error: 'workspace_id, action, and entity_type are required' },
        { status: 400 }
      );
    }

    // Verify workspace membership
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', workspace_id)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        workspace_id,
        user_id: user.id,
        action,
        entity_type,
        entity_id,
        old_data: old_data || null,
        new_data: new_data || null,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Log activity error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
