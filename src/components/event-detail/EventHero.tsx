import Image from "next/image";
import Link from "next/link";
import { eventDetailCopy } from "@/data/event-details";
import type { EventDetail } from "@/data/event-details";
import { prefetchFor } from "@/lib/routes";

const { breadcrumb, hostedBy, status: statusLabels } = eventDetailCopy;

// Left-aligned hero with breadcrumb, status chip and host line. The background export is already blurred
// and darkened, so there's no overlay. Desktop height comes out at the design's 520px from the padding.
export function EventHero({ event }: { event: EventDetail }) {
  return (
    <section aria-labelledby="event-title" className="relative isolate overflow-hidden bg-ink text-white md:min-h-[32.5rem]">
      <Image src={event.hero.src} alt={event.hero.alt} fill preload sizes="100vw" className="-z-10 object-cover" />

      <div className="container-page pt-28 pb-12 md:pt-[10.5rem] md:pb-16 xl:pt-[12.125rem]">
        <nav aria-label="Breadcrumb" data-hero="1">
          <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.9375rem]">
            <li>
              <Link
                href={breadcrumb.parentHref}
                prefetch={prefetchFor(breadcrumb.parentHref)}
                className="group inline-flex items-center gap-3.5 text-white transition-colors hover:text-white/80"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden>
                  <path d="M14 8H2M7 3L2 8l5 5" />
                </svg>
                {breadcrumb.parent}
              </Link>
            </li>
            <li aria-hidden className="text-white/70">
              /
            </li>
            <li aria-current="page">{breadcrumb.current}</li>
          </ol>
        </nav>

        <div data-hero="2" className="mt-4 flex items-center gap-3 text-[0.9375rem]">
          <span className="inline-flex h-[2.25rem] items-center gap-2.5 bg-[#fff0ea] px-3.5 text-brand">
            {event.status === "completed" && (
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-3.5" aria-hidden>
                <path d="M2.5 8.5l3.5 3.5 7.5-8" />
              </svg>
            )}
            {statusLabels[event.status]}
          </span>
          <span>{event.kind}</span>
        </div>

        <h1 id="event-title" data-hero="3" className="mt-6 max-w-[56rem] text-[2.125rem] leading-[1.18] font-medium md:text-5xl">
          {event.title}
        </h1>
        <p data-hero="4" className="mt-5 text-lg leading-snug md:mt-[1.625rem] md:text-xl">
          {event.subtitle}
        </p>
        <p data-hero="5" className="mt-5 text-base text-white/85 md:mt-6">
          {hostedBy} {event.host}
        </p>
      </div>
    </section>
  );
}

// Shown only while an event that wasn't prerendered streams in: the hero's dark band at the same size.
export function EventHeroPlaceholder() {
  return <div className="min-h-[24rem] bg-ink md:min-h-[32.5rem]" aria-hidden />;
}
