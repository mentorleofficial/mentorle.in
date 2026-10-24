"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { AccountGate, AccountNotice } from "@/components/account/AccountGate";
import { ChipInput } from "@/components/forms/ChipInput";
import { FormAlert, PasswordField, Spinner, TextAreaField, TextField, outlineButtonClasses } from "@/components/forms/fields";
import { PhoneField } from "@/components/forms/PhoneField";
import { PhotoPicker } from "@/components/forms/PhotoPicker";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { accountCopy as copy } from "@/data/account";
import { authCopy, authErrors } from "@/data/auth";
import { areaSuggestions, interestSuggestions, onboardingCopy, onboardingLimits } from "@/data/onboarding";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fieldErrors, newPasswordSchema, normaliseUrl, onboardingSchema, validPhone } from "@/lib/auth/schema";
import type { OnboardingField, OnboardingValues } from "@/lib/auth/schema";
import { authService } from "@/lib/auth/service";
import { AuthError } from "@/lib/auth/types";
import type { MenteeProfile } from "@/lib/auth/types";

const fields = onboardingCopy.fields;
const sections = [
  { id: "profile", label: copy.nav.profile },
  { id: "password", label: copy.nav.password },
  { id: "sign-out", label: copy.nav.signOut },
];

// A white bordered card on the grey section: 20/24px title, 14px note, then its fields.
function SettingsCard({ id, title, body, children }: { id?: string; title: string; body: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="scroll-mt-8 border border-[#cbcbcb] bg-white p-5 md:p-8">
      <h2 id={id ? `${id}-title` : undefined} className="text-xl font-medium text-ink lg:text-2xl">
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-snug text-ink-soft">{body}</p>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </section>
  );
}

export function AccountSettings() {
  return (
    <AccountGate path="/account" loading={copy.loading} signedOut={copy.gate}>
      <Settings />
    </AccountGate>
  );
}

