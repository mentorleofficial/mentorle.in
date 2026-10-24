"use client";

import { browserSupabase } from "@/lib/supabase/browser";

// The signed-in mentee's sessions, read like the platform's "My Sessions" (useMenteeSessions): their own rows
// (RLS "Mentees read own sessions") with the mentor's name and photo. The mentor's public profile slug comes
// from get_public_mentor (mentor_profiles isn't readable to signed-in users).

export type SessionStatus = "booked" | "completed" | "cancelled" | "no_show";

export type MySession = {
  id: string;
  startsAt: string;
  durationMinutes: number;
  status: SessionStatus;
  title: string;
  notes: string;
  meetingUrl: string;
  cancellationReason: string;
  previousStartsAt: string | null;
  mentor: { id: string; name: string; avatarUrl: string | null; slug: string | null };
};

type Row = {
  id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: SessionStatus;
  title: string | null;
  mentee_notes: string | null;
  meeting_url: string | null;
  cancellation_reason: string | null;
  previous_scheduled_at: string | null;
  mentor_id: string;
  mentor: { full_name: string | null; avatar_url: string | null } | null;
};

const SELECT =
  "id, scheduled_at, duration_minutes, status, title, mentee_notes, meeting_url, cancellation_reason, previous_scheduled_at, mentor_id, mentor:users!sessions_mentor_id_fkey(full_name, avatar_url)";

async function mentorSlugs(ids: string[]) {
  const entries = await Promise.all(
    ids.map(async (id) => {
      const { data } = await browserSupabase().rpc("get_public_mentor", { _slug_or_id: id });
      return [id, (data as { slug: string | null }[] | null)?.[0]?.slug ?? null] as const;
    }),
  );
  return new Map(entries);
}

export const sessionsService = {
  async listMine(userId: string): Promise<MySession[]> {
    const { data, error } = await browserSupabase().from("sessions").select(SELECT).eq("mentee_id", userId).order("scheduled_at", { ascending: false }).limit(200);
    if (error) throw new Error(`sessions failed: ${error.message}`);
    const rows = (data ?? []) as unknown as Row[];
    const slugs = await mentorSlugs([...new Set(rows.map((row) => row.mentor_id))]);
    return rows.map((row) => ({
      id: row.id,
      startsAt: row.scheduled_at,
      durationMinutes: row.duration_minutes,
      status: row.status,
      title: row.title?.trim() || "Mentorship session",
      notes: row.mentee_notes?.trim() ?? "",
      meetingUrl: row.meeting_url ?? "",
      cancellationReason: row.cancellation_reason?.trim() ?? "",
      previousStartsAt: row.previous_scheduled_at,
      mentor: { id: row.mentor_id, name: row.mentor?.full_name || "Your mentor", avatarUrl: row.mentor?.avatar_url ?? null, slug: slugs.get(row.mentor_id) ?? null },
    }));
  },
};

export const endsAt = (session: MySession) => Date.parse(session.startsAt) + session.durationMinutes * 60_000;

// Upcoming: booked and not over yet (a session in progress still shows its Join button). Soonest first.
export function splitSessions(sessions: MySession[], now: number) {
  const upcoming = sessions.filter((session) => session.status === "booked" && endsAt(session) > now).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const past = sessions.filter((session) => !upcoming.includes(session)).sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));
  return { upcoming, past };
}
