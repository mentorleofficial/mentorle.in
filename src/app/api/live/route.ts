import { connection } from "next/server";
import { publicSupabase } from "@/lib/supabase/public";

// The public part of the live feed (event, presenter open, draw timing: no names or personal data), for /live's fast
// checks while the presenter screen is open. Vercel's network keeps each answer for 1 second, so thousands of phones
// checking every second cost Supabase about one request a second instead of thousands. Phones never keep it.
export async function GET() {
  await connection(); // per request, never prerendered
  const { data, error } = await publicSupabase().rpc("event_live_feed");
  if (error) return Response.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  return Response.json(data ?? { event: null }, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=1",
      "CDN-Cache-Control": "public, s-maxage=1",
      "Vercel-CDN-Cache-Control": "public, s-maxage=1",
    },
  });
}