function Settings() {
  const { user, profile, onboarded } = useAuth();
  if (!user || !profile) return null;
  return (
    <div className="animate-[auth-step-in_300ms_ease-out] motion-reduce:animate-none lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 xl:gap-24">
      <nav aria-label={copy.title} className="hidden lg:block">
        <ol className="sticky top-8 space-y-1 border-l border-line">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-ink/80 transition-colors hover:border-brand hover:text-ink">
                {section.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="flex max-w-[48rem] min-w-0 flex-col gap-6">
        {onboarded ? (
          <ProfileForm key={user.id} profile={profile} />
        ) : (
          <div id="profile" className="scroll-mt-8">
            <AccountNotice title={copy.profile.title} body={copy.finishProfile.body}>
              <Link href="/onboarding?redirect=%2Faccount" className={buttonClasses("brand")}>
                {copy.finishProfile.cta}
              </Link>
            </AccountNotice>
          </div>
        )}
        <PasswordForm email={user.email} />
        <SignOut />
      </div>
    </div>
  );
}

type ProfileValues = OnboardingValues & { phone: string };

const fromProfile = (profile: MenteeProfile): ProfileValues => ({
  full_name: profile.full_name,
  headline: profile.headline,
  bio: profile.bio,
  organization_unit: profile.organization_unit,
  goals: profile.goals,
  academic_details: profile.academic_details,
  interests: profile.interests,
  preferred_mentor_areas: profile.preferred_mentor_areas,
  linkedin_url: profile.linkedin_url,
  github_url: profile.github_url,
  portfolio_url: profile.portfolio_url,
  phone: profile.phone ?? "",
});

// The onboarding fields with the same rules (onboardingSchema), on one page with one Save.
function ProfileForm({ profile }: { profile: MenteeProfile }) {
  const { user, refresh } = useAuth();
  const [saved, setSaved] = useState<ProfileValues>(() => fromProfile(profile));
  const [values, setValues] = useState<ProfileValues>(saved);
  const [touched, setTouched] = useState<Partial<Record<keyof ProfileValues, boolean>>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "info"; text: string } | null>(null);

  const { phone, ...rest } = values;
  const parsed = onboardingSchema.safeParse(rest);
  const errors: Partial<Record<keyof ProfileValues, string>> = parsed.success ? {} : fieldErrors(parsed.error);
  if (phone && !validPhone(phone)) errors.phone = copy.phoneError;
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  const error = (name: keyof ProfileValues) => (touched[name] ? errors[name] : undefined);
  const set = <K extends keyof ProfileValues>(name: K, value: ProfileValues[K]) => {
    setValues((current) => ({ ...current, [name]: value }));
    setMessage(null);
  };
  const blur = (name: keyof ProfileValues) => setTouched((current) => ({ ...current, [name]: true }));
  const field = (name: OnboardingField) => ({ id: `account-${name}`, error: error(name), onBlur: () => blur(name) });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user) return;
    const invalid = Object.keys(errors) as (keyof ProfileValues)[];
    if (invalid.length || !parsed.success) {
      setTouched(Object.fromEntries(Object.keys(values).map((name) => [name, true])));
      setMessage({ tone: "error", text: copy.fixErrors });
      document.getElementById(`account-${invalid[0]}`)?.focus();
      return;
    }
    setSaving(true);
    try {
      await authService.upsertMenteeProfile(user.id, { ...parsed.data, phone: phone || null });
      await refresh();
      const next = { ...values, ...parsed.data, phone };
      setSaved(next);
      setValues(next);
      setMessage({ tone: "info", text: copy.saved });
    } catch {
      setMessage({ tone: "error", text: copy.saveError });
    } finally {
      setSaving(false);
    }
  };

  const linkField = (name: "linkedin_url" | "github_url" | "portfolio_url", fieldCopy: { label: string; placeholder: string }) => (
    <TextField
      {...field(name)}
      onBlur={() => {
        set(name, normaliseUrl(values[name]));
        blur(name);
      }}
      type="url"
      inputMode="url"
      autoComplete="url"
      label={fieldCopy.label}
      labelSuffix={onboardingCopy.optional}
      placeholder={fieldCopy.placeholder}
      value={values[name]}
      onChange={(event) => set(name, event.target.value)}
    />
  );

  return (
    <form noValidate onSubmit={submit} className="flex flex-col gap-6">
      <SettingsCard id="profile" title={copy.profile.title} body={copy.profile.body}>
        <PhotoPicker name={values.full_name || profile.email} />
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-4">
          <TextField
            {...field("full_name")}
            label={fields.fullName.label}
            placeholder={fields.fullName.placeholder}
            autoComplete="name"
            value={values.full_name}
            onChange={(event) => set("full_name", event.target.value)}
          />
          <PhoneField
            id="account-phone"
            label={copy.profile.phone}
            countryLabel={copy.profile.country}
            value={values.phone}
            onChange={(value) => set("phone", value)}
            onBlur={() => blur("phone")}
            error={error("phone")}
          />
        </div>
        <TextField id="account-email" label={copy.profile.email} value={profile.email} disabled readOnly hint={copy.profile.emailHint} />
      </SettingsCard>

      <SettingsCard title={copy.about.title} body={copy.about.body}>
        <TextField
          {...field("headline")}
          label={fields.headline.label}
          labelSuffix={onboardingCopy.optional}
          placeholder={fields.headline.placeholder}
          maxLength={onboardingLimits.headline}
          value={values.headline}
          onChange={(event) => set("headline", event.target.value)}
          hint={`${values.headline.length}/${onboardingLimits.headline}`}
        />
        <TextAreaField
          {...field("bio")}
          label={fields.bio.label}
          labelSuffix={onboardingCopy.optional}
          placeholder={fields.bio.placeholder}
          maxLength={onboardingLimits.bio}
          value={values.bio}
          onChange={(event) => set("bio", event.target.value)}
        />
        <TextField
          {...field("organization_unit")}
          label={fields.organization.label}
          labelSuffix={onboardingCopy.optional}
          placeholder={fields.organization.placeholder}
          maxLength={120}
          value={values.organization_unit}
          onChange={(event) => set("organization_unit", event.target.value)}
        />
      </SettingsCard>

      <SettingsCard title={copy.goals.title} body={copy.goals.body}>
        <TextAreaField
          {...field("goals")}
          label={fields.goals.label}
          labelSuffix={onboardingCopy.goalsMin}
          placeholder={fields.goals.placeholder}
          maxLength={onboardingLimits.goals}
          value={values.goals}
          onChange={(event) => set("goals", event.target.value)}
        />
        <TextField
          {...field("academic_details")}
          label={fields.academic.label}
          labelSuffix={onboardingCopy.optional}
          placeholder={fields.academic.placeholder}
          maxLength={onboardingLimits.academic}
          value={values.academic_details}
          onChange={(event) => set("academic_details", event.target.value)}
        />
      </SettingsCard>

      <SettingsCard title={copy.interests.title} body={copy.interests.body}>
        <ChipInput
          id="account-interests"
          label={fields.interests.label}
          placeholder={fields.interests.placeholder}
          value={values.interests}
          onChange={(value) => {
            set("interests", value);
            blur("interests");
          }}
          suggestions={interestSuggestions}
          maxLength={onboardingLimits.chip}
          error={error("interests")}
          hint={onboardingCopy.chips.count(values.interests.length, onboardingLimits.interestsMin)}
          copy={onboardingCopy.chips}
        />
        <ChipInput
          id="account-preferred_mentor_areas"
          label={fields.areas.label}
          placeholder={fields.areas.placeholder}
          value={values.preferred_mentor_areas}
          onChange={(value) => {
            set("preferred_mentor_areas", value);
            blur("preferred_mentor_areas");
          }}
          suggestions={areaSuggestions}
          maxLength={onboardingLimits.chip}
          error={error("preferred_mentor_areas")}
          copy={onboardingCopy.chips}
        />
        {linkField("linkedin_url", fields.linkedin)}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-4">
          {linkField("github_url", fields.github)}
          {linkField("portfolio_url", fields.portfolio)}
        </div>
      </SettingsCard>

      {/* Stays at the bottom of the screen while the profile cards scroll past. */}
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-[#cbcbcb] bg-surface px-4 py-4 md:mx-0 md:px-0">
        <p className="mr-auto text-sm text-ink-soft" aria-live="polite">
          {message ? <span className={message.tone === "error" ? "text-brand-dark" : "text-ink"}>{message.text}</span> : dirty ? copy.unsaved : null}
        </p>
        {dirty && (
          <button
            type="button"
            onClick={() => {
              setValues(saved);
              setTouched({});
              setMessage(null);
            }}
            disabled={saving}
            className={outlineButtonClasses()}
          >
            {copy.discard}
          </button>
        )}
        <button type="submit" disabled={!dirty || saving} aria-busy={saving} className={buttonClasses("brand", "min-w-[9.5rem] gap-2 disabled:cursor-not-allowed disabled:opacity-60")}>
          {saving ? (
            <>
              <Spinner />
              {copy.saving}
            </>
          ) : (
            copy.save
          )}
        </button>
      </div>
    </form>
  );
}

