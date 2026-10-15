"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Spinner } from "@/components/forms/fields";
import { eventDetailCopy } from "@/data/event-details";
import type { EventDetail } from "@/data/event-details";
import { useAuth } from "@/lib/auth/AuthProvider";
import { EventFullError, eventsService } from "@/lib/events/service";

const copy = eventDetailCopy.registration;
const CHANGE_EVENT = "mentorle-registrations-change";

const subscribe = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

const brandButton =
  "flex h-12 w-full items-center justify-center gap-2.5 bg-brand text-sm text-white transition-colors duration-300 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-70";
const noteClasses = "mt-5 text-sm text-ink-soft";

// Registration for an open event, following the platform's mentee rules: you need an account and a finished
// profile (MenteeOnboardingGuard), then it's a free RSVP. Signed-out visitors and unfinished profiles are sent
// through the signup / onboarding modals with ?redirect= back to this page.
export function RegisterAction({ event, deadlineNote }: { event: EventDetail & { registration: NonNullable<EventDetail["registration"]> }; deadlineNote: string }) {
  const { status, user, onboarded } = useAuth();
  // Registrations live in browser storage (mock), so the server and first client render always say "not registered".
  const registered = useSyncExternalStore(
    subscribe,
    () => Boolean(user && eventsService.isRegistered(event.slug, user.id)),
    () => false,
  );
  const [working, setWorking] = useState<"register" | "cancel" | null>(null);
  const [error, setError] = useState("");
  const here = `/events/${event.slug}`;
  const label = event.registration.label;

  const notify = () => window.dispatchEvent(new Event(CHANGE_EVENT));

  const register = async () => {
    if (!user) return;
    setWorking("register");
    setError("");
    try {
      await eventsService.registerForEvent(event.slug, user.id, event.registration.maxParticipants);
      notify();
      if (event.registration.externalLink) window.open(event.registration.externalLink, "_blank", "noopener,noreferrer");
    } catch (caught) {
      setError(caught instanceof EventFullError ? copy.full : copy.failed);
    } finally {
      setWorking(null);
    }
  };

  const cancel = async () => {
    if (!user) return;
    setWorking("cancel");
    await eventsService.unregisterFromEvent(event.slug, user.id);
    notify();
    setWorking(null);
  };

  if (status === "signed-in" && user && registered) {
    return (
      <>
        <p role="status" className="flex h-12 w-full items-center justify-center gap-2.5 bg-[#fff0ea] text-sm text-brand">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-3.5" aria-hidden>
            <path d="M2.5 8.5l3.5 3.5 7.5-8" />
          </svg>
          {copy.registered}
        </p>
        <p className={noteClasses}>
          {copy.registeredNote}{" "}
          <button
            type="button"
            onClick={cancel}
            disabled={working !== null}
            className="text-ink underline underline-offset-4 transition-colors hover:text-brand-dark disabled:text-ink-soft disabled:no-underline"
          >
            {working === "cancel" ? copy.cancelling : copy.cancel}
          </button>
        </p>
      </>
    );
  }

  if (status === "signed-in" && user && !onboarded) {
    return (
      <>
        <Link href={`/onboarding?redirect=${encodeURIComponent(here)}`} className={brandButton}>
          {label}
        </Link>
        <p className={noteClasses}>{copy.finishProfile}</p>
      </>
    );
  }

  if (status === "signed-in" && user) {
    return (
      <>
        <button type="button" onClick={register} disabled={working !== null} aria-busy={working === "register"} className={brandButton}>
          {working === "register" ? (
            <>
              <Spinner />
              {copy.working}
            </>
          ) : (
            label
          )}
        </button>
        {error ? (
          <p role="alert" className="mt-5 text-sm text-brand-dark">
            {error}
          </p>
        ) : (
          <p className={noteClasses}>{deadlineNote}</p>
        )}
      </>
    );
  }

  // Signed out (and the server render): sign up first, then come back here.
  return (
    <>
      <Link href={`/signup?redirect=${encodeURIComponent(here)}`} className={brandButton}>
        {label}
      </Link>
      <p className={noteClasses}>
        {copy.signIn} {deadlineNote}
      </p>
    </>
  );
}
