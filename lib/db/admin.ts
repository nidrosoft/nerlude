import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

/**
 * Supabase Admin Client
 * 
 * Use this client for server-side operations that need to bypass RLS.
 * Only use in trusted server contexts (API routes).
 * Falls back to anon key if service role key is not available.
 */
export function createAdminSupabaseClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  // Use service role key if available, otherwise fall back to anon key
  const key = serviceRoleKey || anonKey;

  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not set, using anon key (RLS will apply)');
  }

  return createClient<Database>(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
