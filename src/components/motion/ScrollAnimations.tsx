"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const INK = "#2b2b2b";
const ANIMATED = "[data-hero], [data-animate], [data-parallax]";
const HYDRATION_TIMEOUT_MS = 2000;
// Matches the CSS failsafe in globals.css that reveals hidden content if motion hasn't started by then.
const FAILSAFE_MS = 2500;

const isHydrated = (element: Element) => Object.keys(element).some((key) => key.startsWith("__reactFiber$"));

// GSAP writes inline styles; doing that before React hydrates an element causes a hydration mismatch,
// so wait until React has attached to every animated element (or stop waiting after a timeout).
function whenHydrated(callback: () => void) {
  const startedAt = performance.now();
  let frame = 0;
  const check = () => {
    const pending = [...document.querySelectorAll(ANIMATED)].some((element) => !isHydrated(element));
    if (!pending || performance.now() - startedAt > HYDRATION_TIMEOUT_MS) callback();
    else frame = requestAnimationFrame(check);
  };
  check();
  return () => cancelAnimationFrame(frame);
}

export function ScrollAnimations() {
  const pathname = usePathname();

  useGSAP(
    () => {
      let mm: gsap.MatchMedia | undefined;

      const cancelWait = whenHydrated(() => {
        const stillHidden = document.documentElement.classList.contains("js-motion");
        mm = gsap.matchMedia();

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero]");
          heroItems.sort((a, b) => Number(a.dataset.hero) - Number(b.dataset.hero));
          // If the CSS failsafe already revealed the hero on first load, replaying its intro would make it flash.
          const revealedByFailsafe = stillHidden && performance.now() >= FAILSAFE_MS;
          if (heroItems.length && !revealedByFailsafe) {
            gsap.fromTo(
              heroItems,
              { y: 40, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 1.1, ease: "power3.out", stagger: 0.14, delay: 0.15 },
            );
          }

          gsap.utils.toArray<HTMLElement>('[data-animate="fade-up"]').forEach((element) => {
            gsap.fromTo(
              element,
              { y: 48, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 88%", once: true },
              },
            );
          });

          // Transform-only reveal for blocks containing backdrop-filter, which an opacity fade would switch off mid-animation.
          gsap.utils.toArray<HTMLElement>('[data-animate="rise"]').forEach((element) => {
            gsap.fromTo(
              element,
              { y: 120, visibility: "hidden" },
              {
                y: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 92%", once: true },
                onStart: () => {
                  element.style.visibility = "visible";
                },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>('[data-animate="stagger"]').forEach((element) => {
            gsap.fromTo(
              element.children,
              { y: 56, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 1,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: { trigger: element, start: "top 85%", once: true },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>('[data-animate="image"]').forEach((element) => {
            const media = element.querySelector("img, video");
            const timeline = gsap.timeline({
              scrollTrigger: { trigger: element, start: "top 85%", once: true },
            });
            timeline.fromTo(
              element,
              { autoAlpha: 0, clipPath: "inset(14% 14% 14% 14%)" },
              { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut" },
            );
            if (media) timeline.fromTo(media, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: "power3.out" }, 0);
          });

          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((element) => {
            const amount = Number(element.dataset.parallax) || 12;
            gsap.fromTo(
              element,
              { yPercent: -amount },
              {
                yPercent: amount,
                ease: "none",
                scrollTrigger: { trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>('[data-animate="words"]').forEach((element) => {
            gsap.to(element.querySelectorAll("[data-word]"), {
              color: INK,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: element, start: "top 85%", end: "bottom 40%", scrub: 0.4 },
            });
          });
        });

        // GSAP now holds the hidden state inline; dropping the class means anything it doesn't manage can never stay invisible.
        document.documentElement.classList.remove("js-motion");
        ScrollTrigger.refresh();
      });

      return () => {
        cancelWait();
        mm?.revert();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
