"use client";

import { browserSupabase } from "@/lib/supabase/browser";

// Event mode, set up by admins on the platform (Admin → Event mode):
//   status        rpc("event_mode_status")       is quick signup on right now (public)
//   quickSignup   functions/event-quick-signup   creates a confirmed mentee account; refused unless an event is on
//   liveFeed      rpc("event_live_feed")         the event, the draw's timing and (signed in) whether the viewer is in the
//                                                draw (public; no names, counts or winner)
//   fastFeed      GET /api/live                 the same without the viewer's part, cached 1s by Vercel (fast checks)
//   myDrawResult  rpc("my_event_draw_result")    whether the viewer is in the draw; won / lost / not entered only once
//                                                the countdown has ended

export type QuickSignupInput = { fullName: string; email: string; phone: string; password: string; terms: boolean };
export type QuickSignupCode = "email_taken" | "phone_taken" | "event_off" | "busy" | "rate_limited" | "weak_password" | "invalid_phone" | "invalid_email" | "invalid_name" | "terms" | "unknown";

export class QuickSignupError extends Error {
  constructor(public code: QuickSignupCode) {
    super(code);
  }
}

// `draw.reveal_in_ms`: until the result may be shown (lead-in + countdown); `countdown_ms`: the countdown's length.
// `me`: only for a signed-in viewer.
export type LiveFeed = {
  // `presenting`: the presenter screen is open, so phones check every second (through /api/live).
  event: { id: string; name: string; active: boolean; presenting?: boolean } | null;
  draw: { id: string; number: number; reveal_in_ms: number; countdown_ms?: number } | null;
  me?: { entered: boolean } | null;
};
// `entered`: the viewer is in the draw (signed in, joined during the event, not disqualified).
// During the countdown (`pending`), `outcome` is the viewer's own result, to show at the reveal.
export type DrawResult = {
  status: "none" | "pending" | "won" | "lost" | "not_entered";
  entered?: boolean;
  draw_id?: string;
  reveal_in_ms?: number;
  outcome?: "won" | "lost" | "not_entered";
};

export const eventService = {
  async status(): Promise<{ active: boolean; name?: string }> {
    const { data, error } = await browserSupabase().rpc("event_mode_status");
    if (error) throw error;
    return (data as { active: boolean; name?: string }) ?? { active: false };
  },

  async quickSignup(input: QuickSignupInput) {
    let response: Response;
    try {
      response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/event-quick-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
        body: JSON.stringify({ full_name: input.fullName, email: input.email, phone: input.phone, password: input.password, terms: input.terms }),
      });
    } catch {
      throw new QuickSignupError("unknown");
    }
    if (response.ok) return;
    const body = (await response.json().catch(() => ({}))) as { code?: QuickSignupCode };
    throw new QuickSignupError(body.code ?? "unknown");
  },

  async liveFeed(): Promise<LiveFeed> {
    const { data, error } = await browserSupabase().rpc("event_live_feed");
    if (error) throw error;
    const feed = data as Partial<LiveFeed> | null;
    return { event: feed?.event ?? null, draw: feed?.draw ?? null, me: feed?.me ?? null };
  },

  // The same feed without the viewer's part, from mentorle.in's /api/live (cached for 1 second by Vercel): the cheap
  // way for thousands of phones to check every second while the presenter screen is open.
  async fastFeed(): Promise<LiveFeed> {
    const response = await fetch("/api/live", { cache: "no-store" });
    if (!response.ok) throw new Error(`live feed ${response.status}`);
    const feed = (await response.json()) as Partial<LiveFeed> | null;
    return { event: feed?.event ?? null, draw: feed?.draw ?? null, me: null };
  },

  async myDrawResult(): Promise<DrawResult> {
    const { data, error } = await browserSupabase().rpc("my_event_draw_result");
    if (error) throw error;
    return data as DrawResult;
  },
};
