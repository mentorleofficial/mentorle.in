"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccountLoading, AccountNotice } from "@/components/account/AccountGate";
import { OtpInput } from "@/components/forms/OtpInput";
import { FormAlert, SubmitButton, outlineButtonClasses } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { OTP_LENGTH } from "@/data/auth";
import { jobApplyCopy as copy } from "@/data/jobs";
import { useAuth } from "@/lib/auth/AuthProvider";
import { browserSupabase } from "@/lib/supabase/browser";

type ApplyCode = "signed_out" | "mentees_only" | "verify_email" | "job_gone" | "unavailable" | "bad_request";
type Step = "checking" | "redirecting" | "verify" | "code" | ApplyCode;

const RESEND_SECONDS = 60;
const BACK = "/events#opportunities";

// One-click apply on Huptle. The server (/api/huptle/apply) decides: signed in, a mentee, a verified email, an open
// job → a signed link, and the browser goes straight there. Event-mode quick signups verify their email here first
// (a code by email, then mark_email_verified, which only works right after a code sign-in).
export function JobApply() {
  const { id } = useParams<{ id: string }>();
  const { status, user } = useAuth();
  const [step, setStep] = useState<Step>("checking");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  // The sign-in state last acted on. Logging in from the prompt here doesn't reload the page, so a change from
  // signed out to signed in starts the apply step again.
  const handledFor = useRef<"signed-in" | "signed-out" | null>(null);
  const here = `/jobs/${id}/apply`;

  const apply = useCallback(async () => {
    setStep("checking");
    try {
      const response = await fetch("/api/huptle/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId: id }) });
      const body = (await response.json().catch(() => ({}))) as { url?: string; code?: ApplyCode };
      if (body.url) {
        setStep("redirecting");
        window.location.assign(body.url);
        return;
      }
      setStep(body.code === "verify_email" ? "verify" : (body.code ?? "unavailable"));
    } catch {
      setStep("unavailable");
    }
  }, [id]);

  useEffect(() => {
    if (status === "loading" || handledFor.current === status) return;
    handledFor.current = status;
    if (status === "signed-out") queueMicrotask(() => setStep("signed_out"));
    else queueMicrotask(() => void apply());
  }, [status, apply]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const email = user?.email ?? "";

  const sendCode = async () => {
    setError("");
    setBusy(true);
    const { error: sendError } = await browserSupabase().auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
    setBusy(false);
    if (sendError) {
      setError(copy.verify.errors.send);
      return;
    }
    setCode("");
    setResendIn(RESEND_SECONDS);
    setStep("code");
  };

  const verify = async (value = code) => {
    if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(value)) {
      setError(copy.verify.errors.code);
      return;
    }
    setError("");
    setBusy(true);
    const db = browserSupabase();
    const { error: otpError } = await db.auth.verifyOtp({ email, token: value, type: "email" });
    if (otpError) {
      setBusy(false);
      setError(copy.verify.errors.wrong);
      return;
    }
    const { error: markError } = await db.rpc("mark_email_verified");
    setBusy(false);
    if (markError) {
      setError(copy.verify.errors.generic);
      return;
    }
    await apply();
  };

  const backLink = (
    <Link href={BACK} className={outlineButtonClasses()}>
      {copy.back}
    </Link>
  );

  if (step === "checking" || step === "redirecting") return <AccountLoading label={step === "checking" ? copy.checking : copy.redirecting} />;

  if (step === "signed_out")
    return (
      <AccountNotice title={copy.signedOut.title} body={copy.signedOut.body}>
        <Link href={`/login?redirect=${encodeURIComponent(here)}`} className={buttonClasses("brand")}>
          {copy.signedOut.login}
        </Link>
        <Link href={`/signup?redirect=${encodeURIComponent(here)}`} className={outlineButtonClasses()}>
          {copy.signedOut.signup}
        </Link>
      </AccountNotice>
    );

  if (step === "mentees_only") return <AccountNotice title={copy.menteesOnly.title} body={copy.menteesOnly.body}>{backLink}</AccountNotice>;
  if (step === "job_gone" || step === "bad_request") return <AccountNotice title={copy.jobGone.title} body={copy.jobGone.body}>{backLink}</AccountNotice>;

  if (step === "verify")
    return (
      <AccountNotice title={copy.verify.title} body={copy.verify.body(email)}>
        <div className="flex w-full flex-col gap-3">
          <FormAlert>{error}</FormAlert>
          <div className="flex flex-wrap gap-3">
            <SubmitButton type="button" loading={busy} loadingLabel={copy.verify.sending} onClick={() => void sendCode()} className="w-auto">
              {copy.verify.send}
            </SubmitButton>
            {backLink}
          </div>
        </div>
      </AccountNotice>
    );

  if (step === "code")
    return (
      <AccountNotice title={copy.verify.codeTitle} body={copy.verify.codeBody(email)}>
        <form
          noValidate
          className="flex w-full max-w-[20.625rem] flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void verify();
          }}
        >
          <OtpInput
            id="job-verify-code"
            label={copy.verify.codeLabel}
            length={OTP_LENGTH}
            value={code}
            onChange={(value) => {
              setCode(value);
              setError("");
            }}
            onComplete={(value) => void verify(value)}
            error={error || undefined}
          />
          <div id="job-verify-code-error" aria-live="polite">
            {error && <FormAlert>{error}</FormAlert>}
          </div>
          <SubmitButton loading={busy} loadingLabel={copy.verify.submitting}>
            {copy.verify.submit}
          </SubmitButton>
          <button
            type="button"
            disabled={resendIn > 0 || busy}
            onClick={() => void sendCode()}
            className="text-sm text-ink underline-offset-4 hover:underline disabled:cursor-default disabled:text-muted disabled:no-underline"
          >
            {resendIn > 0 ? copy.verify.resendIn(resendIn) : copy.verify.resend}
          </button>
        </form>
      </AccountNotice>
    );

  return (
    <AccountNotice title={copy.unavailable.title} body={copy.unavailable.body}>
      <button type="button" onClick={() => void apply()} className={buttonClasses("brand")}>
        {copy.unavailable.retry}
      </button>
      {backLink}
    </AccountNotice>
  );
}
