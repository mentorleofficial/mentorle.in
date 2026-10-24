"use client";

import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

// The signed-in client for the browser (auth, the user's own profile, event registration). The session is kept
// in cookies, so server code can read it later with @supabase/ssr's createServerClient. Public, cacheable reads
// use the anonymous client in ./public.ts instead.
let client: SupabaseClient | undefined;

export function browserSupabase() {
  // detectSessionInUrl off: every flow here uses email codes, and /reset-password reads its own link (which
  // this PKCE client would otherwise reject with a console error).
  client ??= createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { detectSessionInUrl: false },
  });
  return client;
}

// A throwaway client for password-reset links: it never stores a session. Reset emails are requested in the
// "implicit" style so the link carries its own tokens and works on any device (the main client's PKCE links
// only work in the browser that asked), and /reset-password uses one of these to set the new password without
// touching the signed-in session.
export function recoverySupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    // Own storage key, so it doesn't count as a second instance of the main client.
    auth: { flowType: "implicit", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: "mentorle-recovery" },
  });
}
