import { cacheLife, cacheTag } from "next/cache";
import { SESSION_TYPES, formatYears, toSessionType } from "@/data/mentors";
import type { Mentor, SessionType } from "@/data/mentors";
import type { BookingRules, MentorExperience, MentorOffering, MentorProfile } from "@/data/mentor-details";
import { publicSupabase } from "@/lib/supabase/public";

// Public mentor data from the platform's database, through the same RPCs the platform's public pages use:
//   list_public_mentors()            → directory cards (active, non-disabled mentors only)
//   list_featured_mentors()          → the homepage's mentors, picked by an admin (Admin → Settings → Homepage)
//   get_public_mentor(_slug_or_id)   → one profile (anonymous callers only ever get active mentors)
//   list_public_offerings()          → every active offering; grouped or filtered by mentor here
// Results are cached for everyone ("minutes": a change on the platform shows within about a minute) and
// tagged "mentors" so a future platform webhook can refresh them on demand.

type MentorRow = {
  user_id: string;
  slug: string | null;
  full_name: string | null;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  expertise: string[] | null;
  years_experience: number | null;
  current_role: string | null;
  current_organization: string | null;
};

type ProfileRow = MentorRow & {
  linkedin_url: string | null;
  portfolio_url: string | null;
  experiences: unknown;
  is_active: boolean;
};

type OfferingRow = {
  id: string;
  title: string;
  description: string | null;
  duration_minutes: number;
  price: number | string;
  category: string | null;
  mentor_id: string;
};

const clean = (value: string | null | undefined) => value?.trim() || null;

async function listOfferings(): Promise<OfferingRow[]> {
  const { data, error } = await publicSupabase().rpc("list_public_offerings");
  if (error) throw new Error(`list_public_offerings failed: ${error.message}`);
  return data as OfferingRow[];
}

function toCard(row: MentorRow & { slug: string }, offerings: OfferingRow[]): Mentor {
  const role = clean(row.current_role);
  const company = clean(row.current_organization);
  const expertise = (row.expertise ?? []).map((tag) => tag.trim()).filter(Boolean);
  const years = row.years_experience ?? 0;
  const types = new Set(offerings.filter((offering) => offering.mentor_id === row.user_id).map((offering) => toSessionType(offering.category)));
  return {
    slug: row.slug,
    name: clean(row.full_name) ?? "Mentorle mentor",
    role: [role, company].filter(Boolean).join(" · "),
    company,
    years,
    experience: formatYears(years),
    // Some mentors typed several skills into one tag ("Branding; Strategic Marketing"); the badge takes the first.
    focus: expertise[0]?.split(/[;,]/)[0].trim() || null,
    expertise,
    sessionTypes: SESSION_TYPES.filter((type): type is SessionType => types.has(type)),
    photo: clean(row.avatar_url),
  };
}

const hasSlug = (row: MentorRow): row is MentorRow & { slug: string } => !!row.slug;

// Mentors with a photo first, then the most experienced, so the directory opens on complete cards.
const byCompleteness = (a: Mentor, b: Mentor) => Number(!!b.photo) - Number(!!a.photo) || b.years - a.years || a.name.localeCompare(b.name);

export async function getPublicMentors(): Promise<Mentor[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("mentors");
  const [{ data, error }, offerings] = await Promise.all([publicSupabase().rpc("list_public_mentors"), listOfferings()]);
  if (error) throw new Error(`list_public_mentors failed: ${error.message}`);
  return (data as MentorRow[])
    .filter(hasSlug)
    .map((row) => toCard(row, offerings))
    .sort(byCompleteness);
}

// Only the mentors an admin picked, in their slot order. None picked → an empty list (the homepage hides the cards).
export async function getFeaturedMentors(): Promise<Mentor[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("mentors", "featured-mentors");
  const [{ data, error }, offerings] = await Promise.all([publicSupabase().rpc("list_featured_mentors"), listOfferings()]);
  // PGRST202: the platform migration that adds the function isn't applied yet; treat it as nothing featured.
  if (error?.code === "PGRST202") return [];
  if (error) throw new Error(`list_featured_mentors failed: ${error.message}`);
  return (data as MentorRow[]).filter(hasSlug).map((row) => toCard(row, offerings));
}

export async function getMentorSlugs(): Promise<string[]> {
  return (await getPublicMentors()).map((mentor) => mentor.slug);
}

const text = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

// Platform `experiences` jsonb: [{ company, title, location, start_date: "YYYY-MM", end_date: "YYYY-MM" | "" }].
function toExperiences(value: unknown): MentorExperience[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const entry = (item ?? {}) as Record<string, unknown>;
    const title = text(entry.title);
    const company = text(entry.company);
    const startDate = text(entry.start_date);
    if (!title || !company || !startDate) return [];
    return [{ title, company, startDate, location: text(entry.location), endDate: text(entry.end_date), description: text(entry.description) }];
  });
}

// Whether an offering has any open start time in the next 90 days (the mentor set hours and isn't fully booked).
async function hasOpenTimes(offeringId: string) {
  const { data, error } = await publicSupabase().rpc("mentor_open_slots", { _offering_id: offeringId, _days: 90 });
  if (error) throw new Error(`mentor_open_slots failed: ${error.message}`);
  return (data ?? []).length > 0;
}

async function getMentorOfferings(mentorId: string): Promise<MentorOffering[]> {
  const rows = (await listOfferings()).filter((row) => row.mentor_id === mentorId);
  return Promise.all(
    rows.map(async (row) => ({
      id: row.id,
      title: row.title,
      description: clean(row.description) ?? "",
      durationMinutes: row.duration_minutes,
      price: Number(row.price) || 0,
      hasOpenTimes: await hasOpenTimes(row.id),
    })),
  );
}

type RulesRow = { cancellation_notice_hours: number; allow_reschedule: boolean; reschedule_notice_hours: number };

async function getBookingRules(mentorId: string): Promise<BookingRules | null> {
  const { data, error } = await publicSupabase().rpc("mentor_booking_rules", { _mentor_id: mentorId });
  if (error) throw new Error(`mentor_booking_rules failed: ${error.message}`);
  const row = (data as RulesRow[] | null)?.[0];
  return row ? { cancellationNoticeHours: row.cancellation_notice_hours, allowReschedule: row.allow_reschedule, rescheduleNoticeHours: row.reschedule_notice_hours } : null;
}

export async function getMentorProfile(slug: string): Promise<MentorProfile | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("mentors", `mentor:${slug}`);
  const { data, error } = await publicSupabase().rpc("get_public_mentor", { _slug_or_id: slug });
  if (error) throw new Error(`get_public_mentor failed: ${error.message}`);
  const row = (data as ProfileRow[])[0];
  // Only the canonical slug is a public URL (the RPC also accepts a user id).
  if (!row || !row.is_active || row.slug !== slug) return null;
  const [offerings, bookingRules] = await Promise.all([getMentorOfferings(row.user_id), getBookingRules(row.user_id)]);
  return {
    userId: row.user_id,
    slug,
    fullName: clean(row.full_name) ?? "Mentorle mentor",
    avatarUrl: clean(row.avatar_url),
    headline: clean(row.headline),
    bio: row.bio ?? "",
    expertise: (row.expertise ?? []).map((tag) => tag.trim()).filter(Boolean),
    yearsExperience: row.years_experience ?? 0,
    currentOrganization: clean(row.current_organization),
    currentRole: clean(row.current_role),
    linkedinUrl: clean(row.linkedin_url),
    portfolioUrl: clean(row.portfolio_url),
    experiences: toExperiences(row.experiences),
    offerings,
    bookingRules,
  };
}
