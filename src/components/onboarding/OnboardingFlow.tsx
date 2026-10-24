"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AuthLink, safeRedirect, useAuthModal } from "@/components/auth/AuthModalContext";
import { AuthHeading, AuthStep } from "@/components/auth/AuthStep";
import { ChipInput } from "@/components/forms/ChipInput";
import { FormAlert, Spinner, SubmitButton, TextAreaField, TextField, outlineButtonClasses } from "@/components/forms/fields";
import { Avatar } from "@/components/layout/AccountMenu";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { StickyActions } from "@/components/ui/StickyActions";
import { areaSuggestions, interestSuggestions, onboardingCopy, onboardingLimits, onboardingSteps } from "@/data/onboarding";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fieldErrors, normaliseUrl, onboardingSchema, onboardingStepFields } from "@/lib/auth/schema";
import type { OnboardingField, OnboardingValues } from "@/lib/auth/schema";
import { authService } from "@/lib/auth/service";
import type { MenteeProfile } from "@/lib/auth/types";

const copy = onboardingCopy;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// The platform's mentee "Complete your profile" wizard (6 steps, same rules), as further steps of the auth
// modal: signup → verify → You're in! → these steps, all in one card over the page the user was on.
export function OnboardingFlow() {
  const { status, user, profile, onboarded } = useAuth();
  if (status === "signed-out") return <SignedOutStep />;
  if (status === "loading" || !user || !profile || onboarded) return <LoadingStep />;
  return <Wizard key={user.id} profile={profile} />;
}

function LoadingStep() {
  return (
    <AuthStep>
      <AuthHeading title={onboardingSteps[0].title}>{onboardingSteps[0].subtitle}</AuthHeading>
      <p className="mt-8 flex items-center justify-center gap-3 text-sm text-muted" role="status">
        <Spinner />
        {copy.loading}
      </p>
    </AuthStep>
  );
}

function SignedOutStep() {
  return (
    <AuthStep>
      <AuthHeading title={copy.signedOut.title}>{copy.signedOut.body}</AuthHeading>
      <div className="mx-auto mt-8 flex max-w-[20.625rem] flex-col gap-3">
        <AuthLink href="/login?redirect=%2Fonboarding" className={buttonClasses("brand", "w-full")}>
          {copy.signedOut.login}
        </AuthLink>
        <AuthLink href="/signup" className={outlineButtonClasses("w-full")}>
          {copy.signedOut.signup}
        </AuthLink>
      </div>
    </AuthStep>
  );
}

// Drafts save what's typed even if later steps are incomplete (the platform's "persistDraft").
const toDraft = (values: OnboardingValues) => ({
  ...values,
  linkedin_url: normaliseUrl(values.linkedin_url),
  github_url: normaliseUrl(values.github_url),
  portfolio_url: normaliseUrl(values.portfolio_url),
});

const fromProfile = (profile: MenteeProfile): OnboardingValues => ({
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
});

