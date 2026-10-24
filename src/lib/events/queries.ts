import { cacheLife, cacheTag } from "next/cache";
import type { CoverIcon, EventDetail, EventSpeaker, EventStatus } from "@/data/event-details";
import { eventDetailCopy } from "@/data/event-details";
import type { GatheringEvent, ImageAsset } from "@/data/home";
import { formatEventDate, formatEventDay, formatEventTimeRange } from "@/lib/dates";
import { publicSupabase } from "@/lib/supabase/public";

// Events from the platform's events_programs table (public read). Only the columns below are selected:
// meeting_link must never reach the page, since it's meant for registered attendees only.
// Cached for everyone for about a minute, tagged "events".

const COLUMNS = [
  "id",
  "slug",
  "title",
  "subtitle",
  "event_type",
  "college_name",
  "location",
  "start_date",
  "end_date",
  "registration_deadline",
  "max_participants",
  "participant_count",
  "banner_image_url",
  "status",
  "speaker_name",
  "speaker_image",
  "speaker_linkedin",
  "speaker_github",
  "description",
  "learning_outcomes",
  "prerequisites",
  "highlights",
  "price",
  "registration_link",
].join(",");

type EventRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  event_type: string;
  college_name: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  registration_deadline: string | null;
  max_participants: number | null;
  participant_count: number | null;
  banner_image_url: string | null;
  status: string | null;
  speaker_name: string | null;
  speaker_image: string | null;
  speaker_linkedin: string | null;
  speaker_github: string | null;
  description: string | null;
  learning_outcomes: string | null;
  prerequisites: string | null;
  highlights: string[] | null;
  price: number | string | null;
  registration_link: string | null;
};

const KINDS: Record<string, string> = {
  workshop: "Workshop",
  bootcamp: "Bootcamp",
  guest_session: "Guest Session",
  event: "Event",
};

const clean = (value: string | null | undefined) => value?.trim() || null;
// "Online" in college_name means no host institution: Mentorle runs it.
const isPlaceholderPlace = (value: string | null) => !value || /^(online|offline|mentorle)$/i.test(value.trim());

// Platform text fields are free text: some arrive HTML-encoded ("LinkedIn &amp; Resume"), some use Markdown
// bold or list bullets (✓ • - * 1.). These become plain text and plain lines.
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
const decode = (value: string) =>
  value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const point = code[1].toLowerCase() === "x" ? Number.parseInt(code.slice(2), 16) : Number.parseInt(code.slice(1), 10);
      return Number.isFinite(point) ? String.fromCodePoint(point) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
