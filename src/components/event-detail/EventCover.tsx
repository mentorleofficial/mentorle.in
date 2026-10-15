import Image from "next/image";
import { eventDetailCopy } from "@/data/event-details";
import type { CoverIcon, EventDetail } from "@/data/event-details";
import { formatEventDate, formatEventTime } from "@/lib/dates";

const coverIcons: Record<CoverIcon, { src: string; width: number; height: number }> = {
  graduation: { src: "/event-detail/vector-1.svg", width: 32, height: 23 },
  briefcase: { src: "/event-detail/vector-2.svg", width: 29, height: 26 },
};

// The dark "poster" under the hero, built from the event record rather than an exported image, so every
// event gets its own: brand + host, a brand rule, the title in caps, subtitle, an optional journey row
// (from icon → arrow → to icon) and the date. It repeats the hero's text, so it's hidden from screen readers.
export function EventCover({ event }: { event: EventDetail }) {
  const journey = event.cover.journey;
  return (
    <div aria-hidden className="flex min-h-[20rem] flex-col bg-ink p-6 text-white sm:p-8 md:min-h-[28rem] md:p-10">
      <div className="flex items-baseline justify-between gap-6">
        <span className="text-base font-semibold">{eventDetailCopy.coverBrand}</span>
        <span className="text-right text-sm text-white/80">{event.host}</span>
      </div>

      <span className="mt-12 block h-[3px] w-12 bg-brand md:mt-[4.25rem]" />
      <p className="mt-4 max-w-[28rem] text-[1.75rem] leading-[1.13] font-medium uppercase sm:text-[2.25rem] md:text-[2.875rem]">{event.title}</p>
      <p className="mt-4 text-base text-white/80 md:text-lg">{event.subtitle}</p>

      <div className="mt-auto flex items-center justify-between gap-6 pt-10 md:pt-12">
        {journey ? (
          <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-[1.375rem]">
            <Image src={coverIcons[journey[0]].src} alt="" width={coverIcons[journey[0]].width} height={coverIcons[journey[0]].height} className="h-auto w-6 shrink-0 md:w-8" />
            <Image src="/event-detail/arrow.svg" alt="" width={201} height={21} className="h-auto w-full max-w-[12.5625rem] min-w-0" />
            <Image src={coverIcons[journey[1]].src} alt="" width={coverIcons[journey[1]].width} height={coverIcons[journey[1]].height} className="h-auto w-[1.375rem] shrink-0 md:w-[1.8125rem]" />
          </div>
        ) : (
          <span />
        )}
        <p className="shrink-0 text-right text-sm leading-[1.375rem]">
          {formatEventDate(event.startsAt)}
          <br />
          <span className="text-white/80">{formatEventTime(event.startsAt)}</span>
        </p>
      </div>
    </div>
  );
}
