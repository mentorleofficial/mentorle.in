"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { FormAlert, SubmitButton } from "@/components/forms/fields";
import { OtpInput } from "@/components/forms/OtpInput";
import { OTP_LENGTH, RESEND_SECONDS, authCopy, authErrors } from "@/data/auth";
import { otpSchema } from "@/lib/auth/schema";
import { AUTH_IS_MOCK, MOCK_OTP, authService } from "@/lib/auth/service";
import { AuthError } from "@/lib/auth/types";
import type { Session } from "@/lib/auth/types";

// One screen of a flow. Remounts per step (keyed by the flow), fades in, and moves focus to the first field
// (or the first button on screens without fields) so keyboard and screen-reader users land in the new step.
export function AuthStep({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Long steps scroll inside the overlay: start each one at the top.
    ref.current?.closest("[data-lenis-prevent]")?.scrollTo({ top: 0 });
    const target = ref.current?.querySelector<HTMLElement>("input:not([type=file]), select, textarea") ?? ref.current?.querySelector<HTMLElement>("button");
    target?.focus({ preventScroll: true });
  }, []);
  return (
    <div ref={ref} className="animate-[auth-step-in_300ms_ease-out] text-center motion-reduce:animate-none">
      {children}
    </div>
  );
}

export function AuthHeading({ title, children }: { title: string; children?: ReactNode }) {
  const { titleId } = useAuthModal();
  return (
    <>
      <h1 id={titleId} className="text-[1.75rem] leading-tight font-medium text-ink md:text-[2rem]">
        {title}
      </h1>
      {children && <p className="mx-auto mt-3 max-w-[24rem] text-base leading-snug text-ink">{children}</p>}
    </>
  );
}

// Width of the form column from the Figma (330px).
export const formColumn = "mx-auto mt-8 flex w-full max-w-[20.625rem] flex-col gap-3 text-left";

export function AuthFooter({ children }: { children: ReactNode }) {
  return <p className="mt-6 text-sm text-ink">{children}</p>;
}

export function MockCodeHint() {
  if (!AUTH_IS_MOCK) return null;
  return <FormAlert tone="info">{authCopy.mockCodeHint(MOCK_OTP)}</FormAlert>;
}

export function useResendTimer(initial = RESEND_SECONDS) {
  const [seconds, setSeconds] = useState(initial);
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);
  return { seconds, restart: () => setSeconds(RESEND_SECONDS) };
}

export function ResendButton({ seconds, onResend }: { seconds: number; onResend: () => Promise<void> }) {
  const [sending, setSending] = useState(false);
  return (
    <button
      type="button"
      disabled={seconds > 0 || sending}
      onClick={async () => {
        setSending(true);
        await onResend().finally(() => setSending(false));
      }}
      className="font-semibold text-ink underline-offset-4 hover:underline focus-visible:underline disabled:cursor-default disabled:font-normal disabled:text-muted disabled:no-underline"
    >
      {seconds > 0 ? authCopy.verify.resendIn(seconds) : authCopy.verify.resend}
    </button>
  );
}

const copy = authCopy.verify;

// "Verify your email" (8-digit signup code). Used after signup and when an unverified account tries to log in.
export function VerifyEmailStep({ email, onVerified, onEdit }: { email: string; onVerified: (session: Session) => void; onEdit: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [verifying, setVerifying] = useState(false);
  const timer = useResendTimer();
  const inputRef = useRef<HTMLInputElement>(null);

  const verify = async (token = code) => {
    const check = otpSchema.safeParse(token);
    if (!check.success) {
      setError(authErrors.otp);
      inputRef.current?.focus();
      return;
    }
    setVerifying(true);
    setError("");
    try {
      onVerified(await authService.verifyOtp({ email, token, type: "signup" }));
    } catch (caught) {
      setError(caught instanceof AuthError && caught.code === "otp_invalid" ? authErrors.otpWrong : authErrors.generic);
      setCode("");
      inputRef.current?.focus();
      setVerifying(false);
    }
  };

  const subtitle = copy.subtitle(email);
  return (
    <AuthStep>
      <AuthHeading title={copy.title}>
        {subtitle.before} <strong className="block font-semibold break-all">{subtitle.email}</strong>
      </AuthHeading>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void verify();
        }}
        className={formColumn}
      >
        <OtpInput
          ref={inputRef}
          id="auth-otp"
          label={copy.codeLabel}
          length={OTP_LENGTH}
          value={code}
          onChange={(value) => {
            setCode(value);
            setError("");
          }}
          onComplete={(value) => void verify(value)}
          error={error}
        />
        <div id="auth-otp-error" aria-live="polite">
          {error && <FormAlert>{error}</FormAlert>}
        </div>
        {notice && !error && <FormAlert tone="info">{notice}</FormAlert>}
        <MockCodeHint />
        <SubmitButton loading={verifying} loadingLabel={copy.submitting} className="mt-1">
          {copy.submit}
        </SubmitButton>
      </form>
      <AuthFooter>
        {copy.resendPrompt}{" "}
        <ResendButton
          seconds={timer.seconds}
          onResend={async () => {
            await authService.resend(email, "signup");
            timer.restart();
            setNotice(copy.resent);
          }}
        />
        <span aria-hidden className="mx-2 text-muted">
          ·
        </span>
        <button type="button" onClick={onEdit} className="font-semibold text-ink underline-offset-4 hover:underline focus-visible:underline">
          {copy.edit}
        </button>
      </AuthFooter>
    </AuthStep>
  );
}
