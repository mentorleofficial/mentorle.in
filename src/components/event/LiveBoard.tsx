"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { liveCopy as copy } from "@/data/event";
import { useAuth } from "@/lib/auth/AuthProvider";
import { eventService } from "@/lib/event/service";
import type { DrawResult, LiveFeed } from "@/lib/event/service";

// One request per check. Every phone hears about a spin during the server's lead-in (6s before the 12-second
// countdown starts), so ~5s between checks keeps every countdown in sync at a quarter of the old load.
const POLL_MS = 5000;
const POLL_JITTER_MS = 600; // spreads thousands of phones out instead of hitting at the same instant
const RESULT_SPREAD_MS = 1500; // at the reveal, results are asked for over 1.5s, not all at once
const RESULT_RETRY_MS = 800;

export type Outcome = "won" | "lost" | "notEntered" | "signedOut";

type Armed = { drawId: string; revealAt: number; countdownMs: number };

// The public live page (/live): one dark stage with "the winner will be revealed soon" while the event is on, checked
// every ~5 seconds (paused while the phone's screen is off). When an admin spins the wheel, the server sets the reveal
// 18 seconds ahead; each phone works out that moment on its own clock (allowing for the request's travel time), shows
// the same 12-second countdown and then the viewer's own result. No names or counts here; the server only says who
// won once the countdown is over.
export function LiveBoard() {
  const { status, user } = useAuth();
  const [feed, setFeed] = useState<LiveFeed | null>(null);
  const [failed, setFailed] = useState(false);
  const [armed, setArmed] = useState<Armed | null>(null);
  const [counting, setCounting] = useState(false);
  const [overlay, setOverlay] = useState<{ drawId: string; outcome: Outcome | null } | null>(null);
  const [latest, setLatest] = useState<{ drawId: string; outcome: Outcome } | null>(null);
  const seenDraw = useRef<string | null>(null);
  const armedRef = useRef<Armed | null>(null);
  useEffect(() => {
    armedRef.current = armed;
  }, [armed]);

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

  // Polling. Skipped while a countdown is armed (nothing can change before the reveal) or the page is hidden.
  useEffect(() => {
    let live = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => void tick(), POLL_MS + (Math.random() * 2 - 1) * POLL_JITTER_MS);
    };
    const tick = async () => {
      if (!live) return;
      if (document.hidden || armedRef.current) return schedule();
      const sent = Date.now();
      try {
        const next = await eventService.liveFeed();
        if (!live) return;
        // The server measured "reveal in" around the middle of the round trip.
        const serverNow = (sent + Date.now()) / 2;
        setFeed(next);
        setFailed(false);
        const draw = next.draw;
        if (draw && draw.id !== seenDraw.current) {
          seenDraw.current = draw.id;
          if (draw.reveal_in_ms > 0) setArmed({ drawId: draw.id, revealAt: serverNow + draw.reveal_in_ms, countdownMs: draw.countdown_ms || 12_000 });
        }
      } catch {
        if (live) setFailed(true);
      }
      schedule();
    };
    const onVisible = () => {
      if (!document.hidden) void tick();
    };
    void tick();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      live = false;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [status]);

  // An armed draw: the countdown appears exactly countdownMs before the reveal (or straight away if the phone heard
  // late), then at the reveal the viewer's result is fetched, spread over a moment so phones don't all ask at once.
  useEffect(() => {
    if (!armed) return;
    const now = Date.now();
    const showIn = Math.max(0, armed.revealAt - armed.countdownMs - now);
    const show = setTimeout(() => setCounting(true), showIn);
    const reveal = setTimeout(() => {
      setCounting(false);
      setArmed(null);
      setOverlay({ drawId: armed.drawId, outcome: null });
      setTimeout(() => {
        void outcomeFor(armed.drawId).then((outcome) => {
          setOverlay((current) => (current?.drawId === armed.drawId ? { drawId: armed.drawId, outcome } : current));
          setLatest({ drawId: armed.drawId, outcome });
        });
      }, Math.random() * RESULT_SPREAD_MS);
    }, Math.max(0, armed.revealAt - now));
    return () => {
      clearTimeout(show);
      clearTimeout(reveal);
    };
  }, [armed, outcomeFor]);

  // A draw that was already over when the page opened: the viewer's result replaces the waiting message.
  const drawId = feed?.draw?.id;
  const drawOver = feed?.draw ? feed.draw.reveal_in_ms === 0 : false;
  useEffect(() => {
    if (!drawId || !drawOver || status === "loading" || armed?.drawId === drawId || overlay?.drawId === drawId || latest?.drawId === drawId) return;
    let live = true;
    void outcomeFor(drawId).then((outcome) => live && setLatest({ drawId, outcome }));
    return () => {
      live = false;
    };
  }, [drawId, drawOver, status, armed, overlay, latest, outcomeFor]);

  const firstName = (user?.full_name ?? "").trim().split(/\s+/)[0] ?? "";

  return (
    <>
      <LiveStage feed={feed} failed={failed} status={status} entered={Boolean(feed?.me?.entered)} firstName={firstName} latest={latest?.outcome ?? null} />

      {armed && counting && <Countdown key={armed.drawId} endsAt={armed.revealAt} total={armed.countdownMs} />}
      {overlay && <ResultOverlay outcome={overlay.outcome} onClose={() => setOverlay(null)} />}
    </>
  );
}

