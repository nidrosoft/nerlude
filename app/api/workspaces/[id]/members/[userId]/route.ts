import { createServerSupabaseClient } from '@/lib/db/server';
import { createNotification } from '@/lib/utils/notifications';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string; userId: string }> };

// PATCH /api/workspaces/[id]/members/[userId] - Update member role
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id, userId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is owner or admin
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', id)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { role } = await request.json();

    if (!role || !['admin', 'member', 'viewer'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Can't change owner role
    const { data: targetMember } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', id)
      .eq('user_id', userId)
      .single();

    if (targetMember?.role === 'owner') {
      return NextResponse.json({ error: 'Cannot change owner role' }, { status: 400 });
    }

    // Get member info for audit log
    const { data: memberInfo } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', userId)
      .single();

    const { data, error } = await supabase
      .from('workspace_members')
      .update({ role })
      .eq('workspace_id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for member role change
    await supabase.from('audit_logs').insert({
      workspace_id: id,
      user_id: user.id,
      action: 'member_role_changed',
      entity_type: 'team_member',
      entity_id: userId,
      metadata: { 
        name: memberInfo?.name || 'Unknown',
        email: memberInfo?.email,
        old_role: targetMember?.role,
        new_role: role
      },
    });

    // Get workspace name for notification
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('name')
      .eq('id', id)
      .single();

    // Create notification for the user whose role changed
    if (userId !== user.id) {
      await createNotification({
        supabase,
        userId,
        workspaceId: id,
        type: 'team',
        title: 'Your role was changed',
        message: `Your role in ${workspace?.name || 'a workspace'} was changed to ${role}.`,
        data: {
          subtype: 'member_role_changed',
          workspace_id: id,
          workspace_name: workspace?.name,
          old_role: targetMember?.role,
          new_role: role,
        },
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/workspaces/[id]/members/[userId] - Remove member
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id, userId } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is owner or admin (or removing themselves)
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', id)
      .eq('user_id', user.id)
      .single();

    const isSelf = user.id === userId;
    const isAdminOrOwner = membership && ['owner', 'admin'].includes(membership.role);

    if (!isSelf && !isAdminOrOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Can't remove owner
    const { data: targetMember } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', id)
      .eq('user_id', userId)
      .single();

    if (targetMember?.role === 'owner') {
      return NextResponse.json({ error: 'Cannot remove workspace owner' }, { status: 400 });
    }

    // Get member info before removal for audit log
    const { data: memberInfo } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', userId)
      .single();

    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', id)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Create audit log for member removal
    await supabase.from('audit_logs').insert({
      workspace_id: id,
      user_id: user.id,
      action: 'member_removed',
      entity_type: 'team_member',
      entity_id: userId,
      metadata: { 
        name: memberInfo?.name || 'Unknown',
        email: memberInfo?.email,
        removed_by_self: isSelf
      },
    });

    // Get workspace name for notification
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('name')
      .eq('id', id)
      .single();

    // Create notification for the removed user (if not self-removal)
    if (!isSelf) {
      await createNotification({
        supabase,
        userId,
        workspaceId: id,
        type: 'team',
        title: 'You were removed from a workspace',
        message: `You were removed from ${workspace?.name || 'a workspace'}.`,
        data: {
          subtype: 'member_removed',
          workspace_id: id,
          workspace_name: workspace?.name,
        },
      });
    }

    return NextResponse.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