const plain = (value: string) => decode(value).replace(/\*\*(.+?)\*\*/g, "$1").replace(/__(.+?)__/g, "$1");
const toLines = (value: string | null) =>
  (value ?? "")
    .split(/\r?\n/)
    .map((line) => plain(line).replace(/^\s*(?:[-*•✓✔▪◦·]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
const toParagraphs = (value: string | null) =>
  (value ?? "")
    .split(/\r?\n\s*\r?\n|\r?\n/)
    .map((paragraph) => plain(paragraph).trim())
    .filter(Boolean);

// The stored status is rarely updated after an event ends, so it's worked out from the dates; only an
// explicit "cancelled" is taken from the row.
function statusOf(row: EventRow, now: number): EventStatus {
  if (row.status === "cancelled") return "cancelled";
  const start = Date.parse(row.start_date);
  const end = Date.parse(row.end_date ?? row.start_date);
  if (now < start) return "upcoming";
  return now <= Math.max(end, start) ? "live" : "completed";
}

function toDetail(row: EventRow, now: number): EventDetail {
  const status = statusOf(row, now);
  const host = isPlaceholderPlace(row.college_name) ? "Mentorle" : row.college_name!.trim();
  const location = clean(row.location);
  const venue = [location, isPlaceholderPlace(row.college_name) ? null : host].filter(Boolean).join(", ") || "Online";
  const deadline = row.registration_deadline ?? row.start_date;
  const price = Number(row.price) || 0;
  const full = row.max_participants != null && (row.participant_count ?? 0) >= row.max_participants;
  const closedReason = status !== "upcoming" ? undefined : price > 0 ? "paid" : Date.parse(deadline) < now ? "deadline" : full ? "full" : undefined;

  const speakers: EventSpeaker[] = clean(row.speaker_name)
    ? [
        {
          name: clean(row.speaker_name)!,
          photo: clean(row.speaker_image) ? { src: clean(row.speaker_image)!, width: 144, height: 144 } : undefined,
          links: [
            ...(clean(row.speaker_linkedin) ? [{ label: "LinkedIn", href: clean(row.speaker_linkedin)! }] : []),
            ...(clean(row.speaker_github) ? [{ label: "GitHub", href: clean(row.speaker_github)! }] : []),
          ],
        },
      ]
    : [];

  const kind = KINDS[row.event_type] ?? "Event";
  const title = plain(row.title).trim();
  return {
    id: row.id,
    slug: row.slug,
    kind,
    status,
    title,
    subtitle: clean(row.subtitle) && plain(clean(row.subtitle)!),
    host,
    startsAt: row.start_date,
    endsAt: row.end_date ?? row.start_date,
    registrationDeadline: deadline,
    venue,
    banner: clean(row.banner_image_url) ? { src: clean(row.banner_image_url)!, alt: `${title} banner` } : null,
    // Campus events show the student → career journey on the generated cover.
    cover: { journey: (row.event_type === "event" && !isPlaceholderPlace(row.college_name) ? ["graduation", "briefcase"] : undefined) as [CoverIcon, CoverIcon] | undefined },
    about: toParagraphs(row.description),
    learn: toLines(row.learning_outcomes),
    prerequisites: toLines(row.prerequisites),
    highlights: (row.highlights ?? []).map((item) => plain(item).trim()).filter(Boolean),
    speakers,
    registration:
      status === "upcoming" && !closedReason
        ? { label: eventDetailCopy.registration.register, maxParticipants: row.max_participants ?? undefined, externalLink: clean(row.registration_link) ?? undefined }
        : undefined,
    closedReason,
  };
}

async function fetchEvents(): Promise<EventRow[]> {
  const { data, error } = await publicSupabase().from("events_programs").select(COLUMNS).order("start_date", { ascending: true });
  if (error) throw new Error(`events_programs read failed: ${error.message}`);
  return (data ?? []) as unknown as EventRow[];
}

export async function getEvents(): Promise<EventDetail[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("events");
  const now = Date.now();
  return (await fetchEvents()).filter((row) => !!row.slug).map((row) => toDetail(row, now));
}

export async function getEvent(slug: string): Promise<EventDetail | null> {
  return (await getEvents()).find((event) => event.slug === slug) ?? null;
}

export async function getEventSlugs(): Promise<string[]> {
  return (await getEvents()).map((event) => event.slug);
}

// Stand-in photos for carousel cards of events without a banner (the design's gathering photos).
const fallbackImages: ImageAsset[] = [
  { src: "/homepage/live-gatherings/image-1.webp", width: 700, height: 998 },
  { src: "/homepage/live-gatherings/image-2.webp", width: 1836, height: 1064 },
  { src: "/homepage/live-gatherings/image-3.webp", width: 1200, height: 1800 },
];

const excerpt = (paragraphs: string[], max = 160) => {
  const text = paragraphs[0] ?? "";
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text;
};

// Carousel cards for "Upcoming Events & Summits" / "Our upcoming gatherings": upcoming and live events
// (soonest first), topped up with the most recent past ones so the carousel is never empty.
export async function getGatherings(limit = 5): Promise<GatheringEvent[]> {
  const events = (await getEvents()).filter((event) => event.status !== "cancelled");
  const current = events.filter((event) => event.status !== "completed");
  const past = events.filter((event) => event.status === "completed").reverse();
  const ordered = [...current, ...past].slice(0, Math.max(limit, 0));
  // The carousel opens on its middle card, so rotate the soonest event into that position.
  const middle = Math.floor(ordered.length / 2);
  const picked = [...ordered.slice(ordered.length - middle), ...ordered.slice(0, ordered.length - middle)];
  return picked.map((event, index) => {
    const image = event.banner ? { src: event.banner.src, width: 1600, height: 900 } : fallbackImages[index % fallbackImages.length];
    const open = event.status === "upcoming" || event.status === "live";
    return {
      ...image,
      tag: open ? event.kind : `${event.kind} · ${eventDetailCopy.status.completed}`,
      title: event.title,
      date: formatEventDate(event.startsAt),
      description: event.subtitle ?? excerpt(event.about),
      alt: event.banner?.alt ?? "",
      cta: { label: event.registration ? event.registration.label : eventDetailCopy.viewEvent, href: `/events/${event.slug}` },
      when: { time: formatEventTimeRange(event.startsAt, event.endsAt), day: formatEventDay(event.startsAt) },
    };
  });
}
