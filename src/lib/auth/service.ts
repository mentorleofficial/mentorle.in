"use client";

import { AuthError } from "@/lib/auth/types";
import type { MenteeProfile, MenteeProfileUpdate, OtpType, Session, SignUpInput } from "@/lib/auth/types";

/*
 * MOCK auth + mentee-profile service. Frontend only, for now.
 *
 * Every function mirrors a call the Mentorle platform makes against Supabase (../Mentorle-Version2):
 *   checkEmailExists      → supabase.rpc("check_email_exists")
 *   signUp                → supabase.auth.signUp({ options: { data: { full_name, role: "mentee" } } })
 *   verifyOtp             → supabase.auth.verifyOtp({ email, token, type: "signup" | "recovery" })
 *   resend                → supabase.auth.resend({ type: "signup", email })
 *   signInWithPassword    → supabase.auth.signInWithPassword
 *   resetPasswordForEmail → supabase.auth.resetPasswordForEmail
 *   updatePassword        → supabase.auth.updateUser({ password })
 *   fetch/upsertMenteeProfile, uploadAvatar → features/mentee-onboarding/api.ts
 * Connecting the real database means reimplementing this file with the same signatures.
 *
 * Data lives in this browser's localStorage. No email is sent: any pending code accepts MOCK_OTP.
 */

export const AUTH_IS_MOCK = true;
export const MOCK_OTP = "12345678";

const STORAGE_KEY = "mentorle.mock-auth.v1";
const LATENCY_MS = 600;

type StoredUser = Omit<SignUpInput, "password"> & {
  id: string;
  password_hash: string;
  avatar_url: string | null;
  email_confirmed_at: string | null;
};

type Store = {
  users: Record<string, StoredUser>; // keyed by lower-case email
  profiles: Record<string, MenteeProfile>; // keyed by user id
  sessionUserId: string | null;
  pendingOtp: Record<string, OtpType>; // email → which flow is waiting for a code
};

const emptyStore = (): Store => ({ users: {}, profiles: {}, sessionUserId: null, pendingOtp: {} });

const read = (): Store => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...emptyStore(), ...JSON.parse(raw) } : emptyStore();
  } catch {
    return emptyStore();
  }
};

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

const write = (store: Store) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    throw new AuthError("unknown");
  }
};

const delay = () => new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
const key = (email: string) => email.trim().toLowerCase();

const hash = async (password: string) => {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`mentorle-mock:${password}`));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
};

const sessionFor = (user: StoredUser): Session => ({
  user: { id: user.id, email: user.email, full_name: user.full_name, role: "mentee", avatar_url: user.avatar_url },
});

const userById = (store: Store, id: string | null) => Object.values(store.users).find((user) => user.id === id) ?? null;

const blankProfile = (user: StoredUser): MenteeProfile => ({
  user_id: user.id,
  full_name: user.full_name,
  email: user.email,
  avatar_url: user.avatar_url,
  phone: user.phone,
  headline: "",
  bio: "",
  organization_unit: "",
  goals: "",
  academic_details: "",
  interests: [],
  preferred_mentor_areas: [],
  linkedin_url: "",
  github_url: "",
  portfolio_url: "",
  onboarded_at: null,
});

export const authService = {
  getSession(): Session | null {
    const store = read();
    const user = userById(store, store.sessionUserId);
    return user ? sessionFor(user) : null;
  },

  // Fires on sign in/out and profile changes, in this tab and others.
  onAuthStateChange(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => event.key === STORAGE_KEY && listener();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  async checkEmailExists(email: string) {
    await delay();
    return Boolean(read().users[key(email)]?.email_confirmed_at);
  },

  async signUp(input: SignUpInput) {
    await delay();
    const store = read();
    const existing = store.users[key(input.email)];
    if (existing?.email_confirmed_at) throw new AuthError("email_taken");
    const { password, ...rest } = input;
    store.users[key(input.email)] = {
      ...rest,
      email: input.email.trim(),
      id: existing?.id ?? crypto.randomUUID(),
      password_hash: await hash(password),
      avatar_url: null,
      email_confirmed_at: null,
    };
    store.pendingOtp[key(input.email)] = "signup";
    write(store);
  },

  async resend(email: string, type: OtpType = "signup") {
    await delay();
    const store = read();
    if (store.users[key(email)]) {
      store.pendingOtp[key(email)] = type;
      write(store);
    }
  },

  async verifyOtp({ email, token, type }: { email: string; token: string; type: OtpType }): Promise<Session> {
    await delay();
    const store = read();
    const user = store.users[key(email)];
    if (!user || store.pendingOtp[key(email)] !== type || token !== MOCK_OTP) throw new AuthError("otp_invalid");
    delete store.pendingOtp[key(email)];
    user.email_confirmed_at ??= new Date().toISOString();
    store.profiles[user.id] ??= blankProfile(user);
    store.sessionUserId = user.id;
    write(store);
    notify();
    return sessionFor(user);
  },

  async signInWithPassword({ email, password }: { email: string; password: string }): Promise<Session> {
    await delay();
    const store = read();
    const user = store.users[key(email)];
    if (!user || user.password_hash !== (await hash(password))) throw new AuthError("invalid_credentials");
    if (!user.email_confirmed_at) {
      store.pendingOtp[key(email)] = "signup";
      write(store);
      throw new AuthError("email_not_confirmed");
    }
    store.sessionUserId = user.id;
    write(store);
    notify();
    return sessionFor(user);
  },

  // Never reveals whether the account exists (unlike the platform, which says "Account not found").
  async resetPasswordForEmail(email: string) {
    await delay();
    const store = read();
    if (store.users[key(email)]?.email_confirmed_at) {
      store.pendingOtp[key(email)] = "recovery";
      write(store);
    }
  },

  async updatePassword(password: string) {
    await delay();
    const store = read();
    const user = userById(store, store.sessionUserId);
    if (!user) throw new AuthError("not_signed_in");
    user.password_hash = await hash(password);
    write(store);
  },

  async signOut() {
    const store = read();
    store.sessionUserId = null;
    write(store);
    notify();
  },

  async fetchMenteeProfile(userId: string): Promise<MenteeProfile> {
    const store = read();
    const user = userById(store, userId);
    if (!user) throw new AuthError("not_signed_in");
    return { ...blankProfile(user), ...store.profiles[userId], full_name: user.full_name, avatar_url: user.avatar_url };
  },

  async upsertMenteeProfile(userId: string, update: MenteeProfileUpdate, options: { markOnboarded?: boolean } = {}) {
    await delay();
    const store = read();
    const user = userById(store, userId);
    if (!user) throw new AuthError("not_signed_in");
    // Like the platform, full_name and avatar_url live on the users row.
    if (update.full_name !== undefined) user.full_name = update.full_name;
    if (update.avatar_url !== undefined) user.avatar_url = update.avatar_url;
    const current = store.profiles[userId] ?? blankProfile(user);
    store.profiles[userId] = {
      ...current,
      ...update,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      onboarded_at: options.markOnboarded ? new Date().toISOString() : current.onboarded_at,
    };
    write(store);
    notify();
  },

  // The platform uploads to Supabase storage; the mock stores a downscaled data URL.
  async uploadAvatar(file: File): Promise<string> {
    const bitmap = await createImageBitmap(file);
    const size = 256;
    const scale = Math.max(size / bitmap.width, size / bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new AuthError("unknown");
    const width = bitmap.width * scale;
    const height = bitmap.height * scale;
    context.drawImage(bitmap, (size - width) / 2, (size - height) / 2, width, height);
    bitmap.close();
    return canvas.toDataURL("image/webp", 0.85);
  },
};
