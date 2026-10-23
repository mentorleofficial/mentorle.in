import { createClient } from "@supabase/supabase-js";

// Anonymous, cookie-free client for public reads in server components (mentor directory, profiles, offerings).
// It never carries a user session, so its results are the same for every visitor and safe to cache with
// "use cache". Signed-in reads will get their own cookie-aware client.
export function publicSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set (see local-docs/supabase-local).");
  }
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
