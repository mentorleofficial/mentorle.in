import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Create a Supabase client for server-side usage (API routes, Server Components)
 * This properly handles cookies for authentication
 */
export function createServerSupabaseClient() {
  try {
    const cookieStore = cookies();

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            try {
              return cookieStore.getAll();
            } catch (error) {
              console.error('Error getting cookies:', error);
              return [];
            }
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                try {
                  cookieStore.set(name, value, options);
                } catch (setError) {
                  // Ignore set errors in API routes - cookies are read-only in some contexts
                  console.warn(`Could not set cookie ${name}:`, setError);
                }
              });
            } catch (error) {
              // The `setAll` method was called from a Server Component or API route.
              // This can be ignored if you have middleware refreshing user sessions.
              console.warn('Error setting cookies:', error);
            }
          },
        },
      }
    );
  } catch (error) {
    console.error('Error creating Supabase server client:', error);
    throw error;
  }
}

