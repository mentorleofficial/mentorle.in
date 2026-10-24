"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GatheringEvent } from "@/data/home";
import { useCarouselLoop } from "@/components/home/useCarouselLoop";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { MaskIcon } from "@/components/ui/MaskIcon";
import { ProgressiveBlur } from "@/components/ui/ProgressiveBlur";

const GAP_REM = 2.5;
const MIN_SLIDES = 5;
const AUTOPLAY_MS = 5000;

export function GatheringsCarousel({ events }: { events: GatheringEvent[] }) {
  const slides = useCarouselLoop(events, MIN_SLIDES);
  const [active, setActive] = useState(Math.floor(events.length / 2));
  const [paused, setPaused] = useState(false);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);
  const offsetsRef = useRef<number[] | null>(null);
  const layoutRef = useRef(-1);
  const touchStartX = useRef<number | null>(null);

  // Cards with a date and buttons need more room on phones than the homepage's title-only cards.
  const tall = events.some((event) => event.cta);

  const go = (next: number) => setActive(((next % slides.length) + slides.length) % slides.length);

  useEffect(() => {
    const onResize = () => setLayoutVersion((value) => value + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setActive((value) => (value + 1) % slides.length), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, paused, slides.length]);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-slide]", track);
      const cardWidth = items[0].offsetWidth;
      const gap = GAP_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const total = items.length;
      const relayout = layoutRef.current !== layoutVersion;
      layoutRef.current = layoutVersion;
      const previous = relayout ? null : offsetsRef.current;

      const offsets = items.map((_, index) => {
        let offset = (((index - active) % total) + total) % total;
        if (offset > total / 2) offset -= total;
        return offset;
      });

      items.forEach((item, index) => {
        const x = track.clientWidth / 2 + offsets[index] * (cardWidth + gap) - cardWidth / 2;
        const wrapped = !previous || Math.abs(offsets[index] - previous[index]) > total / 2;
        if (wrapped) {
          gsap.set(item, { x });
        } else {
          gsap.to(item, { x, duration: 0.9, ease: "power3.inOut", overwrite: true });
        }
      });
      offsetsRef.current = offsets;
    },
    { scope: trackRef, dependencies: [active, layoutVersion] },
  );

  return (
    <div
      className="overflow-hidden"
      role="region"
      aria-roledescription="carousel"
      aria-label="Upcoming events"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") go(active - 1);
        if (event.key === "ArrowRight") go(active + 1);
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current !== null) {
          const delta = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 40) go(active + (delta < 0 ? 1 : -1));
        }
        touchStartX.current = null;
        setPaused(false);
      }}
    >
      <ul
        ref={trackRef}
        className={`grid items-center sm:h-[26.25rem] lg:h-[33.25rem] ${tall ? "h-[26rem]" : "h-[18.75rem]"}`}
        style={{ "--card-w": "min(57.375rem, 82vw)" } as React.CSSProperties}
      >
        {slides.map(({ item: event, key, sourceIndex }, index) => {
          const isActive = index === active;
          return (
            <li
              key={key}
              data-slide
              aria-roledescription="slide"
              aria-label={`${sourceIndex + 1} of ${events.length}`}
              aria-current={isActive}
              className={`relative col-start-1 row-start-1 w-[var(--card-w)] justify-self-start overflow-hidden transition-[height] duration-[900ms] ease-in-out motion-reduce:transition-none ${
                isActive
                  ? `${tall ? "h-[26rem]" : "h-[18.75rem]"} sm:h-[26.25rem] lg:h-[33.25rem]`
                  : `${tall ? "h-[23.5rem]" : "h-[16.25rem]"} sm:h-[23.75rem] lg:h-[30.375rem]`
              }`}
            >
              <Image
                src={event.src}
                alt={event.alt}
                fill
                // Event banners come from many hosts (platform storage, stock sites); only local photos are optimized.
                unoptimized={event.src.startsWith("http")}
                sizes="(min-width: 1024px) 57rem, 82vw"
                className={`object-cover transition-transform duration-[1200ms] ease-out ${isActive ? "scale-100" : "scale-110"}`}
              />
              <ProgressiveBlur active={isActive} className={event.cta ? "h-[75%] sm:h-[62%]" : "h-[48%]"} />
              {event.tag && (
              <span
                aria-hidden={!isActive}
                className={`absolute top-6 left-6 bg-neutral-500/70 px-3 py-1.5 text-[0.9375rem] text-white backdrop-blur-md transition-opacity duration-500 md:top-8 md:left-8 ${
                  isActive ? "opacity-100 delay-300" : "opacity-0"
                }`}
              >
                {event.tag}
              </span>
              )}
              <div
                aria-hidden={!isActive}
                className={`absolute inset-x-0 bottom-0 px-6 pb-6 text-white transition-[opacity,translate] duration-500 sm:flex sm:items-end sm:justify-between sm:gap-8 md:px-8 md:pb-8 ${
                  isActive ? "translate-y-0 opacity-100 delay-300" : "translate-y-3 opacity-0"
                }`}
              >
                <div className="min-w-0">
                  <h3 className="text-xl font-medium md:text-2xl">{event.title}</h3>
                  {event.date && <p className="mt-1.5 text-sm text-white/95 md:text-base">{event.date}</p>}
                  <p
                    className={`text-sm leading-snug text-white/90 md:text-base ${
                      event.date ? "mt-4 max-w-[29.5rem]" : "mt-2 max-w-[20.625rem]"
                    }`}
                  >
                    {event.description}
                  </p>
                  {(event.audience || event.cta) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.audience && (
                        <span className="inline-flex h-[2.3125rem] items-center border border-white/30 bg-black/20 px-[1.125rem] text-sm">
                          {event.audience}
                        </span>
                      )}
                      {event.cta && isActive && (
                        <ButtonLink href={event.cta.href} external={event.cta.external} variant="light">
                          {event.cta.label}
                          <span className="sr-only">: {event.title}</span>
                        </ButtonLink>
                      )}
                    </div>
                  )}
                </div>
                {/* Time and date, bottom-right. Hidden on phones, where the fixed-height card has no room. */}
                {event.when && (
                  <ul className="hidden shrink-0 space-y-1.5 text-sm text-white sm:block md:text-[0.9375rem]">
                    <li className="flex items-center justify-end gap-2.5">
                      <MaskIcon src="/event-detail/deadline.svg" className="size-4" />
                      {event.when.time}
                    </li>
                    <li className="flex items-center justify-end gap-2.5">
                      <MaskIcon src="/event-detail/date-and-time.svg" className="size-4" />
                      {event.when.day}
                    </li>
                  </ul>
                )}
              </div>
              {!isActive && (
                <button
                  type="button"
                  className="absolute inset-0 bg-white/0 transition-colors hover:bg-white/10"
                  aria-label={`Show ${event.title}`}
                  onClick={() => go(index)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
