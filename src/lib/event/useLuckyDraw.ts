"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { eventService } from "@/lib/event/service";

const REFRESH_MS = 2 * 60_000;

// True while event mode is on and the signed-in viewer is in its lucky draw (they joined during the event), so the
// header can show them a link to /live. Everyone else never sees it. One small check when they sign in, then every
// couple of minutes and when the tab comes back; nothing for signed-out visitors.
export function useLuckyDraw() {
  const { status, user } = useAuth();
  const [inDraw, setInDraw] = useState(false);
  const userId = status === "signed-in" ? user?.id : undefined;

  useEffect(() => {
    if (!userId) {
      queueMicrotask(() => setInDraw(false));
      return;
    }
    let live = true;
    const check = async () => {
      try {
        const feed = await eventService.liveFeed();
        if (live) setInDraw(Boolean(feed.event?.active && feed.me?.entered));
      } catch {
        // keep the last answer
      }
    };
    void check();
    const timer = setInterval(() => void check(), REFRESH_MS);
    const onVisible = () => {
      if (!document.hidden) void check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      live = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [userId]);

  return inDraw;
}
