import { createServerSupabaseClient } from '@/lib/db/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Get user's default workspace for audit log
    const { data: workspaceMember } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', data.user.id)
      .limit(1)
      .single();

    // Create audit log for login
    if (workspaceMember) {
      await supabase.from('audit_logs').insert({
        workspace_id: workspaceMember.workspace_id,
        user_id: data.user.id,
        action: 'login',
        entity_type: 'user',
        entity_id: data.user.id,
        metadata: { 
          email: data.user.email
        },
      });
    }

    return NextResponse.json({
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name,
        avatarUrl: profile?.avatar_url,
      },
      session: data.session,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
