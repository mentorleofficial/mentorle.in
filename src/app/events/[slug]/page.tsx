import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EventContent } from "@/components/event-detail/EventContent";
import { EventCover } from "@/components/event-detail/EventCover";
import { EventHero, EventHeroPlaceholder } from "@/components/event-detail/EventHero";
import { EventDetailsCard, HighlightsCard, SpeakersCard } from "@/components/event-detail/EventSidebar";
import { getEvent, getEventSlugs } from "@/data/event-details";

// Every event in the data file is prerendered. Cache Components needs at least one slug here; when events
// come from the database, return the published slugs (new ones render on first visit).
export async function generateStaticParams() {
  return getEventSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = getEvent((await params).slug);
  if (!event) return {};
  return { title: event.title, description: `${event.subtitle}. Hosted by ${event.host}.` };
}

// `params` is read inside Suspense so navigations stay instant (Cache Components): prerendered events render
// in full; an event that isn't prerendered yet streams in behind a hero-sized placeholder. An unknown slug
// shows the not-found page with noindex. Its status is 200 because the shell has already streamed; a real
// 404 status needs a Proxy check before rendering (see Next's not-found docs), worth adding with the DB.
export default function EventDetailPage({ params }: PageProps<"/events/[slug]">) {
  return (
    <Suspense fallback={<EventHeroPlaceholder />}>
      {params.then(({ slug }) => (
        <EventView slug={slug} />
      ))}
    </Suspense>
  );
}

function EventView({ slug }: { slug: string }) {
  const event = getEvent(slug);
  if (!event) notFound();

  return (
    <>
      <EventHero event={event} />
      <section aria-label="Event information" className="bg-dots pt-10 pb-16 md:pt-16 md:pb-[5.5rem]">
        {/* Row 1: cover + details card; row 2: content + speaker/highlights. Stacks in that order below lg. */}
        <div className="container-page grid gap-y-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-x-10 lg:gap-y-[4.5rem] xl:grid-cols-[minmax(0,1fr)_25.875rem]">
          <div data-animate="fade-up">
            <EventCover event={event} />
          </div>
          <EventDetailsCard event={event} />
          <EventContent event={event} />
          <div className="flex flex-col gap-7 lg:self-start">
            <SpeakersCard speakers={event.speakers} />
            <HighlightsCard highlights={event.highlights} />
          </div>
        </div>
      </section>
    </>
  );
}
