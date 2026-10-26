"use client";

import { browserSupabase } from "@/lib/supabase/browser";

// Event mode, set up by admins on the platform (Admin → Event mode):
//   status        rpc("event_mode_status")       is quick signup on right now (public)
//   quickSignup   functions/event-quick-signup   creates a confirmed mentee account; refused unless an event is on
//   liveFeed      rpc("event_live_feed")         the event and the draw countdown (public; no names, counts or winner)
//   myDrawResult  rpc("my_event_draw_result")    whether the viewer is in the draw; won / lost / not entered only once
//                                                the countdown has ended

export type QuickSignupInput = { fullName: string; email: string; phone: string; password: string; terms: boolean };
export type QuickSignupCode = "email_taken" | "phone_taken" | "event_off" | "rate_limited" | "weak_password" | "invalid_phone" | "invalid_email" | "invalid_name" | "terms" | "unknown";

export class QuickSignupError extends Error {
  constructor(public code: QuickSignupCode) {
    super(code);
  }
}

export type LiveFeed = {
  event: { id: string; name: string; active: boolean } | null;
  draw: { id: string; number: number; reveal_in_ms: number } | null;
};
// `entered`: the viewer is in the draw (signed in, joined during the event, not disqualified).
export type DrawResult = { status: "none" | "pending" | "won" | "lost" | "not_entered"; entered?: boolean; draw_id?: string; reveal_in_ms?: number };

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
    return { event: feed?.event ?? null, draw: feed?.draw ?? null };
  },

  async myDrawResult(): Promise<DrawResult> {
    const { data, error } = await browserSupabase().rpc("my_event_draw_result");
    if (error) throw error;
    return data as DrawResult;
  },
};
