"use client";

import { useEffect, useState } from "react";
import { Countdown, LiveBoard, LiveStage, ResultOverlay } from "@/components/event/LiveBoard";
import type { Outcome } from "@/components/event/LiveBoard";
import { livePreviewCopy as copy } from "@/data/event";
import type { LiveFeed } from "@/lib/event/service";

// /live?preview=<state>: every screen attendees can see, with made-up data and nothing sent to the server, for
// checking the design before an event. Only where previews are allowed (local development, or a test deployment
// with NEXT_PUBLIC_EVENT_PREVIEW=1) so nobody can show a fake "you won" screen on the real site.
const PREVIEW_ALLOWED = process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_EVENT_PREVIEW === "1";
const COUNTDOWN_MS = 12_000;

type State = (typeof copy.states)[number][0];
const isState = (value: string | null): value is State => copy.states.some(([state]) => state === value);

const feedFor = (state: State): LiveFeed =>
  state === "no-event" ? { event: null, draw: null } : { event: { id: "preview", name: copy.eventName, active: state !== "ended" }, draw: null };

const outcomeFor = (state: State): Outcome | null =>
  state === "won" ? "won" : state === "lost" ? "lost" : state === "not-entered" ? "notEntered" : state === "signed-out-result" ? "signedOut" : null;

export function LiveRoute() {
  const [state, setState] = useState<State | null>(null);
  useEffect(() => {
    if (!PREVIEW_ALLOWED) return;
    const requested = new URLSearchParams(window.location.search).get("preview");
    queueMicrotask(() => setState(isState(requested) ? requested : null));
  }, []);
  // Switching keeps the page; the address bar follows so a state can be reloaded or shared with the team.
  const choose = (next: State | null) => {
    window.history.replaceState(null, "", next ? `/live?preview=${next}` : "/live");
    setState(next);
  };
  return state ? <LivePreview key={state} state={state} onChoose={choose} /> : <LiveBoard />;
}

function LivePreview({ state, onChoose }: { state: State; onChoose: (next: State | null) => void }) {
  const outcome = outcomeFor(state);
  const [overlayOpen, setOverlayOpen] = useState(Boolean(outcome));
  const [countdownEnds, setCountdownEnds] = useState(0);

  // The countdown loops so it can be watched as long as needed.
  useEffect(() => {
    if (state !== "countdown") return;
    const start = () => {
      const t = Date.now();
      setCountdownEnds(t + COUNTDOWN_MS);
    };
    start();
    const timer = setInterval(() => {
      const t = Date.now();
      setCountdownEnds((ends) => (t >= ends + 1500 ? t + COUNTDOWN_MS : ends));
    }, 100);
    return () => clearInterval(timer);
  }, [state]);

  const signedIn = state !== "waiting" && state !== "signed-out-result" && state !== "no-event";
  return (
    <>
      <LiveStage
        feed={feedFor(state)}
        failed={false}
        status={signedIn ? "signed-in" : "signed-out"}
        entered={state !== "not-entered"}
        firstName={copy.firstName}
        latest={overlayOpen ? null : outcome}
      />
      {state === "countdown" && countdownEnds > 0 && <Countdown key={countdownEnds} endsAt={countdownEnds} total={COUNTDOWN_MS} />}
      {outcome && overlayOpen && <ResultOverlay outcome={outcome} onClose={() => setOverlayOpen(false)} />}

      <nav aria-label={copy.label} className="fixed inset-x-0 bottom-0 z-[120] border-t border-white/15 bg-black/85 px-3 py-2.5 text-white backdrop-blur">
        <div className="no-scrollbar mx-auto flex max-w-[83.75rem] items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <span className="mr-2 shrink-0 text-xs tracking-[0.12em] text-white/60 uppercase">{copy.label}</span>
          {copy.states.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onChoose(value)}
              aria-current={value === state ? "page" : undefined}
              className={`shrink-0 px-2.5 py-1 text-xs ${value === state ? "bg-brand text-white" : "border border-white/20 text-white/85 hover:bg-white/10"}`}
            >
              {label}
            </button>
          ))}
          <button type="button" onClick={() => onChoose(null)} className="ml-auto shrink-0 px-2.5 py-1 text-xs text-white/60 underline-offset-4 hover:underline">
            {copy.exit}
          </button>
        </div>
      </nav>
    </>
  );
}
