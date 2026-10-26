"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccountLoading, AccountNotice } from "@/components/account/AccountGate";
import { outlineButtonClasses } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { liveCopy as copy } from "@/data/event";
import { useAuth } from "@/lib/auth/AuthProvider";
import { eventService } from "@/lib/event/service";
import type { DrawResult, LiveFeed } from "@/lib/event/service";

const POLL_MS = 4000;
const RESULT_RETRY_MS = 800;

type Outcome = "won" | "lost" | "notEntered" | "signedOut";

// The public live page (/live): "the winner will be revealed soon" while the event is on (checked every few seconds).
// When an admin spins the wheel on the platform, every phone shows the same countdown (to the server's reveal time)
// and then the viewer's own result. No names or counts here; the server only says who won once the countdown is over.
export function LiveBoard() {
  const { status } = useAuth();
  const [feed, setFeed] = useState<LiveFeed | null>(null);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(0);
  // The draw being counted down / shown full screen, and the result of the latest draw for the inline card.
  const [countdown, setCountdown] = useState<{ drawId: string; endsAt: number } | null>(null);
  const [overlay, setOverlay] = useState<{ drawId: string; outcome: Outcome | null } | null>(null);
  const [latest, setLatest] = useState<{ drawId: string; outcome: Outcome } | null>(null);
  const seenDraw = useRef<string | null>(null);

  const outcomeFor = useCallback(
    async (drawId: string): Promise<Outcome> => {
      if (status !== "signed-in") return "signedOut";
      for (let attempt = 0; attempt < 8; attempt++) {
        const result: DrawResult = await eventService.myDrawResult().catch(() => ({ status: "pending" }) as DrawResult);
        if (result.status === "won") return "won";
        if (result.status === "lost") return "lost";
        if (result.status === "not_entered" || (result.status !== "pending" && result.draw_id !== drawId)) return "notEntered";
        await new Promise((resolve) => setTimeout(resolve, RESULT_RETRY_MS));
      }
      return "notEntered";
    },
    [status],
  );

  // Polling
  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async () => {
      try {
        const next = await eventService.liveFeed();
        if (!live) return;
        setFeed(next);
        setFailed(false);
        setNow(Date.now());
        const draw = next.draw;
        if (draw && draw.id !== seenDraw.current) {
          seenDraw.current = draw.id;
          if (draw.reveal_in_ms > 0) setCountdown({ drawId: draw.id, endsAt: Date.now() + draw.reveal_in_ms });
          else setLatest(null); // an earlier draw: resolved below once auth is known
        }
      } catch {
        if (live) setFailed(true);
      }
      if (live) timer = setTimeout(() => void tick(), POLL_MS);
    };
    void tick();
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, []);

  // A finished draw that was already over when the page opened: show the viewer's result inline.
  const drawId = feed?.draw?.id;
  const drawOver = feed?.draw ? feed.draw.reveal_in_ms === 0 : false;
  useEffect(() => {
    if (!drawId || !drawOver || status === "loading" || countdown?.drawId === drawId || overlay?.drawId === drawId) return;
    if (latest?.drawId === drawId) return;
    let live = true;
    void outcomeFor(drawId).then((outcome) => live && setLatest({ drawId, outcome }));
    return () => {
      live = false;
    };
  }, [drawId, drawOver, status, countdown, overlay, latest, outcomeFor]);

  // Countdown ticking, then the full-screen result.
  useEffect(() => {
    if (!countdown) return;
    const timer = setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= countdown.endsAt) {
        clearInterval(timer);
        const id = countdown.drawId;
        setCountdown(null);
        setOverlay({ drawId: id, outcome: null });
        void outcomeFor(id).then((outcome) => {
          setOverlay((current) => (current?.drawId === id ? { drawId: id, outcome } : current));
          setLatest({ drawId: id, outcome });
        });
      }
    }, 100);
    return () => clearInterval(timer);
  }, [countdown, outcomeFor]);

  const event = feed?.event ?? null;
  const title = event?.name ?? copy.fallbackTitle;

  return (
    <>
      <section aria-labelledby="live-title" className="bg-ink text-white">
        <div className="container-page pt-28 pb-12 md:pt-[10.5rem] md:pb-16 xl:pt-[12.125rem]">
          <p className="flex items-center gap-2 text-sm tracking-[0.06em] text-white/75 uppercase">
            {event?.active && <span className="size-2 animate-pulse bg-brand motion-reduce:animate-none" aria-hidden />}
            {copy.eyebrow}
          </p>
          <h1 id="live-title" className="mt-4 max-w-[48rem] text-[2.125rem] leading-[1.18] font-medium tracking-[-0.01em] md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-[42rem] text-base leading-snug text-white/90 md:text-lg">{event && !event.active ? copy.ended : copy.subtitle}</p>
        </div>
      </section>

      <section className="bg-surface py-14 md:py-20 lg:py-24">
        <div className="container-page max-w-[48rem]">
          {failed && <p className="mb-6 text-sm text-ink-soft" role="status">{copy.error}</p>}
          {!feed && !failed && <AccountLoading label={copy.loading} />}
          {feed && !event && <AccountNotice title={copy.noEvent.title} body={copy.noEvent.body} />}
          {event && (
            <>
              {latest ? (
                <ResultCard outcome={latest.outcome} />
              ) : (
                <div className="animate-[auth-step-in_300ms_ease-out] border border-[#cbcbcb] bg-white p-6 text-center motion-reduce:animate-none md:p-10">
                  <span className="mx-auto mb-5 block size-3 animate-pulse bg-brand motion-reduce:animate-none" aria-hidden />
                  <h2 className="text-[1.625rem] leading-tight font-medium text-ink md:text-[2rem]">{copy.waiting.title}</h2>
                  <p className="mx-auto mt-3 max-w-[30rem] text-base leading-snug text-ink-soft">{copy.waiting.body}</p>
                </div>
              )}
              {event.active && status === "signed-out" && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-[#cbcbcb] bg-white p-5 md:p-6">
                  <p className="text-base text-ink">{copy.join.prompt}</p>
                  <Link href="/signup?redirect=%2Flive" className={buttonClasses("brand")}>
                    {copy.join.cta}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {countdown && <Countdown seconds={Math.max(0, Math.ceil((countdown.endsAt - now) / 1000))} />}
      {overlay && <ResultOverlay outcome={overlay.outcome} onClose={() => setOverlay(null)} />}
    </>
  );
}

function Countdown({ seconds }: { seconds: number }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink px-4 text-center text-white" role="alertdialog" aria-modal="true" aria-labelledby="countdown-label">
      <p id="countdown-label" className="text-xl text-white/90 md:text-2xl">
        {copy.countdown.label}
      </p>
      <p key={seconds} className="mt-6 animate-[auth-card-in_400ms_cubic-bezier(0.22,1,0.36,1)] text-[clamp(8rem,30vw,16rem)] leading-none font-medium text-brand tabular-nums motion-reduce:animate-none" aria-live="assertive">
        {seconds}
      </p>
      <p className="mt-6 text-lg text-white/75">{copy.countdown.sub}</p>
    </div>
  );
}

const outcomeText = (outcome: Outcome) =>
  outcome === "won" ? copy.result.won : outcome === "lost" ? copy.result.lost : outcome === "signedOut" ? copy.result.signedOut : copy.result.notEntered;

function ResultOverlay({ outcome, onClose }: { outcome: Outcome | null; onClose: () => void }) {
  const won = outcome === "won";
  const text = outcome ? outcomeText(outcome) : null;
  return (
    <div
      className={`fixed inset-0 z-[100] flex animate-[auth-backdrop-in_300ms_ease-out] flex-col items-center justify-center px-4 text-center text-white ${won ? "bg-brand" : "bg-ink"}`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="result-title"
    >
      {!text ? (
        <p id="result-title" className="text-xl text-white/90" role="status">
          {copy.result.checking}
        </p>
      ) : (
        <div className="max-w-[44rem] animate-[auth-card-in_500ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none">
          <h2 id="result-title" className="text-[2.5rem] leading-[1.1] font-medium tracking-[-0.01em] md:text-[4rem]">
            {text.title}
          </h2>
          <p className="mx-auto mt-5 max-w-[34rem] text-lg leading-snug text-white/90 md:text-xl">{text.body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {outcome === "signedOut" && (
              <Link href="/login?redirect=%2Flive" className={buttonClasses("light")}>
                {copy.result.signedOut.cta}
              </Link>
            )}
            <button type="button" onClick={onClose} className={buttonClasses(outcome === "signedOut" ? "ghost" : "light")}>
              {copy.result.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ outcome }: { outcome: Outcome }) {
  const text = outcomeText(outcome);
  return (
    <div className={`mb-8 border p-6 md:p-8 ${outcome === "won" ? "border-brand bg-brand text-white" : "border-[#cbcbcb] bg-white text-ink"}`}>
      <h2 className="text-xl font-medium lg:text-2xl">{text.title}</h2>
      <p className={`mt-2 max-w-[34rem] text-base leading-snug ${outcome === "won" ? "text-white/90" : "text-ink-soft"}`}>{text.body}</p>
      {outcome === "signedOut" && (
        <div className="mt-5">
          <Link href="/login?redirect=%2Flive" className={outlineButtonClasses()}>
            {copy.result.signedOut.cta}
          </Link>
        </div>
      )}
      {outcome === "lost" && (
        <div className="mt-5">
          <Link href="/mentors" className={buttonClasses("brand")}>
            {copy.result.explore}
          </Link>
        </div>
      )}
    </div>
  );
}
