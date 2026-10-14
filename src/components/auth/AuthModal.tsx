"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import type { AuthMode } from "@/data/auth";

type AuthModalProps = {
  mode: AuthMode;
  // True when opened over another page via an intercepted route; false on a direct visit to /login or /signup.
  intercepted: boolean;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function AuthModal({ mode, intercepted }: AuthModalProps) {
  const router = useRouter();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    // Lenis runs with autoToggle, so hiding overflow on <html> also pauses smooth scrolling.
    root.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      root.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const close = () => {
    if (intercepted) router.back();
    else router.push("/");
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex animate-[auth-backdrop-in_300ms_ease-out] items-center justify-center overflow-y-auto bg-black/45 px-4 py-10 backdrop-blur-xl"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onKeyDown={onKeyDown}
      data-lenis-prevent
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[34.4375rem] animate-[auth-card-in_400ms_cubic-bezier(0.22,1,0.36,1)] bg-white px-6 pt-12 pb-10 motion-reduce:animate-none md:px-10 md:pt-[3.125rem] md:pb-[3.25rem]"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-4 right-4 flex size-10 items-center justify-center text-ink transition-transform duration-300 hover:rotate-90 focus-visible:outline-2 focus-visible:outline-brand md:top-[1.375rem] md:right-[1.375rem]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-6" aria-hidden>
            <path d="M3 3l18 18M21 3L3 21" />
          </svg>
        </button>
        <AuthForm mode={mode} titleId={titleId} intercepted={intercepted} />
      </div>
    </div>
  );
}
