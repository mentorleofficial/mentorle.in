import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// POST - Subscribe an email to the launch newsletter
// Saves to Supabase (source of truth), then syncs to the Brevo contact list.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BREVO_API = "https://api.brevo.com/v3";

// Simple per-IP limit (in memory, per server instance)
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function createPrivilegedClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const serviceKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    ""
  ).trim();

  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Adds the contact to Brevo. Returns true on success.
// With BREVO_DOI_TEMPLATE_ID set, Brevo first emails a confirmation link (double opt-in).
async function syncToBrevo(email, origin) {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) return false;

  const doiTemplateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const [path, body] = doiTemplateId
    ? [
        "/contacts/doubleOptinConfirmation",
        {
          email,
          includeListIds: [listId],
          templateId: doiTemplateId,
          redirectionUrl: `${origin}/maintenance?subscribed=1`,
        },
      ]
    : ["/contacts", { email, listIds: [listId], updateEnabled: true }];

  try {
    const res = await fetch(`${BREVO_API}${path}`, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.error("Brevo sync failed:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Brevo sync error:", error);
    return false;
  }
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const { email: rawEmail, company } = await request.json().catch(() => ({}));

    // Honeypot: real users never see or fill this field
    if (company) {
      return NextResponse.json({ ok: true });
    }

    const email = String(rawEmail || "").trim().toLowerCase();
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const supabase = createPrivilegedClient();
    if (!supabase) {
      console.error("Newsletter: Supabase service key is not configured");
      return NextResponse.json(
        { error: "Something went wrong. Please try again later." },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, source: "maintenance" });

    if (insertError && insertError.code !== "23505") {
      console.error("Newsletter insert error:", insertError);
      return NextResponse.json(
        { error: "Something went wrong. Please try again later." },
        { status: 500 }
      );
    }

    // Sync on every signup, including repeats (23505): Brevo upserts, and this
    // re-adds anyone removed from the list. The response is the same either way,
    // so the form never reveals who is already subscribed.
    if (await syncToBrevo(email, request.nextUrl.origin)) {
      await supabase
        .from("newsletter_subscribers")
        .update({ brevo_synced_at: new Date().toISOString() })
        .eq("email", email);
    }

    return NextResponse.json({
      ok: true,
      doubleOptIn: Boolean(Number(process.env.BREVO_DOI_TEMPLATE_ID)),
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
