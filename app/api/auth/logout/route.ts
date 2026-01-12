import { createServerSupabaseClient } from '@/lib/db/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current user before logout for audit log
    const { data: { user } } = await supabase.auth.getUser();

    // Get user's default workspace for audit log
    let workspaceId = null;
    if (user) {
      const { data: workspaceMember } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      workspaceId = workspaceMember?.workspace_id;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Create audit log for logout
    if (user && workspaceId) {
      await supabase.from('audit_logs').insert({
        workspace_id: workspaceId,
        user_id: user.id,
        action: 'logout',
        entity_type: 'user',
        entity_id: user.id,
        metadata: { 
          email: user.email
        },
      });
    }

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
