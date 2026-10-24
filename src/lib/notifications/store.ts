"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useAuth } from "@/lib/auth/AuthProvider";
import { browserSupabase } from "@/lib/supabase/browser";

// The signed-in user's notifications (the platform's `notifications` table: their own rows, which they may mark
// read or delete, like the platform's NotificationBell). One shared store, so the header's desktop and mobile
// bells make one request and one realtime subscription between them. New rows arrive over realtime, with a
// refresh every minute and whenever the tab comes back into view as a fallback.

export type AppNotification = { id: string; title: string; message: string; type: string; read: boolean; createdAt: string };

type State = { userId: string | null; status: "idle" | "loading" | "ready" | "error"; items: AppNotification[] };
type Row = { id: string; title: string | null; message: string | null; type: string | null; read: boolean | null; created_at: string };

const REFRESH_MS = 60_000;
const LIMIT = 50;

let state: State = { userId: null, status: "idle", items: [] };
const listeners = new Set<() => void>();
let users = 0;
let channel: RealtimeChannel | null = null;
let timer: ReturnType<typeof setInterval> | undefined;

const db = () => browserSupabase();
const set = (next: Partial<State>) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

async function load() {
  const userId = state.userId;
  if (!userId) return;
  const { data, error } = await db().from("notifications").select("id, title, message, type, read, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(LIMIT);
  if (userId !== state.userId) return;
  if (error) {
    set({ status: state.items.length ? "ready" : "error" });
    return;
  }
  set({
    status: "ready",
    items: ((data ?? []) as Row[]).map((row) => ({ id: row.id, title: row.title ?? "", message: row.message ?? "", type: row.type ?? "", read: Boolean(row.read), createdAt: row.created_at })),
  });
}

const onVisible = () => {
  if (document.visibilityState === "visible") void load();
};

function teardown() {
  if (channel) void db().removeChannel(channel);
  channel = null;
  clearInterval(timer);
  document.removeEventListener("visibilitychange", onVisible);
}

function start(userId: string) {
  users += 1;
  if (state.userId === userId) return;
  teardown();
  set({ userId, status: "loading", items: [] });
  void load();
  channel = db()
    .channel(`notifications:${userId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, () => void load())
    .subscribe();
  timer = setInterval(() => void load(), REFRESH_MS);
  document.addEventListener("visibilitychange", onVisible);
}

function release() {
  users = Math.max(0, users - 1);
  if (users > 0) return;
  teardown();
  set({ userId: null, status: "idle", items: [] });
}

// Optimistic changes; a failed write reloads the real state.
const patch = (change: (items: AppNotification[]) => AppNotification[]) => set({ items: change(state.items) });
const settle = async (request: PromiseLike<{ error: unknown }>) => {
  const { error } = await request;
  if (error) void load();
};

export const notificationActions = {
  markRead(id: string) {
    if (!state.items.some((item) => item.id === id && !item.read)) return;
    patch((items) => items.map((item) => (item.id === id ? { ...item, read: true } : item)));
    void settle(db().from("notifications").update({ read: true }).eq("id", id));
  },
  markAllRead() {
    if (!state.userId || !state.items.some((item) => !item.read)) return;
    patch((items) => items.map((item) => ({ ...item, read: true })));
    void settle(db().from("notifications").update({ read: true }).eq("user_id", state.userId).eq("read", false));
  },
  remove(id: string) {
    patch((items) => items.filter((item) => item.id !== id));
    void settle(db().from("notifications").delete().eq("id", id));
  },
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const SERVER_STATE: State = { userId: null, status: "idle", items: [] };

export function useNotifications() {
  const { status, user } = useAuth();
  const userId = status === "signed-in" ? (user?.id ?? null) : null;
  useEffect(() => {
    if (!userId) return;
    start(userId);
    return release;
  }, [userId]);
  const snapshot = useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
  const mine = snapshot.userId === userId ? snapshot : SERVER_STATE;
  return { ...mine, unread: mine.items.filter((item) => !item.read).length };
}
