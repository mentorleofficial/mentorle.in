import { opportunitySources as copy } from "@/data/events";
import type { Opportunity } from "@/data/events";
import { formatRupees } from "@/data/payments";
import { formatEventDate } from "@/lib/dates";
import { getEvents } from "@/lib/events/queries";
import { getHuptleJobs } from "@/lib/jobs/huptle";

// The /events opportunity feed: Mentorle's upcoming events first (soonest first), then Huptle's open jobs (newest
// first). Both sources are cached for a few minutes; a source that's down just adds nothing.
export async function getOpportunities(): Promise<Opportunity[]> {
  const [events, jobs] = await Promise.all([getEvents().catch(() => []), getHuptleJobs()]);

  const fromEvents: Opportunity[] = events
    .filter((event) => event.status === "upcoming" || event.status === "live")
    .map((event) => ({
      id: `mentorle-${event.id}`,
      type: "event",
      source: copy.mentorle.source,
      categories: [event.kind],
      title: event.title,
      organiser: event.host || undefined,
      location: event.venue || undefined,
      reward: event.registration ? (event.registration.price > 0 ? formatRupees(event.registration.price) : copy.mentorle.free) : undefined,
      url: `/events/${event.slug}`,
      media: event.banner
        ? { kind: "image", src: event.banner.src, width: 1600, height: 900, alt: event.banner.alt }
        : { kind: "poster", brand: copy.mentorle.poster, corner: formatEventDate(event.startsAt) },
    }));

  const fromJobs: Opportunity[] = [...jobs]
    .sort((a, b) => Date.parse(b.createdAt || "0") - Date.parse(a.createdAt || "0"))
    .map((job) => ({
      id: `huptle-${job.id}`,
      type: "job",
      source: copy.huptle.source,
      categories: [copy.huptle.job, ...(job.screeningDurationMin ? [copy.huptle.screening(job.screeningDurationMin)] : [])],
      title: job.title,
      organiser: job.department || undefined,
      location: job.location || job.mode || undefined,
      // A new tab, so mentorle.in stays open: the apply step (log in / verify email) runs there, then it goes to Huptle.
      url: `/jobs/${job.id}/apply`,
      external: true,
      cta: copy.huptle.cta,
      note: copy.huptle.note,
      media: { kind: "poster", brand: copy.huptle.poster, corner: job.mode || copy.huptle.job },
    }));

  return [...fromEvents, ...fromJobs];
}
