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
  // The mentee's rating of the mentor (audience "mentor"), with the mentor's reply if any.
  myRating: { rating: number; comment: string; reply: string } | null;
  // The mentor's feedback about the mentee (audience "mentee").
  mentorFeedback: { rating: number; comment: string } | null;
};

type FeedbackRow = { rating: number; comment: string | null; audience: string; response: string | null };

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
  feedback: FeedbackRow[] | null;
};

const SELECT =
  "id, scheduled_at, duration_minutes, status, title, mentee_notes, meeting_url, cancellation_reason, previous_scheduled_at, mentor_id, mentor:users!sessions_mentor_id_fkey(full_name, avatar_url), feedback(rating, comment, audience, response)";

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
      myRating: pickFeedback(row.feedback, "mentor", (f) => ({ rating: f.rating, comment: cleanComment(f.comment), reply: f.response?.trim() ?? "" })),
      mentorFeedback: pickFeedback(row.feedback, "mentee", (f) => ({ rating: f.rating, comment: cleanComment(f.comment) })),
    }));
  },

  // The platform's mentee survey (MenteeFeedbackSurvey): one feedback row for the mentor, rated by the rounded
  // average, with the answers written under the comment in the platform's format. Completed sessions only.
  async rate(input: { sessionId: string; userId: string; answers: Record<string, number>; expectationLabel: string; comment: string }) {
    const { answers } = input;
    const values = Object.values(answers);
    const rating = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
    const survey = [
      `Did the mentorship program help you achieve what you expected?: ${input.expectationLabel}`,
      `Guidance quality: ${answers.guidance} / 5 stars`,
      `Engagement: ${answers.engagement} / 5 stars`,
      `Practical insights: ${answers.insights} / 5 stars`,
      `Overall mentorship value: ${answers.value} / 5 stars`,
    ].join("\n");
    const comment = input.comment.trim() ? `${input.comment.trim()}\n\n${SURVEY_DELIMITER}${survey}` : `Survey Responses:\n${survey}`;
    const { error } = await browserSupabase().from("feedback").insert({ session_id: input.sessionId, submitted_by: input.userId, rating, comment, audience: "mentor" });
    if (error) throw new Error(`feedback failed: ${error.message}`);
    return { rating, comment: input.comment.trim(), reply: "" };
  },
};

// The platform appends the survey answers to the comment; only the mentee's own words are shown.
const SURVEY_DELIMITER = "---\nSurvey Responses:\n";
function cleanComment(comment: string | null) {
  if (!comment) return "";
  const index = comment.indexOf(SURVEY_DELIMITER);
  if (index !== -1) return comment.slice(0, index).trim();
  return comment.startsWith("Survey Responses:\n") ? "" : comment.trim();
}

function pickFeedback<T>(rows: FeedbackRow[] | null, audience: string, map: (row: FeedbackRow) => T): T | null {
  const row = rows?.find((item) => item.audience === audience);
  return row ? map(row) : null;
}

export const endsAt = (session: MySession) => Date.parse(session.startsAt) + session.durationMinutes * 60_000;

// Upcoming: booked and not over yet (a session in progress still shows its Join button). Soonest first.
export function splitSessions(sessions: MySession[], now: number) {
  const upcoming = sessions.filter((session) => session.status === "booked" && endsAt(session) > now).sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const past = sessions.filter((session) => !upcoming.includes(session)).sort((a, b) => Date.parse(b.startsAt) - Date.parse(a.startsAt));
  return { upcoming, past };
}
