import { getHuptleJobs, huptleApplyUrl, isHuptleJobId } from "@/lib/jobs/huptle";
import { serverSupabase } from "@/lib/supabase/server";

// POST { jobId } → { url } for Huptle one-click apply, or { code } saying why not. Checked here on the server, never
// trusted from the browser: signed in, a mentee, a verified email, an open Huptle job. The token is minted per click.
export type ApplyCode = "signed_out" | "mentees_only" | "verify_email" | "job_gone" | "unavailable" | "bad_request";

const reply = (body: { url: string } | { code: ApplyCode }, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const { jobId } = ((await request.json().catch(() => ({}))) ?? {}) as { jobId?: unknown };
  if (typeof jobId !== "string" || !isHuptleJobId(jobId)) return reply({ code: "bad_request" }, 400);

  const db = await serverSupabase();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user?.email) return reply({ code: "signed_out" }, 401);

  const [{ data: profile }, { data: verified, error: verifiedError }] = await Promise.all([
    db.from("users").select("role, full_name, email").eq("id", user.id).maybeSingle(),
    db.rpc("my_email_verified"),
  ]);
  if (profile?.role !== "mentee") return reply({ code: "mentees_only" }, 403);
  if (verifiedError) return reply({ code: "unavailable" }, 503);
  if (!verified) return reply({ code: "verify_email" }, 403);

  const jobs = await getHuptleJobs();
  if (!jobs.some((job) => job.id === jobId)) return reply({ code: "job_gone" }, 404);

  const url = huptleApplyUrl({ id: user.id, email: profile.email || user.email, name: (profile.full_name || "").trim() }, jobId);
  return url ? reply({ url }) : reply({ code: "unavailable" }, 503);
}
