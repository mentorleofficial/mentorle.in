"use client";

import { browserSupabase, recoverySupabase } from "@/lib/supabase/browser";
import { AuthError } from "@/lib/auth/types";
import type { AppRole, AuthErrorCode, AuthUser, MenteeProfile, MenteeProfileUpdate, OtpType, Session, SignUpInput } from "@/lib/auth/types";

/*
 * Auth + mentee-profile service on the platform's Supabase project. Each call matches what the platform's own
 * mentee screens do (../Mentorle-Version2), so accounts work on both sites:
 *   checkEmailExists      → rpc("check_email_exists")                       (MenteeSignupForm)
 *   signUp                → auth.signUp, role "mentee" in user metadata     (handle_new_user creates users row)
 *   verifyOtp             → auth.verifyOtp(type "signup" | "recovery"); after signup, the phone, date of birth and
 *                           marketing consent go to mentee_profiles
 *   signInWithPassword, resetPasswordForEmail, updatePassword (auth.updateUser), signOut
 *   fetch/upsertMenteeProfile, uploadAvatar → features/mentee-onboarding/api.ts (users + mentee_profiles,
 *                           avatars in branding-assets/avatars/<user id>/)
 * Emails carry an 8-digit code (production templates use {{ .Token }}).
 */

const db = () => browserSupabase();

// Profile edits made here don't fire Supabase auth events, so the provider listens to these too.
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

const fail = (code: AuthErrorCode, cause?: unknown): never => {
  if (cause) console.error(`[auth] ${code}`, cause);
  throw new AuthError(code);
};

type SupabaseAuthError = { code?: string; message?: string; status?: number } | null;
const codeOf = (error: SupabaseAuthError) => `${error?.code ?? ""} ${error?.message ?? ""}`.toLowerCase();

async function loadUser(id: string, email: string): Promise<AuthUser> {
  const { data, error } = await db().from("users").select("full_name, avatar_url, role").eq("id", id).maybeSingle();
  if (error) fail("unknown", error);
  return {
    id,
    email: email,
    full_name: data?.full_name ?? "",
    role: (data?.role as AppRole | undefined) ?? "mentee",
    avatar_url: data?.avatar_url ?? null,
  };
}

const blankProfile = (user: { id: string; email: string; full_name: string; avatar_url: string | null }): MenteeProfile => ({
  user_id: user.id,
  full_name: user.full_name,
  email: user.email,
  avatar_url: user.avatar_url,
  phone: null,
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

// 256px square WebP, centre-cropped, so avatars stay small.
async function squareWebp(file: File, size = 256): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.max(size / bitmap.width, size / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) fail("unknown");
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;
  context!.drawImage(bitmap, (size - width) / 2, (size - height) / 2, width, height);
  bitmap.close();
  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new AuthError("unknown"))), "image/webp", 0.85));
}

