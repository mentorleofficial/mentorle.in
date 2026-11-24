import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// The signed-in visitor's client on the server (route handlers), from the session cookies the browser client keeps.
// Used where the server must know who is asking (e.g. Huptle one-click apply). Only call it per request.
export async function serverSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.");
  const store = await cookies();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        // A refreshed session is written back where allowed (route handlers); elsewhere it's read-only.
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // read-only context
        }
      },
    },
  });
}