// The page itself, from plain props, so the preview below shows exactly what attendees see.
type StageProps = { feed: LiveFeed | null; failed: boolean; status: "loading" | "signed-in" | "signed-out"; entered: boolean; firstName: string; latest: Outcome | null };

export function LiveStage({ feed, failed, status, entered, firstName, latest }: StageProps) {
  const event = feed?.event ?? null;
  return (
  <section aria-labelledby="live-title" className="relative isolate overflow-hidden bg-ink text-white">
    <div className="container-page flex min-h-svh flex-col items-center justify-center pt-28 pb-16 text-center md:pt-[10.5rem] md:pb-24">
      <p className="flex items-center gap-3 text-sm tracking-[0.12em] text-white/75 uppercase">
        <span className={`size-2.5 bg-brand ${event?.active ? "animate-pulse motion-reduce:animate-none" : ""}`} aria-hidden />
        {copy.eyebrow}
        {event?.active && <span className="text-brand">· {copy.live}</span>}
      </p>
      <h1 id="live-title" className="mt-5 max-w-[56rem] text-[2.5rem] leading-[1.08] font-medium tracking-[-0.02em] md:text-[4rem]">
        {event?.name ?? copy.fallbackTitle}
      </h1>

      {!feed && !failed && (
        <p className="mt-16 flex items-center gap-3 text-base text-white/70" role="status">
          <Spinner />
          {copy.loading}
        </p>
      )}
      {failed && (
        <p className="mt-10 text-sm text-white/60" role="status">
          {copy.error}
        </p>
      )}

      {feed && !event && (
        <div className="mt-10 max-w-[32rem]">
          <h2 className="text-2xl font-medium md:text-[2rem]">{copy.noEvent.title}</h2>
          <p className="mt-3 text-base leading-snug text-white/75 md:text-lg">{copy.noEvent.body}</p>
          <Link href="/mentors" className={`${buttonClasses("light")} mt-8`}>
            {copy.noEvent.cta}
          </Link>
        </div>
      )}

      {event && (latest ? <InlineResult outcome={latest} /> : <Waiting />)}

      {event && !latest && (
        <div className="mt-10 flex flex-col items-center gap-4">
          {status === "signed-in" && entered && (
            <p className="inline-flex items-center gap-2.5 border border-white/20 bg-white/5 px-4 py-2.5 text-base text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-4 text-brand" aria-hidden>
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
              {copy.entered(firstName)}
            </p>
          )}
          {status === "signed-in" && !entered && feed && <p className="max-w-[28rem] text-sm text-white/60">{copy.notEntered}</p>}
          {status === "signed-out" && event.active && (
            <>
              <p className="text-base text-white/80">{copy.join.prompt}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/signup?redirect=%2Flive" className={buttonClasses("brand")}>
                  {copy.join.cta}
                </Link>
                <Link href="/login?redirect=%2Flive" className={buttonClasses("ghost")}>
                  {copy.join.login}
                </Link>
              </div>
            </>
          )}
          {!event.active && <p className="text-sm text-white/60">{copy.ended}</p>}
        </div>
      )}
    </div>
  </section>
  );
}

