import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

/**
 * Supabase Browser Client
 * 
 * Use this client for client-side operations.
 * It uses the anon key and respects RLS policies.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton instance for convenience
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
}

// Re-export types for convenience
export type { Database } from '@/types/database';