function Wizard({ profile }: { profile: MenteeProfile }) {
  const { user, refresh } = useAuth();
  const { close, go, stepBack } = useAuthModal();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<OnboardingValues>(() => fromProfile(profile));
  const [touched, setTouched] = useState<Partial<Record<OnboardingField, boolean>>>({});
  const [saving, setSaving] = useState<"next" | "exit" | null>(null);
  const [formError, setFormError] = useState("");

  const total = onboardingSteps.length;
  const isLast = step === total - 1;
  const meta = onboardingSteps[step];
  const percent = Math.round(((step + 1) / total) * 100);
  const parsed = onboardingSchema.safeParse(values);
  const errors = parsed.success ? {} : fieldErrors(parsed.error);
  const error = (name: OnboardingField) => (touched[name] ? errors[name] : undefined);

  // Closing with ✕, Esc or a click outside keeps what was typed (Continue and Save & exit save explicitly).
  // The modal's effects clean up when it closes (also when Next hides it in an <Activity>), so save there.
  const latest = useRef(values);
  const dirty = useRef(false);
  useEffect(() => {
    latest.current = values;
  }, [values]);
  useEffect(
    () => () => {
      if (dirty.current) void authService.upsertMenteeProfile(profile.user_id, toDraft(latest.current)).catch(() => undefined);
    },
    [profile.user_id],
  );

  const set = <K extends OnboardingField>(name: K, value: OnboardingValues[K]) => {
    dirty.current = true;
    setValues((current) => ({ ...current, [name]: value }));
    setFormError("");
  };
  const blur = (name: OnboardingField) => setTouched((current) => ({ ...current, [name]: true }));
  const field = (name: OnboardingField) => ({
    id: `onboarding-${name}`,
    error: error(name),
    onBlur: () => blur(name),
  });

  const draft = () => {
    dirty.current = false;
    return toDraft(values);
  };

  const goTo = (next: number) => {
    setFormError("");
    // Back (and "Edit" on the review step) slides in from the left.
    if (next < step) stepBack();
    setStep(next);
  };

  const next = async () => {
    if (!user) return;
    const fields = isLast ? (Object.keys(values) as OnboardingField[]) : onboardingStepFields[step];
    const invalid = fields.filter((name) => errors[name]);
    if (invalid.length) {
      setTouched((current) => ({
        ...current,
        ...Object.fromEntries(fields.map((name) => [name, true])),
      }));
      if (isLast) goTo(onboardingStepFields.findIndex((stepFields) => stepFields.some((name) => errors[name])));
      else document.getElementById(`onboarding-${invalid[0]}`)?.focus();
      return;
    }
    setSaving("next");
    try {
      if (isLast && parsed.success) {
        dirty.current = false;
        await authService.upsertMenteeProfile(user.id, parsed.data, {
          markOnboarded: true,
        });
        await refresh();
        go(safeRedirect() ?? "/mentors");
        return;
      }
      await authService.upsertMenteeProfile(user.id, draft());
      goTo(step + 1);
    } catch {
      setFormError(copy.errors.save);
    } finally {
      setSaving(null);
    }
  };

  const saveAndExit = async () => {
    if (!user) return;
    setSaving("exit");
    try {
      await authService.upsertMenteeProfile(user.id, draft());
      await refresh();
      close();
    } catch {
      setFormError(copy.errors.save);
      setSaving(null);
    }
  };

  return (
    <>
      {/* Progress runs along the card's top edge. */}
      <div
        className="absolute inset-x-0 top-0 h-1 bg-surface"
        role="progressbar"
        aria-label={copy.stepOf(step + 1, total)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full bg-brand transition-[width] duration-500 ease-out" style={{ width: `${percent}%` }} />
      </div>

      <AuthStep key={step}>
        <p className="mb-3 text-xs tracking-wide text-muted uppercase tabular-nums">{copy.stepOf(step + 1, total)}</p>
        <AuthHeading title={meta.title}>{meta.subtitle}</AuthHeading>

        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void next();
          }}
          className="mt-8 flex flex-col gap-5 text-left [@media(max-height:1000px)]:mt-5 [@media(max-height:1000px)]:gap-4"
        >
          {step === 0 && <StepWelcome profile={profile} values={values} set={set} field={field} />}
          {step === 1 && (
            <>
              <TextField
                {...field("headline")}
                label={copy.fields.headline.label}
                labelSuffix={copy.optional}
                placeholder={copy.fields.headline.placeholder}
                maxLength={onboardingLimits.headline}
                value={values.headline}
                onChange={(event) => set("headline", event.target.value)}
                hint={`${values.headline.length}/${onboardingLimits.headline}`}
              />
              <TextAreaField
                {...field("bio")}
                label={copy.fields.bio.label}
                labelSuffix={copy.optional}
                placeholder={copy.fields.bio.placeholder}
                maxLength={onboardingLimits.bio}
                value={values.bio}
                onChange={(event) => set("bio", event.target.value)}
              />
              <TextField
                {...field("organization_unit")}
                label={copy.fields.organization.label}
                labelSuffix={copy.optional}
                placeholder={copy.fields.organization.placeholder}
                maxLength={120}
                value={values.organization_unit}
                onChange={(event) => set("organization_unit", event.target.value)}
              />
            </>
          )}
          {step === 2 && (
            <>
              <TextAreaField
                {...field("goals")}
                label={copy.fields.goals.label}
                labelSuffix={copy.goalsMin}
                placeholder={copy.fields.goals.placeholder}
                maxLength={onboardingLimits.goals}
                value={values.goals}
                onChange={(event) => set("goals", event.target.value)}
              />
              <TextField
                {...field("academic_details")}
                label={copy.fields.academic.label}
                labelSuffix={copy.optional}
                placeholder={copy.fields.academic.placeholder}
                maxLength={onboardingLimits.academic}
                value={values.academic_details}
                onChange={(event) => set("academic_details", event.target.value)}
              />
            </>
          )}
          {step === 3 && (
            <ChipInput
              id="onboarding-interests"
              label={copy.fields.interests.label}
              placeholder={copy.fields.interests.placeholder}
              value={values.interests}
              onChange={(value) => {
                set("interests", value);
                blur("interests");
              }}
              suggestions={interestSuggestions}
              maxLength={onboardingLimits.chip}
              error={error("interests")}
              hint={copy.chips.count(values.interests.length, onboardingLimits.interestsMin)}
              copy={copy.chips}
            />
          )}
          {step === 4 && (
            <>
              <ChipInput
                id="onboarding-preferred_mentor_areas"
                label={copy.fields.areas.label}
                placeholder={copy.fields.areas.placeholder}
                value={values.preferred_mentor_areas}
                onChange={(value) => {
                  set("preferred_mentor_areas", value);
                  blur("preferred_mentor_areas");
                }}
                suggestions={areaSuggestions}
                maxLength={onboardingLimits.chip}
                error={error("preferred_mentor_areas")}
                copy={copy.chips}
              />
              {/* LinkedIn full width, GitHub and Portfolio side by side (keeps the step on one screen). */}
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-x-4 [@media(max-height:1000px)]:gap-4">
                {(["linkedin_url", "github_url", "portfolio_url"] as const).map((name) => {
                  const fieldCopy = copy.fields[name === "linkedin_url" ? "linkedin" : name === "github_url" ? "github" : "portfolio"];
                  return (
                    <div key={name} className={`min-w-0 ${name === "linkedin_url" ? "sm:col-span-2" : ""}`}>
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
                        labelSuffix={copy.optional}
                        placeholder={fieldCopy.placeholder}
                        value={values[name]}
                        onChange={(event) => set(name, event.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {step === 5 && <StepReview values={values} onEdit={goTo} />}

          <FormAlert>{formError}</FormAlert>

          {/* Pinned to the bottom of the screen when a step is taller than it (Review, links). */}
          <StickyActions className="-mt-2">
            <div className="flex gap-3">
              {step > 0 && (
                <button type="button" onClick={() => goTo(step - 1)} disabled={saving !== null} className={outlineButtonClasses()}>
                  ← {copy.back}
                </button>
              )}
              <SubmitButton loading={saving === "next"} loadingLabel={copy.saving} disabled={saving !== null} className="flex-1">
                {isLast ? copy.finish : `${copy.next} →`}
              </SubmitButton>
            </div>
          </StickyActions>
        </form>

        <p className="mt-3 text-sm [@media(max-height:1000px)]:mt-1">
          <button
            type="button"
            onClick={saveAndExit}
            disabled={saving !== null}
            className="text-ink underline-offset-4 hover:underline focus-visible:underline disabled:text-muted"
          >
            {saving === "exit" ? copy.saving : copy.saveExit}
          </button>
        </p>
      </AuthStep>
    </>
  );
}

type StepProps = {
  values: OnboardingValues;
  set: <K extends OnboardingField>(name: K, value: OnboardingValues[K]) => void;
  field: (name: OnboardingField) => {
    id: string;
    error?: string;
    onBlur: () => void;
  };
};

function StepWelcome({ profile, values, set, field }: StepProps & { profile: MenteeProfile }) {
  const { user, refresh } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const note = copy.emailNote(profile.email);

  const onFile = async (file: File | undefined) => {
    if (!file || !user) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) return setPhotoError(copy.photo.notImage);
    if (file.size > MAX_PHOTO_BYTES) return setPhotoError(copy.photo.tooLarge);
    setPhotoError("");
    setUploading(true);
    try {
      const url = await authService.uploadAvatar(file);
      await authService.upsertMenteeProfile(user.id, { avatar_url: url });
      await refresh();
    } catch {
      setPhotoError(copy.errors.save);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-5">
        <div className="relative">
          <Avatar name={values.full_name || profile.email} url={user?.avatar_url ?? null} className="size-20 text-2xl" />
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              <Spinner />
            </span>
          )}
        </div>
        <div>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className={outlineButtonClasses("disabled:opacity-60")}>
            {user?.avatar_url ? copy.photo.change : copy.photo.add}
          </button>
          <p className="mt-2 text-xs text-muted">{copy.photo.hint}</p>
          {photoError && <p className="mt-1 text-xs text-brand-dark">{photoError}</p>}
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            onChange={(event) => void onFile(event.target.files?.[0])}
          />
        </div>
      </div>
      <TextField
        {...field("full_name")}
        label={copy.fields.fullName.label}
        placeholder={copy.fields.fullName.placeholder}
        autoComplete="name"
        value={values.full_name}
        onChange={(event) => set("full_name", event.target.value)}
      />
      <p className="-mt-2 text-xs text-muted">
        {note.before} <span className="font-medium break-all text-ink">{note.email}</span> {note.after}
      </p>
    </>
  );
}

function StepReview({ values, onEdit }: { values: OnboardingValues; onEdit: (step: number) => void }) {
  const { review } = copy;
  const rows: {
    label: string;
    value: ReactNode;
    step: number;
    show: boolean;
    wide?: boolean;
  }[] = [
    { label: review.name, value: values.full_name, step: 0, show: true },
    {
      label: review.headline,
      value: values.headline,
      step: 1,
      show: Boolean(values.headline),
    },
    {
      label: review.organization,
      value: values.organization_unit,
      step: 1,
      show: Boolean(values.organization_unit),
    },
    {
      label: review.bio,
      value: values.bio,
      step: 1,
      show: Boolean(values.bio),
      wide: true,
    },
    {
      label: review.goals,
      value: values.goals,
      step: 2,
      show: true,
      wide: true,
    },
    {
      label: review.academic,
      value: values.academic_details,
      step: 2,
      show: Boolean(values.academic_details),
    },
    {
      label: review.interests,
      value: <Chips items={values.interests} />,
      step: 3,
      show: true,
    },
    {
      label: review.areas,
      value: <Chips items={values.preferred_mentor_areas} />,
      step: 4,
      show: true,
    },
    {
      label: review.linkedin,
      value: normaliseUrl(values.linkedin_url),
      step: 4,
      show: Boolean(values.linkedin_url),
    },
    {
      label: review.github,
      value: normaliseUrl(values.github_url),
      step: 4,
      show: Boolean(values.github_url),
    },
    {
      label: review.portfolio,
      value: normaliseUrl(values.portfolio_url),
      step: 4,
      show: Boolean(values.portfolio_url),
    },
  ];
  return (
    <dl className="grid border-t border-line sm:grid-cols-2 sm:gap-x-6">
      {/* Short answers pair up two per row; the long ones (bio, goals) follow at full width, so the grid has no gaps. */}
      {rows
        .filter((row) => row.show)
        .sort((a, b) => Number(Boolean(a.wide)) - Number(Boolean(b.wide)))
        .map((row) => (
          <div key={row.label} className={`min-w-0 border-b border-line py-3 ${row.wide ? "sm:col-span-2" : ""}`}>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-xs tracking-wide text-muted uppercase">{row.label}</dt>
              <dd>
                <button
                  type="button"
                  onClick={() => onEdit(row.step)}
                  aria-label={`${review.edit} ${row.label}`}
                  className="text-xs font-semibold text-ink underline-offset-4 hover:underline focus-visible:underline"
                >
                  {review.edit}
                </button>
              </dd>
            </div>
            {/* Long answers are previews here (3 lines); Edit opens the full text. */}
            <dd className={`mt-1 text-sm leading-relaxed break-words whitespace-pre-wrap text-ink ${row.wide ? "line-clamp-3" : ""}`}>{row.value}</dd>
          </div>
        ))}
    </dl>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="bg-surface px-2.5 py-1 text-xs text-ink">
          {item}
        </span>
      ))}
    </span>
  );
}
