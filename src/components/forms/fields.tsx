"use client";

import { useState } from "react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

// Form primitives shared by the auth modal and the onboarding wizard. Sizes follow the login/signup Figma:
// square 36px fields with a `line` border, 14px text; errors turn the border brand with a 12px message.

export const inputClasses = (error?: string, extra = "") =>
  `h-[2.25rem] w-full min-w-0 rounded-none border bg-white px-2.5 text-sm text-ink transition-colors placeholder:text-ink/55 focus:outline-none disabled:bg-surface disabled:text-muted ${
    error ? "border-brand" : "border-line hover:border-ink/40 focus:border-ink"
  } ${extra}`;

// Secondary action on white surfaces (Back, Add, Add a photo).
export const outlineButtonClasses = (extra = "") =>
  `inline-flex h-[2.3125rem] shrink-0 items-center justify-center gap-1.5 border border-ink bg-white px-[1.125rem] text-sm text-ink transition-colors duration-300 hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none ${extra}`;

export const errorId = (id: string) => `${id}-error`;

export function FieldMessage({ id, error, hint }: { id: string; error?: string; hint?: ReactNode }) {
  if (error) {
    return (
      <p id={errorId(id)} className="mt-1 text-left text-xs text-brand-dark">
        {error}
      </p>
    );
  }
  return hint ? <p className="mt-1 text-left text-xs text-muted">{hint}</p> : null;
}

type LabelProps = { id: string; label: string; hidden?: boolean; suffix?: ReactNode; aside?: ReactNode };

export function FieldLabel({ id, label, hidden, suffix, aside }: LabelProps) {
  if (hidden) {
    return (
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
    );
  }
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label} {suffix && <span className="font-normal text-muted">{suffix}</span>}
      </label>
      {aside}
    </div>
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  // Auth cards use the placeholder as the visible label (per the Figma); onboarding shows labels.
  labelHidden?: boolean;
  labelSuffix?: ReactNode;
  error?: string;
  hint?: ReactNode;
  trailing?: ReactNode;
};

export function TextField({ id, label, labelHidden, labelSuffix, error, hint, trailing, className = "", ...input }: TextFieldProps) {
  return (
    <div className={className}>
      <FieldLabel id={id} label={label} hidden={labelHidden} suffix={labelSuffix} />
      <div className="relative">
        <input
          id={id}
          placeholder={labelHidden ? label : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId(id) : undefined}
          {...input}
          className={inputClasses(error, trailing ? "pr-10" : "")}
        />
        {trailing}
      </div>
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}

type PasswordFieldProps = Omit<TextFieldProps, "type" | "trailing"> & { showLabel: string; hideLabel: string };

export function PasswordField({ showLabel, hideLabel, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-[1.125rem]" aria-hidden>
            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
            {visible && <path d="M3 3l18 18" />}
          </svg>
        </button>
      }
    />
  );
}

type TextAreaFieldProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  id: string;
  label: string;
  labelSuffix?: ReactNode;
  error?: string;
  hint?: ReactNode;
  maxLength: number;
  value: string;
};

export function TextAreaField({ id, label, labelSuffix, error, hint, className = "", maxLength, value, ...textarea }: TextAreaFieldProps) {
  return (
    <div className={className}>
      <FieldLabel
        id={id}
        label={label}
        suffix={labelSuffix}
        aside={
          <span className="text-xs text-muted tabular-nums" aria-hidden>
            {value.length}/{maxLength}
          </span>
        }
      />
      <textarea
        id={id}
        rows={4}
        maxLength={maxLength}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId(id) : undefined}
        {...textarea}
        className={inputClasses(error, "h-auto resize-y py-2 leading-relaxed")}
      />
      <FieldMessage id={id} error={error} hint={hint} />
    </div>
  );
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "children"> & {
  id: string;
  children: ReactNode;
  error?: string;
};

export function Checkbox({ id, children, error, className = "", ...input }: CheckboxProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-2.5 text-left">
        <span className="relative mt-px flex size-4 shrink-0">
          <input
            id={id}
            type="checkbox"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId(id) : undefined}
            {...input}
            className={`peer size-4 cursor-pointer appearance-none border bg-white transition-colors checked:border-brand checked:bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              error ? "border-brand" : "border-line hover:border-ink/40"
            }`}
          />
          <svg viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2" className="pointer-events-none absolute inset-0 hidden size-4 peer-checked:block" aria-hidden>
            <path d="M3.5 8.5l3 3 6-7" />
          </svg>
        </span>
        <label htmlFor={id} className="cursor-pointer text-xs leading-snug text-ink">
          {children}
        </label>
      </div>
      <FieldMessage id={id} error={error} />
    </div>
  );
}

// Form-level message (wrong password, wrong code…). `tone="info"` for neutral notices.
export function FormAlert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "info" }) {
  if (!children) return null;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`px-3 py-2 text-left text-xs leading-snug ${
        tone === "error" ? "border border-brand/40 bg-brand/5 text-brand-dark" : "bg-surface text-ink"
      }`}
    >
      {children}
    </p>
  );
}

export function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-4 animate-spin" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

type SubmitButtonProps = { loading: boolean; loadingLabel: string; children: ReactNode; className?: string; type?: "submit" | "button"; onClick?: () => void; disabled?: boolean };

// Full-width brand button from the login/signup Figma (37px tall, 14px text).
export function SubmitButton({ loading, loadingLabel, children, className = "", type = "submit", onClick, disabled }: SubmitButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      aria-busy={loading}
      className={`flex h-[2.3125rem] w-full items-center justify-center gap-2 whitespace-nowrap bg-brand px-4 text-sm text-white transition-colors duration-300 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-brand ${className}`}
    >
      {loading ? (
        <>
          <Spinner />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