// Three squares rippling out from a brand square: calm, so it can run for an hour on a projector or phone.
function Waiting() {
  return (
    <div className="mt-14 flex flex-col items-center md:mt-16">
      <div className="relative flex size-40 items-center justify-center md:size-48" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute inset-0 border border-brand/70 motion-reduce:hidden"
            style={{ animation: `live-ripple 3.6s cubic-bezier(0.22,1,0.36,1) ${i * 1.2}s infinite` }}
          />
        ))}
        <span className="relative flex size-20 items-center justify-center bg-brand md:size-24">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-9 text-white md:size-11">
            <path d="M3.5 9.5h17v4h-17zM5 13.5v7h14v-7M12 9.5v11" />
            <path d="M12 9.5c-1.5-3.5-5.5-4.5-6-2s3 2 6 2zM12 9.5c1.5-3.5 5.5-4.5 6-2s-3 2-6 2z" />
          </svg>
        </span>
      </div>
      <h2 className="mt-12 max-w-[36rem] text-[1.75rem] leading-tight font-medium md:text-[2.5rem]">{copy.waiting.title}</h2>
      <p className="mt-4 max-w-[30rem] text-base leading-snug text-white/70 md:text-lg">{copy.waiting.body}</p>
    </div>
  );
}

const outcomeText = (outcome: Outcome) =>
  outcome === "won" ? copy.result.won : outcome === "lost" ? copy.result.lost : outcome === "signedOut" ? copy.result.signedOut : copy.result.notEntered;

