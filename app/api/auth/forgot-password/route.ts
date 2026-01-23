import { createServerSupabaseClient } from '@/lib/db/server';
import { applyRateLimit } from '@/lib/api-utils';
import { forgotPasswordSchema, validateBody } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for auth endpoints (5 per minute)
    const rateLimitResponse = await applyRateLimit(request, 'auth');
    if (rateLimitResponse) return rateLimitResponse;

    // Validate input
    const { data: body, error: validationError } = await validateBody(request, forgotPasswordSchema);
    if (validationError || !body) {
      return NextResponse.json({ error: validationError || 'Invalid input' }, { status: 400 });
    }

    const { email } = body;

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Password reset email sent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
