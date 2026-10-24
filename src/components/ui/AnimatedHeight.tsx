"use client";

import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";

const DURATION = 380;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const MIN_CHANGE = 40; // px: smaller changes (an error line, a textarea being resized) apply instantly

// Glides its height when the content's height changes (a dialog moving to a longer or shorter step), instead
// of snapping. Pure CSS transition on `height`, driven by a ResizeObserver; off with reduced motion.
export function AnimatedHeight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const box = outer.current;
    const content = inner.current;
    if (!box || !content) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let last = content.offsetHeight;

    const settle = () => {
      box.style.height = "";
      box.style.overflow = "";
      box.style.transition = "";
    };
    // ResizeObserver runs after layout and before paint, so the old height can be restored and animated from.
    const observer = new ResizeObserver(() => {
      const next = content.offsetHeight;
      const from = box.style.height ? box.getBoundingClientRect().height : last;
      last = next;
      if (reduce.matches || Math.abs(next - from) < MIN_CHANGE) {
        if (!box.style.transition) settle();
        return;
      }
      box.style.transition = "none";
      box.style.overflow = "hidden";
      box.style.height = `${from}px`;
      void box.offsetHeight; // apply the starting height before transitioning
      box.style.transition = `height ${DURATION}ms ${EASE}`;
      box.style.height = `${next}px`;
    });
    const onEnd = (event: TransitionEvent) => {
      if (event.target === box && event.propertyName === "height") settle();
    };
    box.addEventListener("transitionend", onEnd);
    observer.observe(content);
    return () => {
      observer.disconnect();
      box.removeEventListener("transitionend", onEnd);
    };
  }, []);

  return (
    <div ref={outer} className={className}>
      {/* flow-root keeps a child's top margin inside, so the measured height is the real one. */}
      <div ref={inner} className="flow-root">
        {children}
      </div>
    </div>
  );
}
