"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

// A dialog's action row (Back / Continue…) that stays pinned to the bottom of the screen while a step taller than
// the screen scrolls, so the main button is always in reach. A hairline appears above it only while it's pinned;
// when the step fits, it sits in place like any other row. The negative margins match the dialog card's padding.
export function StickyActions({ children, className = "" }: { children: ReactNode; className?: string }) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const root = el.closest<HTMLElement>("[data-lenis-prevent]");
    // The sentinel sits right after the row: out of view below means the row is pinned.
    const observer = new IntersectionObserver(([entry]) => setPinned(!entry.isIntersecting && entry.boundingClientRect.top > 0), { root, threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className={`sticky bottom-0 z-10 -mx-5 bg-white px-5 py-3 sm:-mx-10 sm:px-10 ${pinned ? "border-t border-line" : "border-t border-transparent"} ${className}`}>{children}</div>
      <div ref={sentinel} aria-hidden className="h-px" />
    </>
  );
}
