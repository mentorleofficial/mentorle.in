"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowControls } from "@/components/ui/ArrowControls";
import type { HeroSlide } from "@/data/home";

type HeroSlideshowProps = {
  slides: HeroSlide[];
  autoplayMs: number;
};

export function HeroSlideshow({ slides, autoplayMs }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const canCycle = count > 1;
  const next = (index + 1) % count;

  const step = (direction: 1 | -1) => setIndex((value) => (value + direction + count) % count);

  useEffect(() => {
    if (!canCycle || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % count), autoplayMs);
    return () => window.clearTimeout(timer);
  }, [index, paused, canCycle, count, autoplayMs]);

  return (
    <>
      <div className="absolute inset-0 -z-10">
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;
          return (
            <div
              key={slide.src}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                {...(slideIndex === 0 ? { preload: true } : { loading: "eager" as const })}
                className={`object-cover ${slide.position}`}
              />
            </div>
          );
        })}
      </div>
      <div className="absolute inset-0 -z-10 bg-black/35" aria-hidden />

      <p className="sr-only" aria-live="polite">
        {`Image ${index + 1} of ${count}: ${slides[index].alt}`}
      </p>

      <div
        data-hero="3"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="absolute right-[var(--gutter)] bottom-[2.625rem] hidden w-[17rem] border-[0.5rem] border-white/30 backdrop-blur-sm md:block xl:right-[2.625rem] xl:w-[20.3125rem]"
      >
        <div className="relative aspect-[309/191] overflow-hidden">
          {slides.map((slide, slideIndex) => (
            <div
              key={slide.src}
              aria-hidden
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                slideIndex === next ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image src={slide.src} alt="" fill sizes="20rem" loading="eager" className="object-cover" />
            </div>
          ))}
          <ArrowControls
            size="sm"
            label="Hero images"
            className="absolute right-2 bottom-2"
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            canPrev={canCycle}
            canNext={canCycle}
          />
        </div>
      </div>
    </>
  );
}
