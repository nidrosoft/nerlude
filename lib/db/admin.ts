import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

/**
 * Supabase Admin Client
 * 
 * Use this client for server-side operations that need to bypass RLS.
 * Only use in trusted server contexts (API routes).
 * 
 * SECURITY: This client requires the service role key and will throw
 * an error if it's not configured. Never use this on the client side.
 */
export function createAdminSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is not set. Please configure your environment variables.'
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Admin client requires service role key to bypass RLS. ' +
      'If you need RLS to apply, use createServerSupabaseClient instead.'
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Safely attempts to create an admin client
 * Returns null if the service role key is not configured
 * Use this when you want to gracefully fall back to regular auth
 */
export function tryCreateAdminSupabaseClient(): SupabaseClient<Database> | null {
  try {
    return createAdminSupabaseClient();
  } catch {
    return null;
  }
}
