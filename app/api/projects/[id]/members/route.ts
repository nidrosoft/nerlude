import { createServerSupabaseClient } from '@/lib/db/server';
import { createNotification } from '@/lib/utils/notifications';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// GET /api/projects/[id]/members - List project members
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Check workspace membership
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', project.workspace_id!)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get project members with user details
    const { data, error } = await supabase
      .from('project_members')
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
      .eq('project_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Transform data to match expected format
    const members = (data || []).map((m: any) => ({
      id: m.id,
      userId: m.user?.id,
      name: m.user?.name || 'Unknown',
      email: m.user?.email || '',
      avatarUrl: m.user?.avatar_url,
      role: m.role,
      joinedAt: m.created_at,
    }));

    return NextResponse.json(members);
  } catch (error) {
    console.error('List project members error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/projects/[id]/members - Add member to project
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'email and role are required' }, { status: 400 });
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

    // Check if current user has permission to add members
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', project.workspace_id!)
      .eq('user_id', user.id)
      .single();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get project name and workspace details for the email
    const { data: projectDetails } = await supabase
      .from('projects')
      .select('name, workspace:workspaces(name)')
      .eq('id', id)
      .single();

    // Get inviter details
    const { data: inviter } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', user.id)
      .single();

    // Find user by email
    const { data: targetUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (targetUser) {
      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', id)
        .eq('user_id', targetUser.id)
        .single();

      if (existingMember) {
        return NextResponse.json({ error: 'User is already a member of this project' }, { status: 400 });
      }

      // Add member directly
      const { data, error } = await supabase
        .from('project_members')
        .insert({
          project_id: id,
          user_id: targetUser.id,
          role,
        })
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

      // Send notification email to existing user
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/send-invite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: 'project',
            email,
            inviterName: inviter?.name || 'A team member',
            inviterEmail: inviter?.email || user.email,
            targetId: id,
            targetName: projectDetails?.name || 'Project',
            role,
            workspaceName: (projectDetails?.workspace as any)?.name,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send invite email:', emailError);
      }

      // Create audit log for member invitation
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'member_invited',
        entity_type: 'team_member',
        entity_id: targetUser.id,
        metadata: { 
          name: (data as any).user?.name || email,
          email,
          role,
          project_id: id,
          project_name: projectDetails?.name
        },
      });

      // Create notification for the invited user
      await createNotification({
        supabase,
        userId: targetUser.id,
        workspaceId: project.workspace_id!,
        type: 'team',
        title: 'You were added to a project',
        message: `${inviter?.name || 'Someone'} added you to ${projectDetails?.name || 'a project'} as ${role}.`,
        data: {
          subtype: 'member_invited',
          project_id: id,
          project_name: projectDetails?.name,
          inviter_name: inviter?.name,
          role,
        },
      });

      const member = {
        id: (data as any).id,
        userId: (data as any).user?.id,
        name: (data as any).user?.name || 'Unknown',
        email: (data as any).user?.email || '',
        avatarUrl: (data as any).user?.avatar_url,
        role: (data as any).role,
        joinedAt: (data as any).created_at,
      };

      return NextResponse.json(member, { status: 201 });
    }

    // For non-existing users, send invite email via Edge Function
    try {
      const emailResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'project',
          email,
          inviterName: inviter?.name || 'A team member',
          inviterEmail: inviter?.email || user.email,
          targetId: id,
          targetName: projectDetails?.name || 'Project',
          role,
          workspaceName: (projectDetails?.workspace as any)?.name,
        }),
      });

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error('Edge Function error:', emailResult);
        return NextResponse.json({ error: emailResult.error || 'Failed to send invitation' }, { status: 500 });
      }

      // Create audit log for member invitation (non-existing user)
      await supabase.from('audit_logs').insert({
        workspace_id: project.workspace_id,
        user_id: user.id,
        action: 'member_invited',
        entity_type: 'team_member',
        entity_id: null,
        metadata: { 
          email,
          role,
          project_id: id,
          project_name: projectDetails?.name,
          pending: true
        },
      });

      return NextResponse.json({ 
        message: 'Invitation sent successfully',
        email,
      }, { status: 201 });
    } catch (emailError) {
      console.error('Failed to call Edge Function:', emailError);
      return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Add project member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
