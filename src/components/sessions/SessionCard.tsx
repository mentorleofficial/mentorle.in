"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/layout/AccountMenu";
import { Stars } from "@/components/sessions/Stars";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { sessionsCopy as copy } from "@/data/sessions";
import { googleCalendarUrl } from "@/lib/calendar";
import { formatDateParts, formatEventDateTime, formatEventTimeRange } from "@/lib/dates";
import { endsAt } from "@/lib/sessions/service";
import type { MySession } from "@/lib/sessions/service";

const chipTone: Record<string, string> = {
  booked: "bg-[#fff0ea] text-brand",
  completed: "bg-surface text-ink",
  cancelled: "bg-surface text-ink-soft",
  no_show: "bg-surface text-ink-soft",
};

const secondaryButton =
  "inline-flex h-[2.3125rem] items-center border border-[#dadada] bg-white px-4 text-sm text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

type CardProps = {
  session: MySession;
  upcoming: boolean;
  highlight: boolean;
  now: number;
  actionItems?: { open: number; total: number };
  onShowActionItems?: () => void;
  onRate?: () => void;
};

// One session: an IST date block, the title with the mentor, time, status and the mentee's note. Upcoming
// sessions get Join, a calendar link and Copy link; the first one is marked "Next session". Completed ones get
// "Rate session" (or the rating given, with the mentor's reply) and the mentor's feedback.
export function SessionCard({ session, upcoming, highlight, now, actionItems, onShowActionItems, onRate }: CardProps) {
  const [copied, setCopied] = useState(false);
  const date = formatDateParts(session.startsAt);
  const end = new Date(endsAt(session)).toISOString();
  const live = upcoming && Date.parse(session.startsAt) <= now;
  const label = live ? copy.now : highlight ? copy.next : null;
  const muted = session.status === "cancelled" || session.status === "no_show";

  return (
    <article
      aria-label={`${session.title}, ${formatEventDateTime(session.startsAt)}`}
      className={`grid gap-5 border bg-white p-5 md:grid-cols-[5.5rem_minmax(0,1fr)] md:gap-7 md:p-7 lg:grid-cols-[5.5rem_minmax(0,1fr)_auto] ${highlight ? "border-ink" : "border-[#cbcbcb]"}`}
    >
      <div className={`flex items-baseline gap-2 md:flex-col md:items-start md:gap-0 md:border-r md:border-line md:pr-6 ${muted ? "text-ink-soft" : "text-ink"}`}>
        <span className="text-xs tracking-[0.06em] text-muted uppercase">{date.weekday}</span>
        <span className="text-[2rem] leading-none font-medium tabular-nums md:mt-1.5 md:text-[2.5rem]">{date.day}</span>
        <span className="text-sm md:mt-1">
          {date.month} {date.year}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          {label && <span className="text-xs tracking-[0.06em] text-brand uppercase">{label}</span>}
          <span className={`inline-flex h-7 items-center px-3 text-xs ${chipTone[session.status] ?? chipTone.completed}`}>{copy.status[session.status] ?? session.status}</span>
        </div>
        <h3 className={`mt-3 text-xl leading-snug font-medium lg:text-2xl ${muted ? "text-ink-soft" : "text-ink"}`}>{session.title}</h3>
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-2">
            <Avatar name={session.mentor.name} url={session.mentor.avatarUrl} className="size-7 text-[0.625rem]" />
            <span>
              {copy.with}{" "}
              {session.mentor.slug ? (
                <Link href={`/mentors/${session.mentor.slug}`} className="text-ink underline-offset-4 hover:underline">
                  {session.mentor.name}
                </Link>
              ) : (
                <span className="text-ink">{session.mentor.name}</span>
              )}
            </span>
          </span>
          <span aria-hidden className="hidden text-line sm:inline">
            |
          </span>
          <span>
            {formatEventTimeRange(session.startsAt, end)} · {session.durationMinutes} min
          </span>
        </p>
        {session.previousStartsAt && session.status === "booked" && <p className="mt-2 text-sm text-ink-soft">{copy.movedFrom(formatEventDateTime(session.previousStartsAt))}</p>}
        {session.status === "cancelled" && session.cancellationReason && <p className="mt-2 text-sm text-ink-soft">{copy.cancelledReason(session.cancellationReason)}</p>}
        {session.notes && (
          <div className="mt-4 border-l-2 border-line pl-3">
            <p className="text-xs text-muted">{copy.notesLabel}</p>
            <p className="mt-0.5 line-clamp-3 text-sm leading-relaxed whitespace-pre-line text-ink/85">{session.notes}</p>
          </div>
        )}
        {session.myRating && (
          <div className="mt-4 border-l-2 border-brand/40 pl-3">
            <p className="flex items-center gap-2 text-xs text-muted">
              {copy.yourRating} <Stars value={session.myRating.rating} label={copy.stars(session.myRating.rating)} className="size-3.5" />
            </p>
            {session.myRating.comment && <p className="mt-1 line-clamp-3 text-sm leading-relaxed whitespace-pre-line text-ink/85">{session.myRating.comment}</p>}
            {session.myRating.reply && (
              <p className="mt-2 text-sm leading-relaxed text-ink/85">
                <span className="font-medium text-ink">{copy.mentorReply}:</span> {session.myRating.reply}
              </p>
            )}
          </div>
        )}
        {session.mentorFeedback && (
          <div className="mt-4 border-l-2 border-line pl-3">
            <p className="flex items-center gap-2 text-xs text-muted">
              {copy.mentorFeedback} <Stars value={session.mentorFeedback.rating} label={copy.stars(session.mentorFeedback.rating)} className="size-3.5" />
            </p>
            {session.mentorFeedback.comment && <p className="mt-1 text-sm leading-relaxed whitespace-pre-line text-ink/85">{session.mentorFeedback.comment}</p>}
          </div>
        )}
        {actionItems && actionItems.total > 0 && onShowActionItems && (
          <button type="button" onClick={onShowActionItems} className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink underline-offset-4 hover:underline">
            {copy.actionItemsLink(actionItems.open, actionItems.total)} <span aria-hidden>→</span>
          </button>
        )}
      </div>

      {!upcoming && session.status === "completed" && !session.myRating && onRate && (
        <div className="md:col-start-2 lg:col-start-3 lg:w-[13.5rem] lg:self-center">
          <button type="button" onClick={onRate} className={buttonClasses("brand", "lg:w-full")}>
            {copy.rate}
          </button>
        </div>
      )}

      {upcoming && session.meetingUrl && (
        <div className="flex flex-wrap gap-2.5 md:col-start-2 lg:col-start-3 lg:w-[13.5rem] lg:flex-col lg:self-center">
          <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses("brand", "lg:w-full")}>
            {copy.join} <span aria-hidden className="ml-1.5">↗</span>
          </a>
          <a
            href={googleCalendarUrl(`${session.title} with ${session.mentor.name}`, session.startsAt, session.durationMinutes, session.meetingUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${secondaryButton} lg:w-full lg:justify-center`}
          >
            {copy.calendar}
          </a>
          <button
            type="button"
            onClick={() => void navigator.clipboard?.writeText(session.meetingUrl).then(() => setCopied(true))}
            className={`${secondaryButton} lg:w-full lg:justify-center`}
          >
            {copied ? copy.copied : copy.copyLink}
          </button>
        </div>
      )}
    </article>
  );
}
