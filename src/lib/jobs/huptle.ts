import { createHmac, randomUUID } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";

// Huptle (apply.huptle.com), the hiring partner. Server only: both values are secrets.
//   getHuptleJobs   GET /api/partner/jobs with X-Partner-Key → open roles, cached for a few minutes
//   huptleApplyUrl  a one-click apply link: an HS256 token (5 minutes, single use) that logs the mentee in on Huptle
//                   with their name and verified email and opens the job. Minted per click, never cached.
// Env: HUPTLE_API_KEY, HUPTLE_SSO_SECRET, optional HUPTLE_BASE_URL (default https://apply.huptle.com),
// HUPTLE_ISSUER (default "mentorle"; Huptle's spec says "mentorlee", and Huptle accepts "mentorle") and
// HUPTLE_REDIRECT_PATH (where Huptle lands the mentee; default "/jobs/{id}": the spec's "/apply/{id}" is a 404 on
// apply.huptle.com, where job pages live at /jobs/<id>).

export type HuptleJob = {
  id: string;
  title: string;
  department: string;
  location: string;
  mode: string;
  description: string;
  screeningDurationMin: number | null;
  createdAt: string;
};

const BASE_URL = (process.env.HUPTLE_BASE_URL || "https://apply.huptle.com").replace(/\/$/, "");
const JOB_ID = /^[A-Za-z0-9_-]{6,64}$/;
const TOKEN_SECONDS = 300;
const REDIRECT_PATH = process.env.HUPTLE_REDIRECT_PATH || "/jobs/{id}";

export const isHuptleJobId = (id: string) => JOB_ID.test(id);

type Row = Partial<Record<keyof HuptleJob, unknown>>;
const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function getHuptleJobs(): Promise<HuptleJob[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("huptle-jobs");
  const key = process.env.HUPTLE_API_KEY;
  if (!key) return [];
  try {
    const response = await fetch(`${BASE_URL}/api/partner/jobs`, { headers: { "X-Partner-Key": key, Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      console.error(`[huptle] jobs request failed: ${response.status}`);
      return [];
    }
    const body = (await response.json()) as { jobs?: Row[] };
    return (body.jobs ?? [])
      .map((row) => ({
        id: text(row.id),
        title: text(row.title),
        department: text(row.department),
        location: text(row.location),
        mode: text(row.mode),
        description: text(row.description),
        screeningDurationMin: typeof row.screeningDurationMin === "number" ? row.screeningDurationMin : null,
        createdAt: text(row.createdAt),
      }))
      .filter((job) => isHuptleJobId(job.id) && job.title);
  } catch (error) {
    console.error("[huptle] jobs request failed", error);
    return [];
  }
}

const base64url = (value: string | Buffer) => Buffer.from(value).toString("base64url");

// The signed handoff link for one mentee and one job. Null when the secret isn't configured.
export function huptleApplyUrl(candidate: { id: string; email: string; name: string }, jobId: string): string | null {
  const secret = process.env.HUPTLE_SSO_SECRET;
  if (!secret || !isHuptleJobId(jobId)) return null;
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: process.env.HUPTLE_ISSUER || "mentorle",
      sub: candidate.id,
      email: candidate.email,
      name: candidate.name,
      redirect: REDIRECT_PATH.replace("{id}", jobId),
      iat: now,
      exp: now + TOKEN_SECONDS,
      jti: randomUUID(),
    }),
  );
  const signature = createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url");
  return `${BASE_URL}/auth/partner?token=${header}.${payload}.${signature}`;
}
