"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthLink, useAuthModal, withRedirect } from "@/components/auth/AuthModalContext";
import { AuthFooter, AuthHeading, AuthStep, VerifyEmailStep, formColumn } from "@/components/auth/AuthStep";
import { DateField } from "@/components/forms/DateField";
import { PhoneField } from "@/components/forms/PhoneField";
import { Checkbox, FormAlert, PasswordField, SubmitButton, TextField } from "@/components/forms/fields";
import { MIN_AGE, authCopy, authErrors } from "@/data/auth";
import { signupSchema } from "@/lib/auth/schema";
import { authService } from "@/lib/auth/service";
import { AuthError } from "@/lib/auth/types";
import { useZodForm } from "@/lib/forms/useZodForm";
import { prefetchFor } from "@/lib/routes";

const copy = authCopy.signup;
const thisYear = new Date().getFullYear();

// Signup (Figma + spec's DOB gate and consent) → 8-digit email code (platform) → "You're in!" → /onboarding.
export function SignupFlow() {
  const { stepBack } = useAuthModal();
  const [step, setStep] = useState<"form" | "verify" | "welcome">("form");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const form = useZodForm(
    signupSchema,
    { fullName: "", email: "", phone: "", dateOfBirth: "", password: "", terms: false },
    "signup",
  );

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    const values = form.submit();
    if (!values) return;
    setSubmitting(true);
    try {
      if (await authService.checkEmailExists(values.email)) {
        form.setError("email", authErrors.emailTaken);
        return;
      }
      await authService.signUp({
        email: values.email,
        password: values.password,
        full_name: values.fullName,
        phone: values.phone,
        date_of_birth: values.dateOfBirth,
        terms_accepted_at: new Date().toISOString(),
      });
      setStep("verify");
    } catch (caught) {
      const code = caught instanceof AuthError ? caught.code : "unknown";
      if (code === "email_taken") form.setError("email", authErrors.emailTaken);
      else if (code === "weak_password") form.setError("password", authErrors.weakPassword);
      else setFormError(code === "rate_limited" ? authErrors.rateLimited : authErrors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "verify") {
    return <VerifyEmailStep key="verify" email={form.values.email.trim()} onVerified={() => setStep("welcome")} onEdit={() => { stepBack(); setStep("form"); }} />;
  }
  if (step === "welcome") return <WelcomeStep key="welcome" />;

  const { fields } = authCopy;
  return (
    <AuthStep key="form">
      <AuthHeading title={copy.title}>{copy.subtitle}</AuthHeading>
      <form noValidate onSubmit={onSubmit} className={formColumn}>
        <TextField
          {...form.field("fullName")}
          label={fields.fullName}
          labelHidden
          autoComplete="name"
          value={form.values.fullName}
          onChange={(event) => form.setValue("fullName", event.target.value)}
        />
        <TextField
          {...form.field("email")}
          label={fields.email}
          labelHidden
          type="email"
          autoComplete="email"
          value={form.values.email}
          onChange={(event) => form.setValue("email", event.target.value)}
        />
        <PhoneField
          {...form.field("phone")}
          label={fields.phone}
          countryLabel={fields.country}
          labelHidden
          value={form.values.phone}
          onChange={(value) => form.setValue("phone", value)}
        />
        <DateField
          {...form.field("dateOfBirth")}
          legend={copy.dobLabel}
          labels={{ day: fields.day, month: fields.month, year: fields.year }}
          minYear={thisYear - 100}
          maxYear={thisYear - MIN_AGE}
          value={form.values.dateOfBirth}
          onChange={(value) => form.setValue("dateOfBirth", value)}
        />
        <PasswordField
          {...form.field("password")}
          label={fields.password}
          labelHidden
          autoComplete="new-password"
          showLabel={fields.showPassword}
          hideLabel={fields.hidePassword}
          hint={copy.passwordHint}
          value={form.values.password}
          onChange={(event) => form.setValue("password", event.target.value)}
        />
        <Checkbox
          {...form.field("terms")}
          className="mt-1"
          checked={form.values.terms}
          onChange={(event) => form.setValue("terms", event.target.checked)}
        >
          {copy.terms.before}{" "}
          <TermsLink href={copy.terms.terms.href}>{copy.terms.terms.label}</TermsLink> {copy.terms.and}{" "}
          <TermsLink href={copy.terms.privacy.href}>{copy.terms.privacy.label}</TermsLink>
        </Checkbox>
        <FormAlert>{formError}</FormAlert>
        <SubmitButton loading={submitting} loadingLabel={copy.submitting} className="mt-1">
          {copy.submit}
        </SubmitButton>
      </form>
      <AuthFooter>
        {copy.switchPrompt} <AuthLink href={copy.switchHref}>{copy.switchLabel}</AuthLink>
      </AuthFooter>
    </AuthStep>
  );
}

// Opens in a new tab so the half-filled form isn't lost.
function TermsLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} prefetch={prefetchFor(href)} target="_blank" className="font-semibold underline underline-offset-2 hover:text-brand-dark">
      {children}
    </Link>
  );
}

// Long enough to read "You're in!" before onboarding opens (the platform waits 1.2s, which felt abrupt).
const WELCOME_REDIRECT_MS = 3200;

function WelcomeStep() {
  const { go } = useAuthModal();
  const welcome = authCopy.welcome;
  // Keeps ?redirect= (e.g. back to the event the visitor wanted to register for) through onboarding.
  const goToOnboarding = () => go(withRedirect("/onboarding"));

  useEffect(() => {
    const timer = setTimeout(() => go(withRedirect("/onboarding")), WELCOME_REDIRECT_MS);
    return () => clearTimeout(timer);
    // Once, on mount (`go` is recreated every render).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthStep>
      <span className="mx-auto mb-6 flex size-14 items-center justify-center bg-brand text-white" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-7">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
      <AuthHeading title={welcome.title}>{welcome.subtitle}</AuthHeading>
      <div className={formColumn}>
        <SubmitButton type="button" loading={false} loadingLabel="" onClick={goToOnboarding}>
          {welcome.cta}
        </SubmitButton>
      </div>
    </AuthStep>
  );
}
