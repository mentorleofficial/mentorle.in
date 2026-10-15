"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { prefetchFor } from "@/lib/routes";
import { authService } from "@/lib/auth/service";

type AuthModalState = {
  titleId: string;
  // True when opened over another page (intercepted route); false on a direct visit to /login etc.
  intercepted: boolean;
  close: () => void;
  // Navigate on from the modal: a soft replace while intercepted (another modal route stays a modal over the
  // same page), a full load on the standalone pages (so a modal isn't intercepted on top of this one).
  go: (href: string) => void;
  // Call once a session exists: un-onboarded mentees continue to /onboarding (like the platform's
  // MenteeOnboardingGuard), otherwise to ?redirect= or back to the page underneath.
  finish: (userId: string) => Promise<void>;
};

const AuthModalContext = createContext<AuthModalState | null>(null);

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error("useAuthModal must be used inside <AuthModal>");
  return context;
}

export const safeRedirect = () => {
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  return redirect?.startsWith("/") && !redirect.startsWith("//") ? redirect : null;
};

const withRedirect = (href: string) => {
  const redirect = safeRedirect();
  if (!redirect || href.includes("?") || redirect === href) return href;
  return `${href}?redirect=${encodeURIComponent(redirect)}`;
};

export function AuthModalProvider({ titleId, intercepted, children }: { titleId: string; intercepted: boolean; children: ReactNode }) {
  const router = useRouter();

  const close = () => {
    if (intercepted) router.back();
    else router.replace("/");
  };

  const go = (href: string) => {
    if (intercepted) router.replace(href);
    else window.location.assign(href);
  };

  const finish = async (userId: string) => {
    const profile = await authService.fetchMenteeProfile(userId).catch(() => null);
    const redirect = safeRedirect();
    if (!profile?.onboarded_at) go(withRedirect("/onboarding"));
    else if (redirect) router.replace(redirect);
    else close();
  };

  return <AuthModalContext.Provider value={{ titleId, intercepted, close, go, finish }}>{children}</AuthModalContext.Provider>;
}

// Links between the modal screens (login ⇄ signup, forgot password). Same navigation rules as `go`; any
// ?redirect= is carried along (read at click time).
export function AuthLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const { go } = useAuthModal();
  const classes = className ?? "font-semibold text-ink underline-offset-4 hover:underline focus-visible:underline";
  return (
    <Link
      href={href}
      prefetch={prefetchFor(href.split("?")[0])}
      className={classes}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        go(withRedirect(href));
      }}
    >
      {children}
    </Link>
  );
}
