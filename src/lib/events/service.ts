"use client";

import { browserSupabase } from "@/lib/supabase/browser";

/*
 * Event registration on the platform's tables, the same calls as its mentee events page
 * (../Mentorle-Version2/src/features/mentor-events/api/events.ts):
 *   registerForEvent    → capacity check on events_programs, then insert into event_participants
 *   unregisterFromEvent → delete from event_participants
 *   isRegistered        → the user's own event_participants row (RLS: users read their own)
 *   getMeetingLink      → rpc("get_event_meeting_links"), which only answers registered attendees, the event's
 *                         creator and admins
 * Plus-quota and paid (Cashfree) registration aren't here yet: paid events don't offer registration.
 */

const db = () => browserSupabase();

export class EventFullError extends Error {}

export const eventsService = {
  async isRegistered(eventId: string, userId: string) {
    const { data, error } = await db().from("event_participants").select("id").eq("event_id", eventId).eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return Boolean(data);
  },

  async registerForEvent(eventId: string, userId: string) {
    const { data: event, error: eventError } = await db().from("events_programs").select("max_participants, participant_count").eq("id", eventId).single();
    if (eventError) throw eventError;
    if (event.max_participants && (event.participant_count ?? 0) >= event.max_participants) throw new EventFullError();
    const { error } = await db().from("event_participants").insert({ event_id: eventId, user_id: userId, registered_at: new Date().toISOString() });
    // 23505: already registered (e.g. in another tab), which is the outcome the user wanted.
    if (error && error.code !== "23505") throw error;
  },

  async unregisterFromEvent(eventId: string, userId: string) {
    const { error } = await db().from("event_participants").delete().eq("event_id", eventId).eq("user_id", userId);
    if (error) throw error;
  },

  async getMeetingLink(eventId: string): Promise<string | null> {
    const { data, error } = await db().rpc("get_event_meeting_links", { _event_ids: [eventId] });
    if (error) throw error;
    return (data as { meeting_link: string | null }[] | null)?.[0]?.meeting_link ?? null;
  },
};
