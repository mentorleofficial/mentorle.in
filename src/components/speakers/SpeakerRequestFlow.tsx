"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { AuthHeading, AuthStep } from "@/components/auth/AuthStep";
import { PhoneField } from "@/components/forms/PhoneField";
import { FormAlert, SelectField, SubmitButton, TextAreaField, TextField, outlineButtonClasses } from "@/components/forms/fields";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { StickyActions } from "@/components/ui/StickyActions";
import { speakerRequestCopy as copy, speakers } from "@/data/speakers";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useZodForm } from "@/lib/forms/useZodForm";
import { SpeakerRequestError, speakerRequestSchema, submitSpeakerRequest } from "@/lib/speakers/request";

const EMPTY = { speaker: "", name: "", email: "", phone: "", organization: "", eventName: "", eventType: "", eventDate: "", audienceSize: "", format: "", city: "", message: "" };
type Field = keyof typeof EMPTY;
const STEP_FIELDS: Field[][] = [
  ["speaker", "eventName", "eventType", "format", "city", "eventDate", "audienceSize"],
  ["name", "email", "phone", "organization", "message"],
];
const MESSAGE_MAX = 2000;

// The speaker request, in the auth modal's card: 1. the event (and which speaker, from ?speaker=<slug> or "match me"),
// 2. the organiser's contact details, then "Request sent". Sent to the platform, which notifies admins.
export function SpeakerRequestFlow() {
  const requested = useSearchParams().get("speaker") ?? "";
  const { close, stepBack } = useAuthModal();
  const { status, user } = useAuth();
  const initial = { ...EMPTY, speaker: speakers.some((s) => s.slug === requested) ? requested : "" };
  const form = useZodForm(speakerRequestSchema, initial, "speaker-request");
  const [step, setStep] = useState(0);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const prefilled = useRef(false);

  // Next keeps a closed modal mounted (hidden) and reopens the same instance, whose form was set up from the page
  // underneath; follow the speaker in the link that opened it.
  const appliedSpeaker = useRef(initial.speaker);
  useEffect(() => {
    if (requested === appliedSpeaker.current || !speakers.some((s) => s.slug === requested)) return;
    appliedSpeaker.current = requested;
    queueMicrotask(() => form.setValue("speaker", requested));
  }, [requested, form]);

  // Signed-in visitors: start with their name and email.
  useEffect(() => {
    if (status !== "signed-in" || !user || prefilled.current) return;
    prefilled.current = true;
    queueMicrotask(() => {
      if (!form.values.name) form.setValue("name", user.full_name ?? "");
      if (!form.values.email) form.setValue("email", user.email ?? "");
    });
  }, [status, user, form]);

  const total = STEP_FIELDS.length;
  const percent = sentTo ? 100 : Math.round(((step + 1) / total) * 100);

  const back = () => {
    setFormError("");
    stepBack();
    setStep(0);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (step === 0) {
      // The city rule spans two fields, so the schema only checks it once everything else is valid: check it here.
      const needsCity = form.values.format !== "online" && form.values.city.trim().length < 2;
      if (!form.validate(STEP_FIELDS[0])) return;
      if (needsCity) return form.setError("city", copy.errors.city);
      setStep(1);
      return;
    }
    if (!form.validate(STEP_FIELDS[1])) return;
    const values = form.submit();
    if (!values) {
      back();
      return;
    }
    setSending(true);
    try {
      await submitSpeakerRequest(values, speakers.find((s) => s.slug === values.speaker)?.name ?? null);
      setSentTo(values.email.trim());
    } catch (caught) {
      const code = caught instanceof SpeakerRequestError ? caught.code : "unknown";
      if (code === "invalid_email") form.setError("email", copy.errors.email);
      else if (code === "past_date") {
        back();
        setTimeout(() => form.setError("eventDate", copy.errors.pastDate));
      } else setFormError(code === "rate_limited" ? copy.errors.rateLimited : copy.errors.generic);
    } finally {
      setSending(false);
    }
  };

  const progress = (
    <div className="absolute inset-x-0 top-0 h-1 bg-surface" role="progressbar" aria-label={copy.stepOf(Math.min(step + 1, total), total)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <div className="h-full bg-brand transition-[width] duration-500 ease-out" style={{ width: `${percent}%` }} />
    </div>
  );

  if (sentTo)
    return (
      <>
        {progress}
        <AuthStep key="sent">
          <span className="mx-auto flex size-12 items-center justify-center bg-brand text-white" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          <div className="mt-6" role="status">
            <AuthHeading title={copy.sent.title}>{copy.sent.body(sentTo)}</AuthHeading>
          </div>
          <div className="mx-auto mt-8 flex max-w-[20.625rem] flex-col gap-3">
            <button type="button" onClick={close} className={buttonClasses("brand", "w-full")}>
              {copy.sent.done}
            </button>
            <button
              type="button"
              onClick={() => {
                for (const name of Object.keys(EMPTY) as Field[]) if (!["name", "email", "phone", "organization"].includes(name)) form.setValue(name, initial[name]);
                setSentTo(null);
                setStep(0);
              }}
              className={outlineButtonClasses("w-full")}
            >
              {copy.sent.another}
            </button>
          </div>
        </AuthStep>
      </>
    );

  const field = form.field;
  const f = copy.fields;
  const meta = copy.steps[step];
  return (
    <>
      {progress}
      <AuthStep key={step}>
        <p className="mb-3 text-xs tracking-wide text-muted uppercase tabular-nums">{copy.stepOf(step + 1, total)}</p>
        <AuthHeading title={meta.title}>{meta.subtitle}</AuthHeading>

        <form noValidate onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 text-left [@media(max-height:1000px)]:mt-5">
          {step === 0 ? (
            <>
              <SelectField
                {...field("speaker")}
                label={f.speaker}
                value={form.values.speaker}
                onChange={(value) => form.setValue("speaker", value)}
                options={[{ value: "", label: f.anySpeaker }, ...speakers.map((s) => ({ value: s.slug, label: `${s.name} · ${s.role}` }))]}
              />
              <TextField {...field("eventName")} label={f.eventName} value={form.values.eventName} onChange={(e) => form.setValue("eventName", e.target.value)} />
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField {...field("eventType")} label={f.eventType} placeholder={f.choose} options={copy.eventTypes} value={form.values.eventType} onChange={(value) => form.setValue("eventType", value)} />
                <SelectField {...field("audienceSize")} label={f.audienceSize} placeholder={f.choose} options={copy.audienceSizes} value={form.values.audienceSize} onChange={(value) => form.setValue("audienceSize", value)} />
                <SelectField {...field("format")} label={f.format} placeholder={f.choose} options={copy.formats} value={form.values.format} onChange={(value) => form.setValue("format", value)} />
                <TextField {...field("eventDate")} label={f.eventDate} labelSuffix={f.eventDateSuffix} type="date" value={form.values.eventDate} onChange={(e) => form.setValue("eventDate", e.target.value)} />
              </div>
              {form.values.format !== "online" && (
                <TextField {...field("city")} label={f.city} labelSuffix={f.citySuffix} autoComplete="address-level2" value={form.values.city} onChange={(e) => form.setValue("city", e.target.value)} />
              )}
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField {...field("name")} label={f.name} autoComplete="name" value={form.values.name} onChange={(e) => form.setValue("name", e.target.value)} />
                <TextField {...field("email")} label={f.email} type="email" autoComplete="email" value={form.values.email} onChange={(e) => form.setValue("email", e.target.value)} />
              </div>
              <TextField
                {...field("organization")}
                label={f.organization}
                autoComplete="organization"
                hint={f.organizationHint}
                value={form.values.organization}
                onChange={(e) => form.setValue("organization", e.target.value)}
              />
              <div>
                <p className="mb-1.5 text-sm font-medium text-ink">
                  {f.phone} <span className="font-normal text-muted">{f.phoneSuffix}</span>
                </p>
                <PhoneField {...field("phone")} label={f.phone} countryLabel={f.country} labelHidden value={form.values.phone} onChange={(value) => form.setValue("phone", value)} />
              </div>
              <TextAreaField
                {...field("message")}
                label={f.message}
                labelSuffix={f.messageSuffix}
                placeholder={f.messagePlaceholder}
                maxLength={MESSAGE_MAX}
                value={form.values.message}
                onChange={(e) => form.setValue("message", e.target.value)}
              />
              <p className="text-sm text-ink-soft">
                {copy.privacy.before}{" "}
                <Link href={copy.privacy.href} className="font-medium text-ink underline underline-offset-2">
                  {copy.privacy.link}
                </Link>
                {copy.privacy.after}
              </p>
            </>
          )}

          <FormAlert>{formError}</FormAlert>

          <StickyActions className="-mt-1">
            <div className="flex gap-3">
              {step > 0 && (
                <button type="button" onClick={back} disabled={sending} className={outlineButtonClasses()}>
                  {copy.back}
                </button>
              )}
              <SubmitButton loading={sending} loadingLabel={copy.submitting} className="flex-1">
                {step === 0 ? copy.next : copy.submit}
              </SubmitButton>
            </div>
          </StickyActions>
        </form>
      </AuthStep>
    </>
  );
}
