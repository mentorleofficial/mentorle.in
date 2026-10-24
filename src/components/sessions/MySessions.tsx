"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AccountGate, AccountLoading, AccountNotice } from "@/components/account/AccountGate";
import { SessionCard } from "@/components/sessions/SessionCard";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { sessionsCopy as copy } from "@/data/sessions";
import { useAuth } from "@/lib/auth/AuthProvider";
import { sessionsService, splitSessions } from "@/lib/sessions/service";
import type { MySession } from "@/lib/sessions/service";
import { prefetchFor } from "@/lib/routes";

type Tab = "upcoming" | "past";

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

function SessionList() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<MySession[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<Tab>("upcoming");
  const [now, setNow] = useState(0);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const rows = await sessionsService.listMine(user.id);
      setSessions(rows);
      setFailed(false);
      setNow(Date.now());
    } catch {
      setFailed(true);
    }
  }, [user]);

  useEffect(() => {
    queueMicrotask(() => void load());
    // Keeps "Happening now" and the upcoming/past split current, and picks up moves made elsewhere.
    const tick = setInterval(() => setNow(Date.now()), 60_000);
    const onVisible = () => document.visibilityState === "visible" && void load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  if (failed && !sessions)
    return (
      <AccountNotice title={copy.error}>
        <button type="button" onClick={() => void load()} className={buttonClasses("dark")}>
          {copy.retry}
        </button>
      </AccountNotice>
    );
  if (!sessions) return <AccountLoading label={copy.loading} />;

  const { upcoming, past } = splitSessions(sessions, now);
  const list = tab === "upcoming" ? upcoming : past;
  const empty = copy.empty[tab];

  return (
    <div className="animate-[auth-step-in_300ms_ease-out] motion-reduce:animate-none">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label={copy.title} className="flex gap-3">
          {(["upcoming", "past"] as const).map((key) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key} aria-controls="sessions-panel" onClick={() => setTab(key)} className={tabClasses(tab === key)}>
              {copy.tabs[key]}
              <span className={`text-xs tabular-nums ${tab === key ? "text-white/70" : "text-muted"}`}>{(key === "upcoming" ? upcoming : past).length}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-ink-soft" aria-live="polite">
          {copy.count(list.length)}
        </p>
      </div>

      <div id="sessions-panel" role="tabpanel" className="mt-8">
        {list.length === 0 ? (
          <div className="border border-[#cbcbcb] bg-white px-6 py-12 text-center md:py-16">
            <h2 className="text-xl font-medium text-ink lg:text-2xl">{empty.title}</h2>
            <p className="mx-auto mt-2 max-w-[28rem] text-base leading-snug text-ink-soft">{empty.body}</p>
            {"cta" in empty && (
              <Link href="/mentors" prefetch={prefetchFor("/mentors")} className={buttonClasses("brand", "mt-6")}>
                {empty.cta}
              </Link>
            )}
          </div>
        ) : (
          <div key={tab} className="grid gap-5">
            {list.map((session, index) => (
              <SessionCard key={session.id} session={session} upcoming={tab === "upcoming"} highlight={tab === "upcoming" && index === 0} now={now} />
            ))}
          </div>
        )}
      </div>

      {tab === "upcoming" && <p className="mt-8 max-w-[42rem] text-sm leading-relaxed text-ink-soft">{copy.final}</p>}
    </div>
  );
}
