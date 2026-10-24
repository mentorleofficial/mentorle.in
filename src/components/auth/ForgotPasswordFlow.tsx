"use client";

import { useRef, useState } from "react";
import { AuthLink, useAuthModal } from "@/components/auth/AuthModalContext";
import { AuthFooter, AuthHeading, AuthStep, ResendButton, formColumn, useResendTimer } from "@/components/auth/AuthStep";
import { OtpInput } from "@/components/forms/OtpInput";
import { FieldMessage, FormAlert, PasswordField, SubmitButton, TextField } from "@/components/forms/fields";
import { OTP_LENGTH, authCopy, authErrors } from "@/data/auth";
import { forgotSchema, resetSchema } from "@/lib/auth/schema";
import { authService } from "@/lib/auth/service";
import { AuthError } from "@/lib/auth/types";
import { useZodForm } from "@/lib/forms/useZodForm";

// Platform flow: email → 8-digit recovery code + new password → signed in. Unlike the platform, the first
// step never says whether the account exists.
export function ForgotPasswordFlow() {
  const { stepBack } = useAuthModal();
  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  if (step === "reset") {
    return (
      <ResetStep
        key="reset"
        email={email}
        onChangeEmail={() => {
          stepBack();
          setStep("request");
        }}
        onDone={(id) => {
          setUserId(id);
          setStep("done");
        }}
      />
    );
  }
  if (step === "done") return <DoneStep key="done" userId={userId} />;
  return (
    <RequestStep
      key="request"
      initialEmail={email}
      onSent={(sentTo) => {
        setEmail(sentTo);
        setStep("reset");
      }}
    />
  );
}

function RequestStep({ initialEmail, onSent }: { initialEmail: string; onSent: (email: string) => void }) {
  const copy = authCopy.forgot;
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const form = useZodForm(forgotSchema, { email: initialEmail }, "forgot");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const values = form.submit();
    if (!values) return;
    setSending(true);
    setFormError("");
    try {
      await authService.resetPasswordForEmail(values.email);
      onSent(values.email);
    } catch {
      setFormError(authErrors.generic);
      setSending(false);
    }
  };

  return (
    <AuthStep>
      <AuthHeading title={copy.title}>{copy.subtitle}</AuthHeading>
      <form noValidate onSubmit={onSubmit} className={formColumn}>
        <TextField
          {...form.field("email")}
          label={authCopy.fields.email}
          labelHidden
          type="email"
          autoComplete="email"
          value={form.values.email}
          onChange={(event) => form.setValue("email", event.target.value)}
        />
        <FormAlert>{formError}</FormAlert>
        <SubmitButton loading={sending} loadingLabel={copy.submitting}>
          {copy.submit}
        </SubmitButton>
      </form>
      <AuthFooter>
        <AuthLink href={copy.backHref}>← {copy.back}</AuthLink>
      </AuthFooter>
    </AuthStep>
  );
}

function ResetStep({ email, onChangeEmail, onDone }: { email: string; onChangeEmail: () => void; onDone: (userId: string) => void }) {
  const copy = authCopy.reset;
  const { fields } = authCopy;
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const timer = useResendTimer();
  const form = useZodForm(resetSchema, { otp: "", password: "", confirmPassword: "" }, "reset");
  const verifiedUser = useRef<string | null>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    const values = form.submit();
    if (!values) return;
    setSaving(true);
    try {
      // Platform order: verifying the recovery code signs the user in, then the password is updated. A code
      // works once, so if the new password is rejected the retry skips straight to updating it.
      verifiedUser.current ??= (await authService.verifyOtp({ email, token: values.otp, type: "recovery" })).user.id;
      await authService.updatePassword(values.password);
      onDone(verifiedUser.current);
    } catch (caught) {
      setSaving(false);
      const code = caught instanceof AuthError ? caught.code : "unknown";
      if (code === "otp_invalid") {
        form.setValue("otp", "");
        form.setError("otp", authErrors.otpWrong);
      } else if (code === "same_password" || code === "weak_password") {
        form.setError("password", code === "same_password" ? authErrors.samePassword : authErrors.weakPassword);
      } else setFormError(code === "rate_limited" ? authErrors.rateLimited : authErrors.generic);
    }
  };

  const subtitle = copy.subtitle(email);
  const otp = form.field("otp");
  return (
    <AuthStep>
      <AuthHeading title={copy.title}>
        {subtitle.before} <strong className="block font-semibold break-all">{subtitle.email}</strong>
        {subtitle.after}
      </AuthHeading>
      <form noValidate onSubmit={onSubmit} className={formColumn} autoComplete="off">
        <div>
          <OtpInput
            id={otp.id}
            label={authCopy.verify.codeLabel}
            length={OTP_LENGTH}
            value={form.values.otp}
            onChange={(value) => form.setValue("otp", value)}
            error={otp.error}
          />
          <FieldMessage id={otp.id} error={otp.error} />
        </div>
        {notice && <FormAlert tone="info">{notice}</FormAlert>}
        <PasswordField
          {...form.field("password")}
          className="mt-2"
          label={fields.newPassword}
          labelHidden
          autoComplete="new-password"
          showLabel={fields.showPassword}
          hideLabel={fields.hidePassword}
          value={form.values.password}
          onChange={(event) => form.setValue("password", event.target.value)}
        />
        <PasswordField
          {...form.field("confirmPassword")}
          label={fields.confirmPassword}
          labelHidden
          autoComplete="new-password"
          showLabel={fields.showPassword}
          hideLabel={fields.hidePassword}
          value={form.values.confirmPassword}
          onChange={(event) => form.setValue("confirmPassword", event.target.value)}
        />
        <FormAlert>{formError}</FormAlert>
        <SubmitButton loading={saving} loadingLabel={copy.submitting} className="mt-1">
          {copy.submit}
        </SubmitButton>
      </form>
      <AuthFooter>
        {authCopy.verify.resendPrompt}{" "}
        <ResendButton
          seconds={timer.seconds}
          onResend={async () => {
            await authService.resetPasswordForEmail(email);
            timer.restart();
            setNotice(authCopy.verify.resent);
          }}
        />
        <span aria-hidden className="mx-2 text-muted">
          ·
        </span>
        <button type="button" onClick={onChangeEmail} className="font-semibold text-ink underline-offset-4 hover:underline focus-visible:underline">
          {copy.change}
        </button>
      </AuthFooter>
    </AuthStep>
  );
}

function DoneStep({ userId }: { userId: string }) {
  const { finish } = useAuthModal();
  const [continuing, setContinuing] = useState(false);
  const copy = authCopy.resetDone;
  return (
    <AuthStep>
      <span className="mx-auto mb-6 flex size-14 items-center justify-center bg-brand text-white" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-7">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <AuthHeading title={copy.title}>{copy.subtitle}</AuthHeading>
      <div className={formColumn}>
        <SubmitButton
          type="button"
          loading={continuing}
          loadingLabel={copy.cta}
          onClick={() => {
            setContinuing(true);
            void finish(userId);
          }}
        >
          {copy.cta}
        </SubmitButton>
      </div>
    </AuthStep>
  );
}
