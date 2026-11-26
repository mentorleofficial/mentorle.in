"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

let instance: Lenis | null = null;

// Scroll so an element sits `offset` px below the top (e.g. under the fixed header), through Lenis when it runs so
// the smooth scroll and ScrollTrigger stay in step; instant with reduced motion.
export function scrollToElement(element: HTMLElement, offset = 0) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduced) instance.scrollTo(element, { offset: -offset });
  else window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - offset, behavior: "auto" });
}

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      anchors: true,
      stopInertiaOnNavigate: true,
    });

    instance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  return null;
}
