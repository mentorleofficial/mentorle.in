"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AuthModalProvider, useAuthModal, withRedirect } from "@/components/auth/AuthModalContext";
import { ForgotPasswordFlow } from "@/components/auth/ForgotPasswordFlow";
import { LoginFlow } from "@/components/auth/LoginFlow";
import { ResetLinkFlow } from "@/components/auth/ResetLinkFlow";
import { SignupFlow } from "@/components/auth/SignupFlow";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { authCopy } from "@/data/auth";
import type { AuthMode } from "@/data/auth";
import { useAuth } from "@/lib/auth/AuthProvider";

type AuthModalProps = {
  mode: AuthMode;
  // True when opened over another page via an intercepted route; false on a direct visit.
  intercepted: boolean;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const flows = { login: LoginFlow, signup: SignupFlow, forgot: ForgotPasswordFlow, reset: ResetLinkFlow, onboarding: OnboardingFlow } satisfies Record<AuthMode, () => React.ReactNode>;

export function AuthModal({ mode, intercepted }: AuthModalProps) {
  const titleId = useId();
  return (
    <AuthModalProvider titleId={titleId} intercepted={intercepted}>
      <AuthDialog mode={mode} />
    </AuthModalProvider>
  );
}

// Decides whether the dialog shows at all. Login, signup and forgot-password are for signed-out visitors: when
// someone who's already signed in lands on one (an event's "Register" button links to /signup, a stale /login
// link…), nothing renders, so no form flashes, and they're sent on like the platform does: to finish onboarding,
// or back to the page they were on. Once a form in this modal has been submitted, signing in is this flow's own
// doing (signup → verify → "You're in!"), so the dialog keeps showing.
function AuthDialog({ mode }: { mode: AuthMode }) {
  const { close, go } = useAuthModal();
  const { status, onboarded } = useAuth();
  const [started, setStarted] = useState(false);
  const redirected = useRef(false);
  const checkedOnboarding = useRef(false);
  // /reset-password works for anyone holding a valid link, signed in or not.
  const isAuthForm = mode !== "onboarding" && mode !== "reset";
  const alreadySignedIn = isAuthForm && !started && status === "signed-in";

  // Reset when the modal closes (or Next hides it in an <Activity>), so a reopen is judged afresh.
  useEffect(
    () => () => {
      setStarted(false);
      redirected.current = false;
      checkedOnboarding.current = false;
    },
    [],
  );

  useEffect(() => {
    if (!alreadySignedIn || redirected.current) return;
    redirected.current = true;
    if (onboarded) close();
    else go(withRedirect("/onboarding"));
  }, [alreadySignedIn, onboarded, close, go]);

  // Onboarding opened by someone who has already finished it: nothing to do.
  useEffect(() => {
    if (mode !== "onboarding" || checkedOnboarding.current || status === "loading") return;
    checkedOnboarding.current = true;
    if (status === "signed-in" && onboarded) close();
  }, [mode, status, onboarded, close]);

  // Signed-in (or not known yet, which resolves within a frame): render nothing rather than flash the form.
  if (isAuthForm && !started && status !== "signed-out") return null;
  return <DialogShell mode={mode} onSubmitCapture={() => setStarted(true)} />;
}

function DialogShell({ mode, onSubmitCapture }: { mode: AuthMode; onSubmitCapture: () => void }) {
  const { titleId, close } = useAuthModal();
  const dialogRef = useRef<HTMLDivElement>(null);
  const Flow = flows[mode];
  // With cacheComponents, Next keeps a closed modal in a hidden <Activity> and shows the same instance when
  // the route is opened again. Effects clean up on hide, so bump a key there: the flow remounts while hidden
  // and every reopen starts fresh (no stale "Logging in…", typed passwords or half-done steps).
  const [openId, setOpenId] = useState(0);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    // Lenis runs with autoToggle, so hiding overflow on <html> also pauses smooth scrolling.
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
      setOpenId((id) => id + 1);
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex animate-[auth-backdrop-in_300ms_ease-out] overflow-y-auto overscroll-contain bg-black/45 px-4 py-6 backdrop-blur-xl sm:py-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onKeyDown={onKeyDown}
      data-lenis-prevent
    >
      {/* m-auto centres the card when it fits and lets the overlay scroll when it doesn't (tall signup on phones). */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onSubmitCapture={onSubmitCapture}
        className="relative m-auto w-full max-w-[34.4375rem] animate-[auth-card-in_400ms_cubic-bezier(0.22,1,0.36,1)] bg-white px-5 pt-12 pb-9 motion-reduce:animate-none sm:px-10 md:pt-[3.125rem] md:pb-[3.25rem]"
      >
        <button
          type="button"
          onClick={close}
          aria-label={authCopy.close}
          className="absolute top-3 right-3 flex size-10 items-center justify-center text-ink transition-transform duration-300 hover:rotate-90 focus-visible:outline-2 focus-visible:outline-brand md:top-[1.375rem] md:right-[1.375rem]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-6" aria-hidden>
            <path d="M3 3l18 18M21 3L3 21" />
          </svg>
        </button>
        <Flow key={openId} />
      </div>
    </div>
  );
}
