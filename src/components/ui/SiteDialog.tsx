"use client";

import { useEffect, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatedHeight } from "@/components/ui/AnimatedHeight";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

type SiteDialogProps = {
  titleId: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
  // Card width (Tailwind max-w class); changes glide.
  widthClass?: string;
  // Scrolls the overlay back to the top whenever it changes (a new step).
  stepKey?: string;
};

// The auth dialogs' overlay and card for dialogs opened from a page (booking, rating): a portal over everything,
// blurred backdrop, square white card with ✕, focus trapped inside and returned afterwards, Esc / outside click to
// close, page scroll locked (Lenis pauses with overflow hidden). The card's height glides between steps.
export function SiteDialog({ titleId, closeLabel, onClose, children, widthClass = "max-w-[34.4375rem]", stepKey }: SiteDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = overflow;
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    dialogRef.current?.closest("[data-lenis-prevent]")?.scrollTo({ top: 0 });
  }, [stepKey]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!items.length) return;
    if (event.shiftKey && document.activeElement === items[0]) {
      event.preventDefault();
      items[items.length - 1].focus();
    } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
      event.preventDefault();
      items[0].focus();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex animate-[auth-backdrop-in_300ms_ease-out] overflow-y-auto overscroll-contain bg-black/45 px-4 py-6 backdrop-blur-xl sm:py-10 [@media(max-height:1000px)]:py-3"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
      data-lenis-prevent
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative m-auto w-full animate-[auth-card-in_400ms_cubic-bezier(0.22,1,0.36,1)] bg-white transition-[max-width] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none px-5 pt-12 pb-9 motion-reduce:animate-none sm:px-10 md:pt-[3.125rem] md:pb-[3.25rem] [@media(max-height:1000px)]:pt-10 [@media(max-height:1000px)]:pb-6 [@media(max-height:1000px)]:md:pt-10 [@media(max-height:1000px)]:md:pb-7 ${widthClass}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-3 right-3 flex size-10 items-center justify-center text-ink transition-transform duration-300 hover:rotate-90 focus-visible:outline-2 focus-visible:outline-brand md:top-[1.375rem] md:right-[1.375rem]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-6" aria-hidden>
            <path d="M3 3l18 18M21 3L3 21" />
          </svg>
        </button>
        <AnimatedHeight>{children}</AnimatedHeight>
      </div>
    </div>,
    document.body,
  );
}
