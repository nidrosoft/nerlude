import { createServerSupabaseClient } from '@/lib/db/server';
import { createNotification } from '@/lib/utils/notifications';
import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ id: string }> };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// GET /api/workspaces/[id]/members - List workspace members
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check membership
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('workspace_id', id)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('workspace_members')
      .select(`
        id,
        role,
        invited_at,
        accepted_at,
        user:users (
          id,
          name,
          email,
          avatar_url
        )
      `)
      .eq('workspace_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('List members error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/workspaces/[id]/members - Invite member
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
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

    const { email, role = 'member' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Get workspace details for the email
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('name')
      .eq('id', id)
      .single();

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Get inviter details
    const { data: inviter } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', user.id)
      .single();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      // Check if already a member
      const { data: existingMember } = await supabase
        .from('workspace_members')
        .select('id')
        .eq('workspace_id', id)
        .eq('user_id', existingUser.id)
        .single();

      if (existingMember) {
        return NextResponse.json({ error: 'User is already a member' }, { status: 400 });
      }

      // Add directly as member
      const { data, error } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: id,
          user_id: existingUser.id,
          role,
          invited_by: user.id,
          accepted_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      // Send notification email to existing user (they're added directly)
      try {
        await fetch(`${SUPABASE_URL}/functions/v1/send-invite`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            type: 'workspace',
            email,
            inviterName: inviter?.name || 'A team member',
            inviterEmail: inviter?.email || user.email,
            targetId: id,
            targetName: workspace.name,
            role,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send invite email:', emailError);
        // Don't fail the request if email fails
      }

      // Create audit log for workspace member invitation
      await supabase.from('audit_logs').insert({
        workspace_id: id,
        user_id: user.id,
        action: 'member_invited',
        entity_type: 'team_member',
        entity_id: existingUser.id,
        metadata: { 
          email,
          role,
          workspace_name: workspace.name
        },
      });

      // Create notification for the invited user
      await createNotification({
        supabase,
        userId: existingUser.id,
        workspaceId: id,
        type: 'team',
        title: 'You were added to a workspace',
        message: `${inviter?.name || 'Someone'} added you to ${workspace.name} as ${role}.`,
        data: {
          subtype: 'member_invited',
          workspace_id: id,
          workspace_name: workspace.name,
          inviter_name: inviter?.name,
          role,
        },
      });

      return NextResponse.json(data, { status: 201 });
    }

    // For non-existing users, send invite email via Edge Function
    // The Edge Function will create the invite token
    try {
      const emailResponse = await fetch(`${SUPABASE_URL}/functions/v1/send-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          type: 'workspace',
          email,
          inviterName: inviter?.name || 'A team member',
          inviterEmail: inviter?.email || user.email,
          targetId: id,
          targetName: workspace.name,
          role,
        }),
      });

      const emailResult = await emailResponse.json();

      if (!emailResponse.ok) {
        console.error('Edge Function error:', emailResult);
        return NextResponse.json({ error: emailResult.error || 'Failed to send invitation' }, { status: 500 });
      }

      // Create audit log for workspace member invitation (non-existing user)
      await supabase.from('audit_logs').insert({
        workspace_id: id,
        user_id: user.id,
        action: 'member_invited',
        entity_type: 'team_member',
        entity_id: null,
        metadata: { 
          email,
          role,
          workspace_name: workspace.name,
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
    console.error('Invite member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
