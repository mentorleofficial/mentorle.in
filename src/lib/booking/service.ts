"use client";

import { browserSupabase } from "@/lib/supabase/browser";

/*
 * Booking on the platform's database, through the functions it shares with the platform's own booking dialog:
 *   openSlots   → rpc("mentor_open_slots")   open start times for an offering (public: no sign-in needed)
 *   book        → rpc("book_session")        validates everything on the server and creates the session
 *   sendEmails  → functions "send-booking-email" (confirmation to mentee and mentor, once per session)
 * Paid offerings are refused by book_session; they'll go through checkout.
 */

const db = () => browserSupabase();

export class SlotTakenError extends Error {}

export const bookingService = {
  async openSlots(offeringId: string): Promise<string[]> {
    const { data, error } = await db().rpc("mentor_open_slots", { _offering_id: offeringId, _days: 90 });
    if (error) throw error;
    return ((data ?? []) as { starts_at: string }[]).map((row) => row.starts_at);
  },

  async book(input: { offeringId: string; startsAt: string; notes: string }): Promise<{ sessionId: string; meetingUrl: string }> {
    const { data, error } = await db().rpc("book_session", { _offering_id: input.offeringId, _scheduled_at: input.startsAt, _notes: input.notes });
    if (error) {
      if (error.code === "23P01" || /no longer available|overlap/i.test(error.message)) throw new SlotTakenError(error.message);
      throw error;
    }
    const row = (data as { session_id: string; meeting_url: string }[] | null)?.[0];
    if (!row) throw new Error("Booking failed");
    return { sessionId: row.session_id, meetingUrl: row.meeting_url };
  },

  // Best effort: the booking stands even if the email fails.
  async sendEmails(sessionId: string) {
    await db().functions.invoke("send-booking-email", { body: { sessionId } }).catch(() => undefined);
  },
};
