import { createServerSupabaseClient } from '@/lib/db/server';
import { applyRateLimit } from '@/lib/api-utils';
import { loginSchema, validateBody } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for auth endpoints (5 per minute)
    const rateLimitResponse = await applyRateLimit(request, 'auth');
    if (rateLimitResponse) return rateLimitResponse;

    // Validate input
    const { data: body, error: validationError } = await validateBody(request, loginSchema);
    if (validationError || !body) {
      return NextResponse.json({ error: validationError || 'Invalid input' }, { status: 400 });
    }

    const { email, password } = body;

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
