import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get current user for audit log
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Create audit log for password change
    if (user) {
      // Get user's default workspace for audit log
      const { data: workspaceMember } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (workspaceMember) {
        await supabase.from('audit_logs').insert({
          workspace_id: workspaceMember.workspace_id,
          user_id: user.id,
          action: 'password_changed',
          entity_type: 'user',
          entity_id: user.id,
          metadata: { 
            email: user.email
          },
        });
      }
    }

    return NextResponse.json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
