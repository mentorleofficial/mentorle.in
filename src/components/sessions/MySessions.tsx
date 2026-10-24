"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AccountGate, AccountLoading, AccountNotice } from "@/components/account/AccountGate";
import { ActionItems } from "@/components/sessions/ActionItems";
import { RateSessionDialog } from "@/components/sessions/RateSessionDialog";
import { SessionCard } from "@/components/sessions/SessionCard";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { sessionsCopy as copy } from "@/data/sessions";
import { useAuth } from "@/lib/auth/AuthProvider";
import { istDayKey } from "@/lib/dates";
import { actionItemsService } from "@/lib/sessions/actionItems";
import type { ActionItem } from "@/lib/sessions/actionItems";
import { sessionsService, splitSessions } from "@/lib/sessions/service";
import type { MySession } from "@/lib/sessions/service";
import { prefetchFor } from "@/lib/routes";

type Tab = "upcoming" | "past" | "tasks";
// /sessions#action-items (the bell's "New Action Item Assigned") opens the Action items tab.
const TASKS_HASH = "#action-items";

const tabClasses = (active: boolean) =>
  `inline-flex h-[2.3125rem] items-center gap-2 border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
    active ? "border-ink bg-ink text-white" : "border-[#dadada] bg-transparent text-ink hover:border-ink"
  }`;

export function MySessions() {
  return (
    <AccountGate path="/sessions" loading={copy.loading} signedOut={copy.gate.signedOut} profileGate={copy.gate.finishProfile}>
      <SessionList />
    </AccountGate>
  );
}

type Data = { sessions: MySession[]; items: ActionItem[]; filesAllowed: Map<string, boolean> };

function SessionList() {
  const { user } = useAuth();
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTabState] = useState<Tab>("upcoming");
  const [now, setNow] = useState(0);
  const [rating, setRating] = useState<MySession | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const [sessions, items] = await Promise.all([sessionsService.listMine(user.id), actionItemsService.listMine(user.id)]);
      const filesAllowed = await actionItemsService.filesAllowed([...new Set(items.map((item) => item.mentorId))]);
      setData({ sessions, items, filesAllowed });
      setFailed(false);
      setNow(Date.now());
    } catch {
      setFailed(true);
    }
  }, [user]);

  const setTab = (next: Tab) => {
    setTabState(next);
    // Keeps the Action items tab linkable without adding history entries.
    const hash = next === "tasks" ? TASKS_HASH : "";
    if (window.location.hash !== hash) history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
  };

  useEffect(() => {
    const fromHash = () => window.location.hash === TASKS_HASH && setTabState("tasks");
    queueMicrotask(() => {
      fromHash();
      void load();
    });
    // Keeps "Happening now" and the upcoming/past split current, and picks up changes made elsewhere.
    const tick = setInterval(() => setNow(Date.now()), 60_000);
    const onVisible = () => document.visibilityState === "visible" && void load();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("hashchange", fromHash);
    return () => {
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("hashchange", fromHash);
    };
  }, [load]);

  if (failed && !data)
    return (
      <AccountNotice title={copy.error}>
        <button type="button" onClick={() => void load()} className={buttonClasses("dark")}>
          {copy.retry}
        </button>
      </AccountNotice>
    );
  if (!data || !user) return <AccountLoading label={copy.loading} />;

  const { sessions, items, filesAllowed } = data;
  const { upcoming, past } = splitSessions(sessions, now);
  const openItems = items.filter((item) => !item.done).length;
  const counts: Record<Tab, number> = { upcoming: upcoming.length, past: past.length, tasks: openItems };
  const list = tab === "upcoming" ? upcoming : past;
  const empty = copy.empty[tab];
  const itemsFor = (sessionId: string) => {
    const mine = items.filter((item) => item.sessionId === sessionId);
    return { open: mine.filter((item) => !item.done).length, total: mine.length };
  };
  const updateItem = (next: ActionItem) => setData((current) => current && { ...current, items: current.items.map((item) => (item.id === next.id ? next : item)) });
  const updateRating = (sessionId: string, myRating: MySession["myRating"]) =>
    setData((current) => current && { ...current, sessions: current.sessions.map((session) => (session.id === sessionId ? { ...session, myRating } : session)) });
  const showing = tab === "tasks" ? items.length : list.length;

  return (
    <div className="animate-[auth-step-in_300ms_ease-out] motion-reduce:animate-none">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label={copy.title} className="flex flex-wrap gap-3">
          {(["upcoming", "past", "tasks"] as const).map((key) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key} aria-controls="sessions-panel" onClick={() => setTab(key)} className={tabClasses(tab === key)}>
              {copy.tabs[key]}
              <span className={`text-xs tabular-nums ${tab === key ? "text-white/70" : "text-muted"}`}>{counts[key]}</span>
            </button>
          ))}
        </div>
        {tab !== "tasks" && (
          <p className="text-sm text-ink-soft" aria-live="polite">
            {copy.count(list.length)}
          </p>
        )}
      </div>

      <div id="sessions-panel" role="tabpanel" className="mt-8">
        {showing === 0 ? (
          <div className="border border-[#cbcbcb] bg-white px-6 py-12 text-center md:py-16">
            <h2 className="text-xl font-medium text-ink lg:text-2xl">{empty.title}</h2>
            <p className="mx-auto mt-2 max-w-[28rem] text-base leading-snug text-ink-soft">{empty.body}</p>
            {"cta" in empty && (
              <Link href="/mentors" prefetch={prefetchFor("/mentors")} className={buttonClasses("brand", "mt-6")}>
                {empty.cta}
              </Link>
            )}
          </div>
        ) : tab === "tasks" ? (
          <ActionItems items={items} sessions={sessions} userId={user.id} filesAllowed={filesAllowed} today={istDayKey(new Date(now))} onChange={updateItem} />
        ) : (
          <div key={tab} className="grid gap-5">
            {list.map((session, index) => (
              <SessionCard
                key={session.id}
                session={session}
                upcoming={tab === "upcoming"}
                highlight={tab === "upcoming" && index === 0}
                now={now}
                actionItems={itemsFor(session.id)}
                onShowActionItems={() => setTab("tasks")}
                onRate={() => setRating(session)}
              />
            ))}
          </div>
        )}
      </div>

      {tab === "upcoming" && <p className="mt-8 max-w-[42rem] text-sm leading-relaxed text-ink-soft">{copy.final}</p>}

      {rating && <RateSessionDialog session={rating} userId={user.id} onClose={() => setRating(null)} onRated={(myRating) => updateRating(rating.id, myRating)} />}
    </div>
  );
}
