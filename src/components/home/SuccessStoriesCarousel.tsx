"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowControls } from "@/components/ui/ArrowControls";
import { useCarouselLoop } from "@/components/home/useCarouselLoop";
import type { SuccessStory } from "@/data/home";

const GAP_REM = 1.25;
const MIN_SLIDES = 8;
const PEEK_MIN_GUTTER_PX = 120;
const AUTOPLAY_MS = 6000;

export function SuccessStoriesCarousel({ stories }: { stories: SuccessStory[] }) {
  const slides = useCarouselLoop(stories, MIN_SLIDES);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const trackRef = useRef<HTMLUListElement>(null);
  const alignRef = useRef<HTMLDivElement>(null);
  const offsetsRef = useRef<number[] | null>(null);
  const layoutRef = useRef(-1);
  const touchStartX = useRef<number | null>(null);

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
      const align = alignRef.current;
      if (!track || !align) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-slide]", track);
      const cardWidth = items[0].offsetWidth;
      const gap = GAP_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
      const pad = align.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const total = items.length;
      const relayout = layoutRef.current !== layoutVersion;
      layoutRef.current = layoutVersion;
      const previous = relayout ? null : offsetsRef.current;

      const peekLeft = pad > PEEK_MIN_GUTTER_PX;

      const offsets = items.map((_, index) => {
        let offset = (((index - active) % total) + total) % total;
        if (offset >= total - 3) offset -= total;
        return offset;
      });

      items.forEach((item, index) => {
        const offset = offsets[index];
        const x = offset >= 0 || peekLeft ? pad + offset * (cardWidth + gap) : offset * (cardWidth + gap);
        const wrapped = !previous || Math.abs(offset - previous[index]) > total / 2;
        if (wrapped) {
          gsap.set(item, { x });
        } else {
          gsap.to(item, { x, duration: 0.9, ease: "power3.inOut", overwrite: true });
        }
      });
      offsetsRef.current = offsets;
    },
    { dependencies: [active, layoutVersion] },
  );

  const layout = {
    "--card-w": "min(47.5625rem, 85vw)",
    "--track-pad": "max(var(--gutter), calc((100% - 83.75rem) / 2))",
  } as CSSProperties;

  return (
    <div
      className="relative"
      style={layout}
      role="region"
      aria-roledescription="carousel"
      aria-label="Success stories"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
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
      <div className="container-page" aria-hidden>
        <div ref={alignRef} />
      </div>

      <ul ref={trackRef} className="grid overflow-hidden">
        {slides.map(({ item: story, key, sourceIndex }, index) => (
          <li
            key={key}
            data-slide
            aria-roledescription="slide"
            aria-label={`${sourceIndex + 1} of ${stories.length}`}
            aria-hidden={index !== active}
            className="col-start-1 row-start-1 w-[var(--card-w)] justify-self-start"
          >
            <figure className="grid h-full gap-6 border border-line bg-white p-3 md:grid-cols-[18.6875rem_1fr] md:gap-8">
              <div className="relative aspect-[299/353] overflow-hidden">
                <Image
                  src={story.src}
                  alt={story.name}
                  fill
                  sizes="(min-width: 768px) 19rem, 85vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center px-3 pb-4 md:px-0 md:pr-6 md:pb-0 lg:pr-16">
                <Image src="/homepage/quote-vector.svg" alt="" width={50} height={48} className="h-10 w-auto self-start md:h-12" />
                <blockquote className="mt-5 text-lg leading-[1.35] text-ink md:text-xl">
                  <p>{story.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-6">
                  <p className="text-xl font-medium text-ink">{story.name}</p>
                  <p className="mt-1 text-base text-ink/85">{story.title}</p>
                </figcaption>
              </div>
            </figure>
          </li>
        ))}
      </ul>

      <ArrowControls
        label="Success stories navigation"
        className="mt-6 ml-[var(--track-pad)] lg:absolute lg:top-1/2 lg:mt-0 lg:ml-0 lg:-translate-y-1/2 lg:[left:calc(var(--track-pad)+var(--card-w)+0.625rem-4.3125rem)]"
        onPrev={() => go(active - 1)}
        onNext={() => go(active + 1)}
      />
    </div>
  );
}
