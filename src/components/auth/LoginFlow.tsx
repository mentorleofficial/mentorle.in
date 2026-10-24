"use client";

import { useState } from "react";
import { AuthLink, useAuthModal } from "@/components/auth/AuthModalContext";
import { AuthFooter, AuthHeading, AuthStep, PlatformAccountStep, VerifyEmailStep, formColumn } from "@/components/auth/AuthStep";
import { FormAlert, PasswordField, SubmitButton, TextField } from "@/components/forms/fields";
import { authCopy, authErrors } from "@/data/auth";
import { loginSchema } from "@/lib/auth/schema";
import { authService } from "@/lib/auth/service";
import { AuthError } from "@/lib/auth/types";
import type { AuthUser } from "@/lib/auth/types";
import { useZodForm } from "@/lib/forms/useZodForm";

const copy = authCopy.login;

// Login (Figma) → if the account was never verified, the platform's email-code step, then finish().
// Mentor and admin accounts get the "use the platform" step instead.
export function LoginFlow() {
  const { finish, stepBack } = useAuthModal();
  const [step, setStep] = useState<"form" | "verify" | "platform">("form");
  const [platformRole, setPlatformRole] = useState<"mentor" | "admin">("mentor");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const form = useZodForm(loginSchema, { email: "", password: "" }, "login");

  const done = async (user: AuthUser) => {
    if (user.role === "mentee") return finish(user.id);
    setPlatformRole(user.role);
    setStep("platform");
    setSubmitting(false);
    await authService.signOut();
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    const values = form.submit();
    if (!values) return;
    setSubmitting(true);
    try {
      const session = await authService.signInWithPassword(values);
      await done(session.user);
    } catch (caught) {
      setSubmitting(false);
      const code = caught instanceof AuthError ? caught.code : "unknown";
      if (code === "email_not_confirmed") setStep("verify");
      else setFormError(code === "invalid_credentials" ? authErrors.credentials : code === "rate_limited" ? authErrors.rateLimited : authErrors.generic);
    }
  };

  if (step === "verify") {
    return <VerifyEmailStep key="verify" email={form.values.email.trim()} onVerified={(session) => void done(session.user)} onEdit={() => { stepBack(); setStep("form"); }} />;
  }
  if (step === "platform") {
    return <PlatformAccountStep key="platform" role={platformRole} onBack={() => { stepBack(); setStep("form"); }} />;
  }

  return (
    <AuthStep key="form">
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
        <div>
          <PasswordField
            {...form.field("password")}
            label={authCopy.fields.password}
            labelHidden
            autoComplete="current-password"
            showLabel={authCopy.fields.showPassword}
            hideLabel={authCopy.fields.hidePassword}
            value={form.values.password}
            onChange={(event) => form.setValue("password", event.target.value)}
          />
          <p className="mt-2 text-right text-xs">
            <AuthLink href="/forgot-password" className="text-ink underline-offset-4 hover:underline focus-visible:underline">
              {copy.forgot}
            </AuthLink>
          </p>
        </div>
        <FormAlert>{formError}</FormAlert>
        <SubmitButton loading={submitting} loadingLabel={copy.submitting}>
          {copy.submit}
        </SubmitButton>
      </form>
      <AuthFooter>
        {copy.switchPrompt} <AuthLink href={copy.switchHref}>{copy.switchLabel}</AuthLink>
      </AuthFooter>
    </AuthStep>
  );
}
