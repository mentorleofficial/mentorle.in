"use client";

import { useState } from "react";
import { AuthLink, useAuthModal } from "@/components/auth/AuthModalContext";
import { AuthFooter, AuthHeading, AuthStep, VerifyEmailStep, formColumn } from "@/components/auth/AuthStep";
import { FormAlert, PasswordField, SubmitButton, TextField } from "@/components/forms/fields";
import { authCopy, authErrors } from "@/data/auth";
import { loginSchema } from "@/lib/auth/schema";
import { authService } from "@/lib/auth/service";
import { AuthError } from "@/lib/auth/types";
import { useZodForm } from "@/lib/forms/useZodForm";

const copy = authCopy.login;

// Login (Figma) → if the account was never verified, the platform's email-code step, then finish().
export function LoginFlow() {
  const { finish } = useAuthModal();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const form = useZodForm(loginSchema, { email: "", password: "" }, "login");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    const values = form.submit();
    if (!values) return;
    setSubmitting(true);
    try {
      const session = await authService.signInWithPassword(values);
      await finish(session.user.id);
    } catch (caught) {
      setSubmitting(false);
      const code = caught instanceof AuthError ? caught.code : "unknown";
      if (code === "email_not_confirmed") setStep("verify");
      else setFormError(code === "invalid_credentials" ? authErrors.credentials : authErrors.generic);
    }
  };

  if (step === "verify") {
    return <VerifyEmailStep key="verify" email={form.values.email.trim()} onVerified={(session) => void finish(session.user.id)} onEdit={() => setStep("form")} />;
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