const passwordError = (error: unknown) => {
  const code = error instanceof AuthError ? error.code : "unknown";
  if (code === "invalid_credentials") return { field: "current" as const, text: copy.password.wrongCurrent };
  if (code === "same_password") return { field: "password" as const, text: authErrors.samePassword };
  if (code === "weak_password") return { field: "password" as const, text: authErrors.weakPassword };
  if (code === "rate_limited") return { field: null, text: authErrors.rateLimited };
  return { field: null, text: authErrors.generic };
};

function PasswordForm({ email }: { email: string }) {
  const [values, setValues] = useState({ current: "", password: "", confirmPassword: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState<{ field: "current" | "password" | null; text: string } | null>(null);
  const [working, setWorking] = useState(false);
  const [done, setDone] = useState(false);

  const parsed = newPasswordSchema.safeParse({ password: values.password, confirmPassword: values.confirmPassword });
  const errors: Record<string, string | undefined> = parsed.success ? {} : fieldErrors(parsed.error);
  if (!values.current) errors.current = copy.password.required;
  const shown = (name: "current" | "password" | "confirmPassword") => (serverError?.field === name ? serverError.text : touched[name] ? errors[name] : undefined);
  const set = (name: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setServerError(null);
    setDone(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const invalid = (["current", "password", "confirmPassword"] as const).filter((name) => errors[name]);
    if (invalid.length) {
      setTouched({ current: true, password: true, confirmPassword: true });
      document.getElementById(`account-${invalid[0]}`)?.focus();
      return;
    }
    setWorking(true);
    try {
      await authService.verifyPassword(email, values.current);
      await authService.updatePassword(values.password);
      setValues({ current: "", password: "", confirmPassword: "" });
      setTouched({});
      setDone(true);
    } catch (error) {
      setServerError(passwordError(error));
    } finally {
      setWorking(false);
    }
  };

  const passwordProps = (name: "current" | "password" | "confirmPassword", label: string, autoComplete: string) => ({
    id: `account-${name}`,
    label,
    autoComplete,
    value: values[name],
    onChange: (event: ChangeEvent<HTMLInputElement>) => set(name, event.target.value),
    onBlur: () => setTouched((current) => ({ ...current, [name]: true })),
    error: shown(name),
    showLabel: authCopy.fields.showPassword,
    hideLabel: authCopy.fields.hidePassword,
  });

  return (
    <form noValidate onSubmit={submit}>
      {/* Tells password managers which account this is for. */}
      <input type="text" name="username" autoComplete="username" value={email} readOnly hidden />
      <SettingsCard id="password" title={copy.password.title} body={copy.password.body}>
        <div className="max-w-[22rem]">
          <PasswordField {...passwordProps("current", copy.password.current, "current-password")} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-4">
          <PasswordField {...passwordProps("password", copy.password.next, "new-password")} />
          <PasswordField {...passwordProps("confirmPassword", copy.password.confirm, "new-password")} />
        </div>
        {serverError && !serverError.field && <FormAlert>{serverError.text}</FormAlert>}
        {done && <FormAlert tone="info">{copy.password.done}</FormAlert>}
        <div>
          <button type="submit" disabled={working} aria-busy={working} className={buttonClasses("dark", "gap-2 disabled:opacity-60")}>
            {working ? (
              <>
                <Spinner />
                {copy.password.submitting}
              </>
            ) : (
              copy.password.submit
            )}
          </button>
        </div>
      </SettingsCard>
    </form>
  );
}

function SignOut() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [working, setWorking] = useState(false);
  return (
    <SettingsCard id="sign-out" title={copy.signOut.title} body={copy.signOut.body}>
      <div>
        <button
          type="button"
          disabled={working}
          onClick={async () => {
            setWorking(true);
            await signOut();
            router.push("/");
          }}
          className={outlineButtonClasses("disabled:opacity-60")}
        >
          {working ? copy.signOut.working : copy.signOut.cta}
        </button>
      </div>
    </SettingsCard>
  );
}
