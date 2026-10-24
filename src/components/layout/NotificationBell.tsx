"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { notificationLinks, notificationsCopy as copy } from "@/data/notifications";
import { formatRelativeTime } from "@/lib/dates";
import { notificationActions, useNotifications } from "@/lib/notifications/store";
import type { AppNotification } from "@/lib/notifications/store";
import { prefetchFor } from "@/lib/routes";

// Line icons per notification kind (stroke style of the header's own icons).
function KindIcon({ type }: { type: string }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, className: "size-5", "aria-hidden": true } as const;
  const calendar = (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  );
  if (type === "session_booked" || type === "session_completed")
    return (
      <svg {...common}>
        {calendar}
        <path d="M8.5 15l2.5 2.5 4.5-5" />
      </svg>
    );
  if (type.startsWith("session_cancelled"))
    return (
      <svg {...common}>
        {calendar}
        <path d="M9.5 12.5l5 5M14.5 12.5l-5 5" />
      </svg>
    );
  if (type === "session_rescheduled" || type === "session_updated")
    return (
      <svg {...common}>
        {calendar}
        <circle cx="12" cy="15" r="3" />
        <path d="M12 13.5V15l1 1" />
      </svg>
    );
  if (type === "action_item_assigned")
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" />
        <path d="M8 12l3 3 5-6" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2H4.5z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-[1.375rem]" aria-hidden>
      <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2H4.5z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

function Item({ item, now, onOpen }: { item: AppNotification; now: number; onOpen: (item: AppNotification) => void }) {
  return (
    <li className={`group relative flex gap-3 border-b border-line px-4 py-3.5 transition-colors last:border-b-0 hover:bg-surface ${item.read ? "" : "bg-brand/[0.04]"}`}>
      <span className={`mt-0.5 shrink-0 ${item.read ? "text-muted" : "text-brand"}`}>
        <KindIcon type={item.type} />
      </span>
      <button type="button" onClick={() => onOpen(item)} className="min-w-0 flex-1 text-left focus-visible:outline-none after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-brand">
        <span className="flex items-start gap-2">
          <span className={`text-sm leading-snug text-ink ${item.read ? "" : "font-medium"}`}>{item.title}</span>
          {!item.read && <span className="mt-1.5 size-1.5 shrink-0 bg-brand" aria-label={copy.unreadDot} />}
        </span>
        <span className="mt-1 line-clamp-3 block text-[0.8125rem] leading-snug text-ink-soft">{item.message}</span>
        <span className="mt-1.5 block text-xs text-muted">{formatRelativeTime(item.createdAt, now, copy.justNow)}</span>
      </button>
      <button
        type="button"
        onClick={() => notificationActions.remove(item.id)}
        aria-label={`${copy.remove}: ${item.title}`}
        className="relative z-10 -mr-1 flex size-7 shrink-0 items-center justify-center text-muted opacity-100 transition-opacity hover:text-ink focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-brand md:opacity-0 md:group-hover:opacity-100"
      >
        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-3" aria-hidden>
          <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" />
        </svg>
      </button>
    </li>
  );
}

// Header bell for signed-in mentees: unread count on the icon, and a panel of recent notifications. Opening one
// marks it read and, for session updates, goes to My sessions. On desktop the panel hangs under the bell; on
// phones (`fullWidth`) it spans the header bar, which is the positioned ancestor there.
export function NotificationBell({ fullWidth = false, className = "" }: { fullWidth?: boolean; className?: string }) {
  const { status, items, unread } = useNotifications();
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(0);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => {
    // Relative times are worked out when the panel opens (never during render, so server and client agree).
    setNow(Date.now());
    setOpen((value) => !value);
  };

  const openItem = (item: AppNotification) => {
    notificationActions.markRead(item.id);
    const href = notificationLinks[item.type];
    if (href) {
      setOpen(false);
      router.push(href);
    }
  };

  return (
    <div ref={rootRef} className={`${fullWidth ? "" : "relative"} ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={unread ? `${copy.label}: ${copy.unread(unread)}` : copy.label}
        onClick={toggle}
        className="relative flex size-10 items-center justify-center text-white/90 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <BellIcon />
        {unread > 0 && (
          <span className="absolute top-1 right-0.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center bg-brand px-1 text-[0.625rem] leading-none font-semibold text-white tabular-nums" aria-hidden>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          id={panelId}
          role="region"
          aria-label={copy.label}
          className={`absolute top-full z-50 mt-2 animate-[auth-step-in_200ms_ease-out] bg-white shadow-[0_0.75rem_2rem_rgb(0_0_0/0.18)] ${fullWidth ? "inset-x-0" : "left-0 mt-3 w-[23rem]"}`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <p className="text-base font-medium text-ink">{copy.label}</p>
            {unread > 0 && (
              <button type="button" onClick={notificationActions.markAllRead} className="text-xs text-ink underline-offset-4 hover:underline focus-visible:underline">
                {copy.markAll}
              </button>
            )}
          </div>
          {/* Lenis would otherwise scroll the page instead of the list. */}
          <div data-lenis-prevent className="max-h-[min(26rem,65vh)] overflow-y-auto overscroll-contain">
            {status === "error" ? (
              <p className="px-4 py-8 text-center text-sm text-ink-soft">{copy.error}</p>
            ) : status !== "ready" ? (
              <p className="px-4 py-8 text-center text-sm text-muted" role="status">
                {copy.loading}
              </p>
            ) : items.length === 0 ? (
              <p className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-ink-soft">
                <span className="text-muted">
                  <BellIcon />
                </span>
                {copy.empty}
              </p>
            ) : (
              <ul>
                {items.map((item) => (
                  <Item key={item.id} item={item} now={now} onOpen={openItem} />
                ))}
              </ul>
            )}
          </div>
          <Link
            href="/sessions"
            prefetch={prefetchFor("/sessions")}
            onClick={() => setOpen(false)}
            className="block border-t border-line px-4 py-3 text-sm text-ink transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
          >
            {copy.viewSessions} <span aria-hidden>→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