function InlineResult({ outcome }: { outcome: Outcome }) {
  const text = outcomeText(outcome);
  const won = outcome === "won";
  return (
    <div className="mt-14 flex max-w-[40rem] flex-col items-center md:mt-16">
      <span className={`flex size-16 items-center justify-center ${won ? "bg-brand" : "border border-white/25"}`} aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-8">
          {won ? <path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1.5a3 3 0 0 0 3 3M17 6h3v1.5a3 3 0 0 1-3 3M12 14v3M8.5 20.5h7M9.5 17h5v3.5h-5z" /> : <path d="M3.5 9.5h17v4h-17zM5 13.5v7h14v-7M12 9.5v11" />}
        </svg>
      </span>
      <h2 className={`mt-8 text-[2rem] leading-[1.1] font-medium tracking-[-0.01em] md:text-[3rem] ${won ? "text-brand" : ""}`}>{text.title}</h2>
      <p className="mt-4 text-base leading-snug text-white/75 md:text-lg">{text.body}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {outcome === "signedOut" ? (
          <Link href="/login?redirect=%2Flive" className={buttonClasses("light")}>
            {copy.result.signedOut.cta}
          </Link>
        ) : (
          <Link href="/mentors" className={buttonClasses(won ? "light" : "brand")}>
            {copy.result.explore}
          </Link>
        )}
      </div>
    </div>
  );
}

// The ring is redrawn on every animation frame (written straight to the SVG, no re-render), so it sweeps smoothly;
// the number only changes once a second.
const RING = 2 * Math.PI * 46;
export function Countdown({ endsAt, total }: { endsAt: number; total: number }) {
  const ring = useRef<SVGCircleElement>(null);
  const [seconds, setSeconds] = useState(() => Math.ceil(Math.max(0, endsAt - Date.now()) / 1000));

  useEffect(() => {
    let frame = 0;
    const draw = () => {
      const remaining = Math.max(0, endsAt - Date.now());
      const progress = total > 0 ? remaining / total : 0;
      ring.current?.setAttribute("stroke-dashoffset", String(RING * (1 - progress)));
      setSeconds(Math.ceil(remaining / 1000));
      if (remaining > 0) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [endsAt, total]);

  return (
    <div className="fixed inset-0 z-[100] flex animate-[auth-backdrop-in_300ms_ease-out] flex-col items-center justify-center bg-ink px-4 text-center text-white" role="alertdialog" aria-modal="true" aria-labelledby="countdown-label">
      <p id="countdown-label" className="flex items-center gap-3 text-lg tracking-[0.12em] text-white/80 uppercase md:text-xl">
        <span className="size-2.5 bg-brand" aria-hidden />
        {copy.countdown.label}
      </p>
      <div className="relative mt-10 size-[min(72vw,22rem)]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <circle ref={ring} cx="50" cy="50" r="46" fill="none" stroke="var(--color-brand)" strokeWidth="2.5" strokeLinecap="butt" strokeDasharray={RING} strokeDashoffset={0} />
        </svg>
        <p
          key={seconds}
          className="absolute inset-0 flex animate-[live-tick_450ms_cubic-bezier(0.22,1,0.36,1)] items-center justify-center text-[clamp(6rem,30vw,12rem)] leading-none font-medium tabular-nums motion-reduce:animate-none"
          aria-live="assertive"
        >
          {seconds}
        </p>
      </div>
      <p className="mt-10 text-xl text-white/75 md:text-2xl">{copy.countdown.sub}</p>
    </div>
  );
}

export function ResultOverlay({ outcome, onClose }: { outcome: Outcome | null; onClose: () => void }) {
  const won = outcome === "won";
  const text = outcome ? outcomeText(outcome) : null;
  return (
    <div
      className={`fixed inset-0 z-[100] flex animate-[auth-backdrop-in_400ms_ease-out] flex-col items-center justify-center overflow-hidden px-5 text-center text-white ${won ? "bg-brand" : "bg-ink"}`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="result-title"
    >
      {won && <Confetti />}
      {!text ? (
        <p id="result-title" className="flex items-center gap-3 text-xl text-white/90" role="status">
          <Spinner />
          {copy.result.checking}
        </p>
      ) : (
        <div className="relative z-10 max-w-[48rem] animate-[auth-card-in_600ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none">
          <p className={`text-sm tracking-[0.2em] uppercase ${won ? "text-white/85" : "text-white/60"}`}>{copy.eyebrow}</p>
          <h2 id="result-title" className="mt-5 text-[2.75rem] leading-[1.02] font-medium tracking-[-0.02em] md:text-[5rem]">
            {text.title}
          </h2>
          <p className="mx-auto mt-6 max-w-[34rem] text-lg leading-snug text-white/90 md:text-xl">{text.body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {outcome === "signedOut" && (
              <Link href="/login?redirect=%2Flive" className={buttonClasses("light")}>
                {copy.result.signedOut.cta}
              </Link>
            )}
            {outcome === "lost" && (
              <Link href="/mentors" className={buttonClasses("brand")}>
                {copy.result.explore}
              </Link>
            )}
            <button type="button" onClick={onClose} className={buttonClasses(won ? "light" : "ghost")}>
              {copy.result.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Square confetti in the site's colours (falls once; hidden for reduced motion).
const CONFETTI_COLOURS = ["#ffffff", "#2b2b2b", "#ffd7c6", "#b6370a", "#f6b399"];
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => {
        const r = (n: number) => {
          const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
          return x - Math.floor(x);
        };
        return {
          left: `${r(1) * 100}%`,
          size: `${0.4 + r(2) * 0.6}rem`,
          delay: `${r(3) * 1.6}s`,
          duration: `${3.2 + r(4) * 2.6}s`,
          drift: `${(r(5) - 0.5) * 30}vw`,
          spin: `${360 + r(6) * 720}deg`,
          colour: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
        };
      }),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 motion-reduce:hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute -top-4"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.colour,
              animation: `live-confetti ${p.duration} cubic-bezier(0.3,0.6,0.5,1) ${p.delay} both`,
              "--drift": p.drift,
              "--spin": p.spin,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
