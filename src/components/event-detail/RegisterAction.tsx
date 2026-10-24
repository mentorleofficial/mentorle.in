"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/forms/fields";
import { eventDetailCopy } from "@/data/event-details";
import type { EventDetail } from "@/data/event-details";
import { useAuth } from "@/lib/auth/AuthProvider";
import { formatPrice } from "@/data/mentor-details";
import { EventFullError, eventsService } from "@/lib/events/service";
import { CheckoutError, startCheckout } from "@/lib/payments/checkout";
import { discounted, useMyPlan } from "@/lib/payments/membership";

const copy = eventDetailCopy.registration;

const brandButton =
  "flex h-12 w-full items-center justify-center gap-2.5 bg-brand text-sm text-white transition-colors duration-300 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-wait disabled:opacity-70";
const noteClasses = "mt-5 text-sm text-ink-soft";

// The meeting link for a registered attendee (get_event_meeting_links answers nobody else), if the event has one.
export function JoinLink({ eventId }: { eventId: string }) {
  const { status } = useAuth();
  const [link, setLink] = useState<string | null>(null);
  useEffect(() => {
    if (status !== "signed-in") return;
    let current = true;
    eventsService
      .getMeetingLink(eventId)
      .then((value) => current && setLink(value))
      .catch(() => undefined);
    return () => {
      current = false;
      setLink(null);
    };
  }, [eventId, status]);
  if (!link) return null;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand underline-offset-4 hover:underline"
    >
      {copy.join}
      <span aria-hidden>↗</span>
    </a>
  );
}

// Registration for an open event, following the platform's mentee rules: you need an account and a finished
// profile (MenteeOnboardingGuard), then it's a free RSVP into event_participants, or for a paid event a
// Cashfree checkout (with the member's event discount) that registers them once paid. Signed-out visitors and
// unfinished profiles are sent through the signup / onboarding modals with ?redirect= back to this page.
export function RegisterAction({
  event,
  deadlineNote,
}: {
  event: EventDetail & { registration: NonNullable<EventDetail["registration"]> };
  deadlineNote: string;
}) {
  const { status, user, onboarded } = useAuth();
  // The answer is stored with the user and event it belongs to; until it matches, it's still being checked.
  const key = user ? `${event.id}:${user.id}` : null;
  const [answer, setAnswer] = useState<{ key: string; registered: boolean } | null>(null);
  const registered = key && answer?.key === key ? answer.registered : null;
  const setRegistered = (value: boolean) => key && setAnswer({ key, registered: value });
  useEffect(() => {
    if (!key) return;
    const [eventId, userId] = key.split(":");
    let current = true;
    eventsService
      .isRegistered(eventId, userId)
      .catch(() => false)
      .then((value) => current && setAnswer({ key, registered: value }));
    return () => {
      current = false;
    };
  }, [key]);
  const [working, setWorking] = useState<"register" | "cancel" | null>(null);
  const [error, setError] = useState("");
  const here = `/events/${event.slug}`;
  const plan = useMyPlan();
  const price = event.registration.price;
  const memberPercent = price > 0 && plan?.active ? plan.eventDiscount : 0;
  const payable = discounted(price, memberPercent);
  const label = price > 0 ? copy.pay(formatPrice(payable)) : event.registration.label;

  const register = async () => {
    if (!user) return;
    setWorking("register");
    setError("");
    if (price > 0) {
      try {
        await startCheckout({ kind: "event", eventId: event.id });
        // Cashfree takes over the page; the status page confirms the registration.
      } catch (caught) {
        setError(caught instanceof CheckoutError ? caught.message : copy.failed);
        setWorking(null);
      }
      return;
    }
    try {
      await eventsService.registerForEvent(event.id, user.id);
      setRegistered(true);
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
    try {
      await eventsService.unregisterFromEvent(event.id, user.id);
      setRegistered(false);
    } catch {
      setError(copy.failed);
    } finally {
      setWorking(null);
    }
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
        <JoinLink eventId={event.id} />
        {price > 0 ? (
          <p className={noteClasses}>{copy.paidRegisteredNote}</p>
        ) : (
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
        )}
      </>
    );
  }

  // Checking whether this user is already registered: hold the button rather than flash "Register".
  if (status === "signed-in" && user && onboarded && registered === null) {
    return (
      <>
        <p aria-busy className={`${brandButton} cursor-wait opacity-70`}>
          <Spinner />
        </p>
        <p className={noteClasses}>{deadlineNote}</p>
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
              {price > 0 ? copy.paying : copy.working}
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
          <p className={noteClasses}>
            {memberPercent > 0 && `${copy.memberPrice(plan!.planName, memberPercent)} `}
            {deadlineNote}
          </p>
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
