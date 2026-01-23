import { createServerSupabaseClient } from '@/lib/db/server';
import { applyRateLimit } from '@/lib/api-utils';
import { registerSchema, validateBody } from '@/lib/validations';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for auth endpoints (5 per minute)
    const rateLimitResponse = await applyRateLimit(request, 'auth');
    if (rateLimitResponse) return rateLimitResponse;

    // Validate input with password strength requirements
    const { data: body, error: validationError } = await validateBody(request, registerSchema);
    if (validationError || !body) {
      return NextResponse.json({ error: validationError || 'Invalid input' }, { status: 400 });
    }

    const { email, password, name } = body;

    const supabase = await createServerSupabaseClient();

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Create user profile in our users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        name,
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Don't fail the registration, profile can be created later
    }

    // Create default user preferences
    await supabase
      .from('user_preferences')
      .insert({
        user_id: authData.user.id,
      });

    // Send welcome email via Edge Function (non-blocking)
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseAnonKey) {
        // Fire and forget - don't wait for response
        fetch(`${supabaseUrl}/functions/v1/send-welcome`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            userId: authData.user.id,
            email: authData.user.email,
            name,
          }),
        }).catch((err) => {
          console.error('Failed to trigger welcome email:', err);
        });
      }
    } catch (emailError) {
      // Don't fail registration if welcome email fails
      console.error('Error triggering welcome email:', emailError);
    }

    return NextResponse.json({
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name,
      },
      message: 'Registration successful. Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
