"use client";

/*
 * MOCK event registration service. Frontend only, for now.
 *
 * Mirrors the Mentorle platform's mentee registration (../Mentorle-Version2/src/features/mentor-events/api/events.ts):
 *   registerForEvent      → capacity check on events_programs, then insert into event_participants
 *   unregisterFromEvent   → delete from event_participants
 *   isRegistered          → select from event_participants by event + user
 * The platform also has Plus-quota and paid (Cashfree) registration; only the free RSVP is mocked here.
 * Data lives in this browser's localStorage, next to the mock auth store.
 */

const STORAGE_KEY = "mentorle.mock-events.v1";
const LATENCY_MS = 500;

// event slug → user id → registered_at
type Store = Record<string, Record<string, string>>;

const read = (): Store => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Store;
  } catch {
    return {};
  }
};

const write = (store: Store) => window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
const delay = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

export class EventFullError extends Error {}

export const eventsService = {
  isRegistered(eventSlug: string, userId: string) {
    return Boolean(read()[eventSlug]?.[userId]);
  },

  async registerForEvent(eventSlug: string, userId: string, maxParticipants?: number) {
    await delay();
    const store = read();
    const participants = store[eventSlug] ?? {};
    if (participants[userId]) return;
    if (maxParticipants && Object.keys(participants).length >= maxParticipants) throw new EventFullError();
    store[eventSlug] = { ...participants, [userId]: new Date().toISOString() };
    write(store);
  },

  async unregisterFromEvent(eventSlug: string, userId: string) {
    await delay();
    const store = read();
    if (store[eventSlug]) {
      delete store[eventSlug][userId];
      write(store);
    }
  },
};
