"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { stepEnterClass } from "@/components/auth/AuthStep";
import { FormAlert, Spinner, SubmitButton, TextAreaField } from "@/components/forms/fields";
import { AnimatedHeight } from "@/components/ui/AnimatedHeight";
import { StickyActions } from "@/components/ui/StickyActions";
import { bookingCopy as copy } from "@/data/booking";
import type { MentorOffering } from "@/data/mentor-details";
import { formatPrice } from "@/data/mentor-details";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SlotTakenError, bookingService } from "@/lib/booking/service";
import { googleCalendarUrl } from "@/lib/calendar";
import { formatClock, formatEventDay, istDayKey } from "@/lib/dates";
import { prefetchFor } from "@/lib/routes";

// Booking overlay over a mentor profile, in the auth dialogs' style: pick a day and time (open slots from the
// server, IST), confirm with an optional note, then the meeting link and a calendar link. Signed-out visitors and
// unfinished profiles are sent through signup / onboarding and brought back to the chosen time (?book=&at=).

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
const NOTES_MAX = 1000;

type Mentor = { userId: string; fullName: string; slug: string };

export type BookingDialogProps = {
  mentor: Mentor;
  offering: MentorOffering;
  initialStartsAt?: string | null; // resume at this time after signing up
  onClose: () => void;
};

