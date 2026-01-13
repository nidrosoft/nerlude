import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/db/server';
import { rateLimit, rateLimitResponse, RateLimitType } from '@/lib/rate-limit';
import * as Sentry from '@sentry/nextjs';

export interface ApiContext {
  user: {
    id: string;
    email: string;
  };
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>;
}

export type ApiHandler = (
  request: Request,
  context: ApiContext
) => Promise<NextResponse>;

/**
 * Wraps an API handler with authentication, rate limiting, and error handling
 */
export function withApiHandler(
  handler: ApiHandler,
  options: {
    rateLimit?: RateLimitType;
    requireAuth?: boolean;
  } = {}
) {
  const { rateLimit: rateLimitType = 'api', requireAuth = true } = options;

  return async (request: Request): Promise<NextResponse> => {
    try {
      const supabase = await createServerSupabaseClient();
      
      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (requireAuth && (!user || authError)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Apply rate limiting
      if (user) {
        const rateLimitResult = await rateLimit(user.id, rateLimitType);
        
        if (rateLimitResult && !rateLimitResult.success) {
          return rateLimitResponse(rateLimitResult.reset);
        }
      }

      // Call the actual handler
      const context: ApiContext = {
        user: user ? { id: user.id, email: user.email || '' } : { id: '', email: '' },
        supabase,
      };

      return await handler(request, context);
    } catch (error) {
      // Log to Sentry
      Sentry.captureException(error);
      
      console.error('API Error:', error);
      
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Standard API response helpers
 */
export const apiResponse = {
  success: <T>(data: T, status = 200) => 
    NextResponse.json(data, { status }),
  
  created: <T>(data: T) => 
    NextResponse.json(data, { status: 201 }),
  
  noContent: () => 
    new NextResponse(null, { status: 204 }),
  
  badRequest: (message: string) => 
    NextResponse.json({ error: message }, { status: 400 }),
  
  unauthorized: (message = 'Unauthorized') => 
    NextResponse.json({ error: message }, { status: 401 }),
  
  forbidden: (message = 'Forbidden') => 
    NextResponse.json({ error: message }, { status: 403 }),
  
  notFound: (message = 'Not found') => 
    NextResponse.json({ error: message }, { status: 404 }),
  
  conflict: (message: string) => 
    NextResponse.json({ error: message }, { status: 409 }),
  
  error: (message = 'Internal server error', status = 500) => 
    NextResponse.json({ error: message }, { status }),
};
