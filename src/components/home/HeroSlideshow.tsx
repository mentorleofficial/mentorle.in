"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowControls } from "@/components/ui/ArrowControls";
import type { HeroSlide } from "@/data/home";

type HeroSlideshowProps = {
  slides: HeroSlide[];
  autoplayMs: number;
};

const DURATION = 1.1;
const EASE = "power3.inOut";

const insetFromRect = (outer: DOMRect, inner: DOMRect) =>
  `inset(${inner.top - outer.top}px ${outer.right - inner.right}px ${outer.bottom - inner.bottom}px ${inner.left - outer.left}px)`;

// Full-bleed hero slideshow. The small card previews the next image; moving forward, that image expands out of
// the card to fill the hero while the old one recedes behind it (slight zoom + dim), and the card's preview slides
// on to the following image. Going back plays it in reverse. GSAP only touches the slides after hydration, on a
// timer tick or a click; the server renders slide 1 with slide 2 in the card.
export function HeroSlideshow({ slides, autoplayMs }: HeroSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const indexRef = useRef(0);
  const busy = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const count = slides.length;
  const canCycle = count > 1;

  const go = (direction: 1 | -1) => {
    const stage = stageRef.current;
    const previewWindow = windowRef.current;
    if (!stage || !previewWindow || busy.current || !canCycle) return;
    busy.current = true;

    const from = indexRef.current;
    const to = (from + direction + count) % count;
    const backgrounds = gsap.utils.toArray<HTMLElement>("[data-hero-slide]", stage);
    const previews = gsap.utils.toArray<HTMLElement>("[data-hero-preview]", previewWindow);
    const current = backgrounds[from];
    const target = backgrounds[to];
    // Zoom/dim the images, not the slide boxes: scaling a box would scale its clip mask off the card's position.
    const currentImage = current.querySelector("img");
    const targetImage = target.querySelector("img");
    // The card always previews the slide after the one in the background.
    const oldPreview = previews[(from + 1) % count];
    const newPreview = previews[(to + 1) % count];

    const done = () => {
      gsap.set(backgrounds, { zIndex: 0, autoAlpha: 0, clipPath: "none" });
      gsap.set([currentImage, targetImage], { scale: 1, filter: "brightness(1)" });
      gsap.set(target, { zIndex: 1, autoAlpha: 1 });
      gsap.set(previews, { autoAlpha: 0, xPercent: 0 });
      gsap.set(newPreview, { autoAlpha: 1 });
      indexRef.current = to;
      setIndex(to);
      busy.current = false;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(target, { zIndex: 2, autoAlpha: 0 });
      gsap.to(target, { autoAlpha: 1, duration: 0.4, onComplete: done });
      return;
    }

    const stageRect = stage.getBoundingClientRect();
    const cardRect = previewWindow.getBoundingClientRect();
    // No card below md: the image wipes in from the right edge (or back out to it) instead. Pixels throughout,
    // because GSAP can't tween a clip-path between % and px values.
    const cardInset = cardRect.width > 0 ? insetFromRect(stageRect, cardRect) : `inset(0px 0px 0px ${stageRect.width}px)`;
    const timeline = gsap.timeline({ onComplete: done, defaults: { duration: DURATION, ease: EASE } });

    // Filters start from an explicit brightness(1): tweening from "none" makes GSAP start at brightness(0) (black).
    if (direction === 1) {
      // The previewed image grows out of the card; the old background recedes underneath.
      gsap.set(current, { zIndex: 1 });
      gsap.set(currentImage, { scale: 1, filter: "brightness(1)" });
      gsap.set(target, { zIndex: 2, autoAlpha: 1, clipPath: cardInset });
      gsap.set(targetImage, { scale: 1.12, filter: "brightness(1)" });
      timeline
        .to(target, { clipPath: "inset(0px 0px 0px 0px)" }, 0)
        .to(targetImage, { scale: 1 }, 0)
        .to(currentImage, { scale: 1.08, filter: "brightness(0.55)" }, 0);
    } else {
      // Reverse: the current image shrinks back into the card, revealing the previous one coming forward.
      gsap.set(current, { zIndex: 2, clipPath: "inset(0px 0px 0px 0px)" });
      gsap.set(currentImage, { scale: 1, filter: "brightness(1)" });
      gsap.set(target, { zIndex: 1, autoAlpha: 1 });
      gsap.set(targetImage, { scale: 1.08, filter: "brightness(0.55)" });
      timeline
        .to(current, { clipPath: cardInset }, 0)
        .to(currentImage, { scale: 1.12 }, 0)
        .to(targetImage, { scale: 1, filter: "brightness(1)" }, 0);
    }

    // The card's preview slides on to the next image (or back, in reverse).
    if (oldPreview !== newPreview) {
      gsap.set(newPreview, { autoAlpha: 1, xPercent: direction * 100 });
      timeline
        .to(oldPreview, { xPercent: -direction * 100, duration: 0.9 }, 0.15)
        .to(newPreview, { xPercent: 0, duration: 0.9 }, 0.15);
    }
  };

  // Autoplay: the next slide is scheduled after each change finishes, so a transition is never cut short.
  useEffect(() => {
    if (!canCycle || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => go(1), autoplayMs);
    return () => window.clearTimeout(timer);
    // `go` reads refs only; re-running on its identity would reset the timer every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, canCycle, autoplayMs]);

  return (
    <>
      <div ref={stageRef} className="absolute inset-0 -z-10 overflow-hidden">
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.src}
            data-hero-slide
            aria-hidden={slideIndex !== index}
            className={`absolute inset-0 overflow-hidden ${slideIndex === 0 ? "z-[1]" : "invisible opacity-0"}`}
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
        ))}
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
        <div ref={windowRef} className="relative aspect-[309/191] overflow-hidden">
          {slides.map((slide, slideIndex) => (
            <div key={slide.src} data-hero-preview aria-hidden className={`absolute inset-0 ${slideIndex === 1 % count ? "" : "invisible opacity-0"}`}>
              {/* Default (lazy) loading: the card is on screen so these still load right away, but eager images get
                  preload hints in <head>, and the browser warns about the ones not shown within a few seconds.
                  Thumbnails are separate files so they never share a URL with the full-screen (LCP) slide. */}
              <Image src={slide.thumb} alt="" fill sizes="20rem" className="object-cover" />
            </div>
          ))}
          <ArrowControls
            size="sm"
            label="Hero images"
            className="absolute right-2 bottom-2 z-10"
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            canPrev={canCycle}
            canNext={canCycle}
          />
        </div>
      </div>
    </>
  );
}
