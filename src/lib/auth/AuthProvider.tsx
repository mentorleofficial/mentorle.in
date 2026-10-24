"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authService } from "@/lib/auth/service";
import type { AuthUser, MenteeProfile } from "@/lib/auth/types";

type AuthState = {
  // "loading" until the browser has read the session (the server always renders signed out).
  status: "loading" | "signed-out" | "signed-in";
  user: AuthUser | null;
  profile: MenteeProfile | null;
  onboarded: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState["status"]>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<MenteeProfile | null>(null);

  const refresh = useCallback(async () => {
    const session = await authService.getSession().catch(() => null);
    if (!session) {
      setUser(null);
      setProfile(null);
      setStatus("signed-out");
      return;
    }
    // mentorle.in is for mentees. A mentor or admin session (the login step already sends them to the
    // platform) is ended here, so they're never treated as a mentee who hasn't onboarded.
    if (session.user.role !== "mentee") {
      await authService.signOut();
      return;
    }
    const nextProfile = await authService.fetchMenteeProfile(session.user.id).catch(() => null);
    setUser(session.user);
    setProfile(nextProfile);
    setStatus("signed-in");
  }, []);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(() => void refresh());
    // Deferred so the first client render matches the server's signed-out HTML.
    const id = requestAnimationFrame(() => void refresh());
    return () => {
      cancelAnimationFrame(id);
      unsubscribe();
    };
  }, [refresh]);

  const signOut = useCallback(() => authService.signOut(), []);

  const value = useMemo(
    () => ({ status, user, profile, onboarded: Boolean(profile?.onboarded_at), refresh, signOut }),
    [status, user, profile, refresh, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

