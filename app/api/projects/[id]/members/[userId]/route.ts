import { createServerSupabaseClient } from '@/lib/db/server';
import { createNotification } from '@/lib/utils/notifications';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string; userId: string }> };

// PATCH /api/projects/[id]/members/[userId] - Update member role
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id, userId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role } = await request.json();

    if (!role) {
      return NextResponse.json({ error: 'role is required' }, { status: 400 });
    }

    // Get project to verify access
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id')
      .eq('id', id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if current user has permission to update members
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', project.workspace_id!)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update member role
    const { data, error } = await supabase
      .from('project_members')
      .update({ role })
      .eq('project_id', id)
      .eq('user_id', userId)
      .select(`
        id,
        role,
        created_at,
        user:users (
          id,
          name,
          email,
          avatar_url
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Create audit log for member role change
    await supabase.from('audit_logs').insert({
      workspace_id: project.workspace_id,
      user_id: user.id,
      action: 'member_role_changed',
      entity_type: 'team_member',
      entity_id: userId,
      metadata: { 
        name: (data as any).user?.name || 'Unknown',
        email: (data as any).user?.email,
        new_role: role,
        project_id: id
      },
    });

    // Get project name for notification
    const { data: projectData } = await supabase
      .from('projects')
      .select('name')
      .eq('id', id)
      .single();

    // Create notification for the user whose role changed
    if (userId !== user.id) {
      await createNotification({
        supabase,
        userId,
        workspaceId: project.workspace_id!,
        type: 'team',
        title: 'Your role was changed',
        message: `Your role in ${projectData?.name || 'a project'} was changed to ${role}.`,
        data: {
          subtype: 'member_role_changed',
          project_id: id,
          project_name: projectData?.name,
          new_role: role,
        },
      });
    }

    const member = {
      id: (data as any).id,
      userId: (data as any).user?.id,
      name: (data as any).user?.name || 'Unknown',
      email: (data as any).user?.email || '',
      avatarUrl: (data as any).user?.avatar_url,
      role: (data as any).role,
      joinedAt: (data as any).created_at,
    };

    return NextResponse.json(member);
  } catch (error) {
    console.error('Update project member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/projects/[id]/members/[userId] - Remove member from project
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id, userId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get project to verify access
    const { data: project } = await supabase
      .from('projects')
      .select('workspace_id, created_by')
      .eq('id', id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if current user has permission to remove members
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', project.workspace_id!)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent removing the project creator
    if (userId === project.created_by) {
      return NextResponse.json({ error: 'Cannot remove the project creator' }, { status: 400 });
    }

    // Get member info before removal for audit log
    const { data: memberData } = await supabase
      .from('project_members')
      .select(`
        user:users (name, email)
      `)
      .eq('project_id', id)
      .eq('user_id', userId)
      .single();

    // Remove member
    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('project_id', id)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for member removal
    await supabase.from('audit_logs').insert({
      workspace_id: project.workspace_id,
      user_id: user.id,
      action: 'member_removed',
      entity_type: 'team_member',
      entity_id: userId,
      metadata: { 
        name: (memberData as any)?.user?.name || 'Unknown',
        email: (memberData as any)?.user?.email,
        project_id: id
      },
    });

    // Get project name for notification
    const { data: projectData } = await supabase
      .from('projects')
      .select('name')
      .eq('id', id)
      .single();

    // Create notification for the removed user (if not self-removal)
    if (userId !== user.id) {
      await createNotification({
        supabase,
        userId,
        workspaceId: project.workspace_id!,
        type: 'team',
        title: 'You were removed from a project',
        message: `You were removed from ${projectData?.name || 'a project'}.`,
        data: {
          subtype: 'member_removed',
          project_id: id,
          project_name: projectData?.name,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove project member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