export const authService = {
  async getSession(): Promise<Session | null> {
    const { data } = await db().auth.getSession();
    const authUser = data.session?.user;
    if (!authUser) return null;
    return { user: await loadUser(authUser.id, authUser.email ?? "") };
  },

  // Fires on sign in/out (in this tab and others) and on profile changes made through this service.
  onAuthStateChange(listener: () => void) {
    listeners.add(listener);
    // Supabase warns against calling it from inside its own callback, so the listener runs on the next tick.
    const { data } = db().auth.onAuthStateChange((event) => {
      if (event !== "INITIAL_SESSION") setTimeout(listener, 0);
    });
    return () => {
      listeners.delete(listener);
      data.subscription.unsubscribe();
    };
  },

  async checkEmailExists(email: string) {
    const { data, error } = await db().rpc("check_email_exists", { email_to_check: email.trim() });
    if (error) fail("unknown", error);
    return Boolean(data);
  },

  async signUp(input: SignUpInput) {
    const { error } = await db().auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        // role: only "mentee"/"mentor" are honoured from here (handle_new_user); the rest is kept on the auth
        // user so it survives until the code is verified, possibly in another tab.
        data: {
          full_name: input.full_name,
          role: "mentee",
          phone: input.phone,
          date_of_birth: input.date_of_birth,
          terms_accepted_at: input.terms_accepted_at,
          marketing_opt_in: input.marketing_opt_in,
        },
      },
    });
    if (!error) return;
    const code = codeOf(error);
    if (code.includes("already") || code.includes("exists") || code.includes("registered")) fail("email_taken");
    if (code.includes("weak_password") || code.includes("password")) fail("weak_password", error);
    fail("unknown", error);
  },

  async resend(email: string, type: OtpType = "signup") {
    if (type === "recovery") return authService.resetPasswordForEmail(email);
    const { error } = await db().auth.resend({ type: "signup", email: email.trim() });
    if (error) fail(codeOf(error).includes("rate") ? "rate_limited" : "unknown", error);
  },

  async verifyOtp({ email, token, type }: { email: string; token: string; type: OtpType }): Promise<Session> {
    const { data, error } = await db().auth.verifyOtp({ email: email.trim(), token: token.trim(), type });
    if (error || !data.user) return fail("otp_invalid", error);
    const authUser = data.user;
    if (type === "signup") {
      // Same as the platform's MenteeSignupForm: the signup details go to the new mentee profile.
      const meta = authUser.user_metadata ?? {};
      const { error: profileError } = await db()
        .from("mentee_profiles")
        .upsert(
          {
            user_id: authUser.id,
            phone: (meta.phone as string | undefined) ?? "",
            date_of_birth: (meta.date_of_birth as string | undefined) || null,
            marketing_opt_in: Boolean(meta.marketing_opt_in),
          },
          { onConflict: "user_id" },
        );
      // Not fatal: onboarding asks for these again.
      if (profileError) console.error("[auth] mentee_profiles upsert after signup failed", profileError);
    }
    notify();
    return { user: await loadUser(authUser.id, authUser.email ?? email) };
  },

  async signInWithPassword({ email, password }: { email: string; password: string }): Promise<Session> {
    const { data, error } = await db().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      const code = codeOf(error);
      if (code.includes("email_not_confirmed") || code.includes("not confirmed")) {
        // Send a fresh code so the verify step that follows has one to check.
        await db().auth.resend({ type: "signup", email: email.trim() });
        fail("email_not_confirmed");
      }
      if (code.includes("invalid")) fail("invalid_credentials");
      fail(code.includes("rate") ? "rate_limited" : "unknown", error);
    }
    return { user: await loadUser(data.user!.id, data.user!.email ?? email) };
  },

  // Never reveals whether the account exists. The email has the 8-digit code and a button to /reset-password on
  // this site (the platform sends its own users to its own page; both are on Supabase's redirect list).
  async resetPasswordForEmail(email: string) {
    const { error } = await recoverySupabase().auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    if (error && codeOf(error).includes("rate")) fail("rate_limited", error);
    if (error) console.error("[auth] resetPasswordForEmail", error);
  },

  async updatePassword(password: string) {
    const { error } = await db().auth.updateUser({ password });
    if (!error) return;
    const code = codeOf(error);
    if (code.includes("same_password") || code.includes("different from the old")) fail("same_password");
    if (code.includes("weak_password")) fail("weak_password", error);
    fail(code.includes("session") ? "not_signed_in" : "unknown", error);
  },

  async signOut() {
    await db().auth.signOut();
    notify();
  },

  async fetchMenteeProfile(userId: string): Promise<MenteeProfile> {
    const [{ data: user, error: userError }, { data: profile, error: profileError }] = await Promise.all([
      db().from("users").select("full_name, email, avatar_url").eq("id", userId).maybeSingle(),
      db().from("mentee_profiles").select("*").eq("user_id", userId).maybeSingle(),
    ]);
    if (userError || profileError || !user) return fail("not_signed_in", userError ?? profileError);
    const base = blankProfile({ id: userId, email: user.email ?? "", full_name: user.full_name ?? "", avatar_url: user.avatar_url ?? null });
    if (!profile) return base;
    return {
      ...base,
      phone: profile.phone ?? null,
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      organization_unit: profile.organization_unit ?? "",
      goals: profile.goals ?? "",
      academic_details: profile.academic_details ?? "",
      interests: profile.interests ?? [],
      preferred_mentor_areas: profile.preferred_mentor_areas ?? [],
      linkedin_url: profile.linkedin_url ?? "",
      github_url: profile.github_url ?? "",
      portfolio_url: profile.portfolio_url ?? "",
      onboarded_at: profile.onboarded_at ?? null,
    };
  },

  async upsertMenteeProfile(userId: string, update: MenteeProfileUpdate, options: { markOnboarded?: boolean } = {}) {
    // Like the platform, full_name and avatar_url live on the users row; the rest on mentee_profiles.
    const { full_name, avatar_url, ...profile } = update;
    if (full_name !== undefined || avatar_url !== undefined) {
      const { error } = await db()
        .from("users")
        .update({ ...(full_name !== undefined && { full_name }), ...(avatar_url !== undefined && { avatar_url }) })
        .eq("id", userId);
      if (error) fail("unknown", error);
    }
    const payload: Record<string, unknown> = { user_id: userId, ...profile };
    if (options.markOnboarded) payload.onboarded_at = new Date().toISOString();
    const { error } = await db().from("mentee_profiles").upsert(payload, { onConflict: "user_id" });
    if (error) fail("unknown", error);
    notify();
  },

  // Uploads to the platform's avatar folder for this user and returns the public URL.
  async uploadAvatar(file: File): Promise<string> {
    const { data } = await db().auth.getSession();
    const userId = data.session?.user.id;
    if (!userId) return fail("not_signed_in");
    const path = `avatars/${userId}/${Date.now()}.webp`;
    const { error } = await db().storage.from("branding-assets").upload(path, await squareWebp(file), { contentType: "image/webp", upsert: true });
    if (error) fail("unknown", error);
    return db().storage.from("branding-assets").getPublicUrl(path).data.publicUrl;
  },
};
