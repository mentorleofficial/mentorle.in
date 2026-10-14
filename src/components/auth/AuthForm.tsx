"use client";

import Link from "next/link";
import { useId, useState } from "react";
import type { FormEvent } from "react";
import { MIN_PASSWORD_LENGTH, authCopy, authMessages } from "@/data/auth";
import type { AuthField, AuthMode } from "@/data/auth";

type AuthFormProps = {
  mode: AuthMode;
  titleId: string;
  // Inside an intercepted modal the switch link is a soft navigation (stays a modal); on the standalone
  // /login and /signup pages it is a full navigation, so the next form isn't intercepted on top of this one.
  intercepted: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (field: AuthField, value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return authMessages.required(field.label);
  if (field.type === "email" && !EMAIL_PATTERN.test(trimmed)) return authMessages.email;
  if (field.type === "password" && value.length < MIN_PASSWORD_LENGTH) return authMessages.password;
  return "";
};

export function AuthForm({ mode, titleId, intercepted }: AuthFormProps) {
  const copy = authCopy[mode];
  const idPrefix = useId();
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const errorFor = (field: AuthField) => (touched[field.name] ? validate(field, values[field.name] ?? "") : "");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(Object.fromEntries(copy.fields.map((field) => [field.name, true])));
    const firstInvalid = copy.fields.find((field) => validate(field, values[field.name] ?? ""));
    if (firstInvalid) {
      document.getElementById(`${idPrefix}-${firstInvalid.name}`)?.focus();
      setSubmitted(false);
      return;
    }
    setSubmitted(true);
  };

  const switchClasses = "font-semibold text-ink underline-offset-4 hover:underline";

  return (
    <div className="text-center">
      <h1 id={titleId} className="text-[1.75rem] leading-tight font-medium text-ink md:text-[2rem]">
        {copy.title}
      </h1>
      <p className="mt-3 text-base text-ink">{copy.subtitle}</p>

      <form noValidate onSubmit={onSubmit} className="mx-auto mt-8 flex max-w-[20.625rem] flex-col text-left">
        {copy.fields.map((field) => {
          const id = `${idPrefix}-${field.name}`;
          const error = errorFor(field);
          return (
            <div key={field.name} className="mb-3">
              <label htmlFor={id} className="sr-only">
                {field.label}
              </label>
              <input
                id={id}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.label}
                value={values[field.name] ?? ""}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(event) => {
                  setValues((current) => ({ ...current, [field.name]: event.target.value }));
                  setSubmitted(false);
                }}
                onBlur={() => setTouched((current) => ({ ...current, [field.name]: true }))}
                className={`h-[2.25rem] w-full border bg-white px-2.5 text-sm text-ink transition-colors placeholder:text-ink/60 focus:outline-none ${
                  error ? "border-brand" : "border-line hover:border-ink/40 focus:border-ink"
                }`}
              />
              {error && (
                <p id={`${id}-error`} className="mt-1 text-xs text-brand-dark">
                  {error}
                </p>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          className="mt-3 h-[2.3125rem] w-full bg-brand text-sm text-white transition-colors duration-300 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {copy.submit}
        </button>

        <p role="status" aria-live="polite" className={submitted ? "mt-3 bg-surface px-3 py-2 text-center text-xs leading-snug text-ink" : "sr-only"}>
          {submitted ? authMessages.notConnected : ""}
        </p>
      </form>

      <p className="mt-6 text-sm text-ink">
        {copy.switchPrompt}{" "}
        {intercepted ? (
          <Link href={copy.switchHref} replace className={switchClasses}>
            {copy.switchLabel}
          </Link>
        ) : (
          <a href={copy.switchHref} className={switchClasses}>
            {copy.switchLabel}
          </a>
        )}
      </p>
    </div>
  );
}