const monthKey = (key: string) => key.slice(0, 7); // "2026-10"
const monthLabel = (month: string) =>
  new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-01T00:00:00Z`));

// Monday-first grid for a "YYYY-MM" month: date keys, with nulls for the padding cells.
function monthGrid(month: string): (string | null)[] {
  const [y, m] = month.split("-").map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1));
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const pad = (first.getUTCDay() + 6) % 7;
  const cells: (string | null)[] = Array(pad).fill(null);
  for (let d = 1; d <= days; d++) cells.push(`${month}-${String(d).padStart(2, "0")}`);
  while (cells.length % 7) cells.push(null);
  return cells;
}

const addMonths = (month: string, n: number) => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

export function BookingDialog({ mentor, offering, initialStartsAt, onClose }: BookingDialogProps) {
  const titleId = useId();
  const router = useRouter();
  const { status, user, onboarded } = useAuth();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [step, setStepState] = useState<"pick" | "confirm" | "done">("pick");
  // Back to the time picker slides in from the left; everything else from the right (same as the auth steps).
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const setStep = (next: "pick" | "confirm" | "done") => {
    setDirection(next === "pick" ? "back" : "forward");
    setStepState(next);
  };
  const [slots, setSlots] = useState<string[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [startsAt, setStartsAt] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState<{ meetingUrl: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const resumed = useRef(false);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      setSlots(await bookingService.openSlots(offering.id));
    } catch {
      setLoadError(true);
      setSlots([]);
    }
  }, [offering.id]);

  useEffect(() => {
    let current = true;
    bookingService
      .openSlots(offering.id)
      .then((list) => current && setSlots(list))
      .catch(() => {
        if (!current) return;
        setLoadError(true);
        setSlots([]);
      });
    return () => {
      current = false;
    };
  }, [offering.id]);

  const byDay = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const slot of slots ?? []) {
      const key = istDayKey(slot);
      map.set(key, [...(map.get(key) ?? []), slot]);
    }
    return map;
  }, [slots]);
  const firstMonth = monthKey(istDayKey(new Date()));
  const lastMonth = slots?.length ? monthKey(istDayKey(slots[slots.length - 1])) : firstMonth;
  const shownMonth = month ?? (slots?.length ? monthKey(istDayKey(slots[0])) : firstMonth);

  // Back from signup/onboarding: jump to the chosen time if it's still open.
  useEffect(() => {
    if (resumed.current || !slots || !initialStartsAt) return;
    resumed.current = true;
    const match = slots.find((slot) => Date.parse(slot) === Date.parse(initialStartsAt));
    queueMicrotask(() => {
      if (!match) return setError(copy.errors.taken);
      setDay(istDayKey(match));
      setMonth(monthKey(istDayKey(match)));
      setStartsAt(match);
      setStep("confirm");
    });
  }, [slots, initialStartsAt]);

  // Scroll lock, focus in and back out (same as the auth dialogs; Lenis pauses with overflow hidden).
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
  }, [step]);

  const onKeyDown = (event: React.KeyboardEvent) => {
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

  // Where signup / onboarding send people back to: this profile, reopening this dialog at this time.
  const here = startsAt ? `/mentors/${mentor.slug}?book=${offering.id}&at=${encodeURIComponent(startsAt)}` : `/mentors/${mentor.slug}`;
  const goTo = (path: string) => {
    onClose();
    router.push(`${path}?redirect=${encodeURIComponent(here)}`);
  };

  const confirm = async () => {
    if (!startsAt) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await bookingService.book({ offeringId: offering.id, startsAt, notes });
      void bookingService.sendEmails(result.sessionId);
      setBooked({ meetingUrl: result.meetingUrl });
      setStep("done");
    } catch (caught) {
      if (caught instanceof SlotTakenError) {
        setError(copy.errors.taken);
        setStartsAt(null);
        setStep("pick");
        void load();
      } else {
        setError(caught instanceof Error && caught.message ? caught.message : copy.errors.generic);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const summary = startsAt && (
    <dl className="grid gap-4 border border-line bg-surface p-5 text-left sm:grid-cols-2">
      <div className="sm:col-span-2">
        <dt className="text-sm text-ink-soft">{offering.title}</dt>
        <dd className="mt-1 text-base text-ink">with {mentor.fullName}</dd>
      </div>
      <div>
        <dt className="text-sm text-ink-soft">Date</dt>
        <dd className="mt-1 text-base text-ink">{formatEventDay(startsAt)}</dd>
      </div>
      <div>
        <dt className="text-sm text-ink-soft">Time</dt>
        <dd className="mt-1 text-base text-ink">
          {formatClock(startsAt)} IST · {offering.durationMinutes} min · {formatPrice(offering.price)}
        </dd>
      </div>
    </dl>
  );

  const content = (() => {
    if (step === "done" && startsAt && booked) {
      return (
        <div className="text-center">
          <span className="mx-auto mb-6 flex size-14 items-center justify-center bg-brand text-white" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-7">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <h2 id={titleId} className="text-[1.75rem] leading-tight font-medium text-ink md:text-[2rem]">
            {copy.done.title}
          </h2>
          <p className="mx-auto mt-3 max-w-[26rem] text-base leading-snug text-ink">{copy.done.subtitle(mentor.fullName)}</p>
          <div className="mt-8 space-y-4 text-left">
            {summary}
            <div className="border border-line p-5">
              <p className="text-sm text-ink-soft">{copy.done.join}</p>
              <p className="mt-1 text-base break-all text-ink">
                <a href={booked.meetingUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  {booked.meetingUrl}
                </a>
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(booked.meetingUrl).then(() => setCopied(true));
                  }}
                  className="inline-flex h-[2.3125rem] items-center border border-ink px-4 text-sm text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  {copied ? copy.done.copied : copy.done.copy}
                </button>
                <a
                  href={googleCalendarUrl(`${offering.title} with ${mentor.fullName}`, startsAt, offering.durationMinutes, booked.meetingUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[2.3125rem] items-center border border-[#dadada] px-4 text-sm text-ink transition-colors hover:border-ink"
                >
                  {copy.done.calendar} <span aria-hidden className="ml-1.5">↗</span>
                </a>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-8 max-w-[20.625rem]">
            <SubmitButton type="button" loading={false} loadingLabel="" onClick={onClose}>
              {copy.done.close}
            </SubmitButton>
            <Link href="/sessions" prefetch={prefetchFor("/sessions")} className="mt-4 block text-center text-sm text-ink underline-offset-4 hover:underline">
              {copy.done.sessions} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      );
    }

    if (step === "confirm" && startsAt) {
      return (
        <div className="text-center">
          <h2 id={titleId} className="text-[1.75rem] leading-tight font-medium text-ink md:text-[2rem]">
            {copy.confirm.title}
          </h2>
          <div className="mt-8 space-y-4 text-left">
            {summary}
            <ul className="space-y-1.5 text-sm text-ink-soft">
              {copy.rules.map((line) => (
                <li key={line} className="flex gap-2.5">
                  <span className="mt-2 size-1 shrink-0 bg-ink-soft" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
            {status === "signed-in" && onboarded && user?.role === "mentee" && (
              <TextAreaField
                id={`${titleId}-notes`}
                label={copy.confirm.notesLabel}
                placeholder={copy.confirm.notesPlaceholder}
                maxLength={NOTES_MAX}
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            )}
          </div>
          <div className="mx-auto mt-6 flex max-w-[20.625rem] flex-col gap-3">
            <FormAlert>{error}</FormAlert>
            {status === "signed-out" ? (
              <>
                <p className="text-sm text-ink-soft">{copy.confirm.signIn}</p>
                <SubmitButton type="button" loading={false} loadingLabel="" onClick={() => goTo("/signup")}>
                  {copy.confirm.signInCta}
                </SubmitButton>
              </>
            ) : status === "loading" ? (
              <p className="flex h-[2.3125rem] items-center justify-center bg-brand text-white opacity-70" aria-busy>
                <Spinner />
              </p>
            ) : user?.role !== "mentee" ? (
              <p className="text-sm text-ink-soft">{copy.confirm.mentorAccount}</p>
            ) : !onboarded ? (
              <>
                <p className="text-sm text-ink-soft">{copy.confirm.finishProfile}</p>
                <SubmitButton type="button" loading={false} loadingLabel="" onClick={() => goTo("/onboarding")}>
                  {copy.confirm.finishProfileCta}
                </SubmitButton>
              </>
            ) : (
              <SubmitButton type="button" loading={submitting} loadingLabel={copy.confirm.submitting} onClick={() => void confirm()}>
                {copy.confirm.submit}
              </SubmitButton>
            )}
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep("pick");
              }}
              className="text-sm text-ink underline-offset-4 hover:underline focus-visible:underline"
            >
              {copy.confirm.back}
            </button>
          </div>
        </div>
      );
    }

    const times = day ? (byDay.get(day) ?? []) : [];
    return (
      <div>
        <div className="text-center">
          <h2 id={titleId} className="text-[1.75rem] leading-tight font-medium text-ink md:text-[2rem]">
            {copy.pick.title}
          </h2>
          <p className="mx-auto mt-3 max-w-[28rem] text-base leading-snug text-ink">
            {copy.pick.subtitle(mentor.fullName)} <span className="text-ink-soft">{offering.title} · {offering.durationMinutes} min · {formatPrice(offering.price)}</span>
          </p>
        </div>
        <div className="mt-6">
          <FormAlert>{error}</FormAlert>
        </div>

        {slots === null ? (
          <p className="mt-10 flex items-center justify-center gap-2.5 text-sm text-ink-soft">
            <Spinner />
            {copy.pick.loading}
          </p>
        ) : loadError ? (
          <div className="mt-10 text-center">
            <p className="text-sm text-ink-soft">{copy.pick.error}</p>
            <button type="button" onClick={() => void load()} className="mt-3 text-sm text-ink underline underline-offset-4">
              {copy.pick.retry}
            </button>
          </div>
        ) : slots.length === 0 ? (
          <p className="mt-10 text-center text-sm text-ink-soft">{copy.pick.empty}</p>
        ) : (
          <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_13rem] md:gap-10 [@media(max-height:1000px)]:mt-4 [@media(max-height:1000px)]:gap-6">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-base font-medium text-ink">{monthLabel(shownMonth)}</p>
                <div className="flex gap-1">
                  {[
                    { label: copy.pick.previousMonth, delta: -1, disabled: shownMonth <= firstMonth, path: "M15 6l-6 6 6 6" },
                    { label: copy.pick.nextMonth, delta: 1, disabled: shownMonth >= lastMonth, path: "M9 6l6 6-6 6" },
                  ].map((arrow) => (
                    <button
                      key={arrow.label}
                      type="button"
                      aria-label={arrow.label}
                      disabled={arrow.disabled}
                      onClick={() => setMonth(addMonths(shownMonth, arrow.delta))}
                      className="flex size-9 items-center justify-center border border-[#dadada] text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#dadada]"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
                        <path d={arrow.path} />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-1 text-center" role="grid" aria-label={monthLabel(shownMonth)}>
                {copy.pick.weekdays.map((weekday) => (
                  <span key={weekday} className="py-1.5 text-xs text-ink-soft" aria-hidden>
                    {weekday}
                  </span>
                ))}
                {monthGrid(shownMonth).map((key, index) => {
                  if (!key) return <span key={`pad-${index}`} />;
                  const open = byDay.has(key);
                  const selected = key === day;
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={!open}
                      aria-pressed={selected}
                      aria-label={`${formatEventDay(`${key}T12:00:00+05:30`)}${open ? "" : " (no open times)"}`}
                      onClick={() => {
                        setDay(key);
                        setStartsAt(null);
                        setError("");
                      }}
                      className={`flex h-10 items-center justify-center text-sm transition-colors ${
                        selected
                          ? "bg-ink font-medium text-white"
                          : open
                            ? "border border-ink/25 font-medium text-ink hover:border-ink"
                            : "cursor-default text-ink/30"
                      }`}
                    >
                      {Number(key.slice(8))}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-ink-soft">{copy.pick.timezone}</p>
            </div>

            <div>
              {day ? (
                <>
                  <p className="text-sm text-ink-soft">{copy.pick.times(formatEventDay(`${day}T12:00:00+05:30`))}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-1">
                    {times.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        aria-pressed={slot === startsAt}
                        onClick={() => {
                          setStartsAt(slot);
                          setError("");
                        }}
                        className={`h-[2.3125rem] border text-sm transition-colors ${slot === startsAt ? "border-ink bg-ink text-white" : "border-[#dadada] text-ink hover:border-ink"}`}
                      >
                        {formatClock(slot)}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-ink-soft md:pt-12">{copy.pick.chooseDay}</p>
              )}
            </div>
          </div>
        )}

        <StickyActions className="mt-6 [@media(max-height:1000px)]:mt-4">
          <div className="mx-auto max-w-[20.625rem]">
            <SubmitButton type="button" loading={false} loadingLabel="" disabled={!startsAt} onClick={() => setStep("confirm")}>
              {copy.pick.next}
            </SubmitButton>
          </div>
        </StickyActions>
      </div>
    );
  })();

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
        className={`relative m-auto w-full animate-[auth-card-in_400ms_cubic-bezier(0.22,1,0.36,1)] bg-white transition-[max-width] duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none px-5 pt-12 pb-9 motion-reduce:animate-none sm:px-10 md:pt-[3.125rem] md:pb-[3.25rem] [@media(max-height:1000px)]:pt-10 [@media(max-height:1000px)]:pb-6 [@media(max-height:1000px)]:md:pt-10 [@media(max-height:1000px)]:md:pb-7 ${
          step === "pick" ? "max-w-[46rem]" : "max-w-[34.4375rem]"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className="absolute top-3 right-3 flex size-10 items-center justify-center text-ink transition-transform duration-300 hover:rotate-90 focus-visible:outline-2 focus-visible:outline-brand md:top-[1.375rem] md:right-[1.375rem]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-6" aria-hidden>
            <path d="M3 3l18 18M21 3L3 21" />
          </svg>
        </button>
        <AnimatedHeight>
          <div key={step} className={stepEnterClass(direction)}>
            {content}
          </div>
        </AnimatedHeight>
      </div>
    </div>,
    document.body,
  );
}
