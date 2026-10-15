"use client";

import { useState } from "react";
import type { Ref } from "react";
import { errorId } from "@/components/forms/fields";

type OtpInputProps = {
  id: string;
  label: string;
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: string;
  ref?: Ref<HTMLInputElement>;
};

// One real input (so paste, SMS/email autofill and screen readers just work) drawn as square digit boxes.
export function OtpInput({ id, label, length, value, onChange, onComplete, error, ref }: OtpInputProps) {
  const [focused, setFocused] = useState(false);
  const active = Math.min(value.length, length - 1);

  return (
    <div className="relative mx-auto w-full max-w-[20.625rem]">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="grid gap-1.5 sm:gap-2" style={{ gridTemplateColumns: `repeat(${length}, minmax(0, 1fr))` }} aria-hidden>
        {Array.from({ length }, (_, index) => (
          <span
            key={index}
            className={`flex aspect-square max-h-[2.5rem] items-center justify-center border bg-white text-lg font-medium text-ink tabular-nums transition-colors ${
              error ? "border-brand" : focused && index === active ? "border-ink" : "border-line"
            }`}
          >
            {value[index] ?? (focused && index === active ? <span className="h-5 w-px animate-pulse bg-ink" /> : "")}
          </span>
        ))}
      </div>
      <input
        ref={ref}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\d*"
        maxLength={length}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(event) => {
          const next = event.target.value.replace(/\D/g, "").slice(0, length);
          onChange(next);
          if (next.length === length) onComplete?.(next);
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId(id) : undefined}
        className="absolute inset-0 h-full w-full cursor-text bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent"
      />
    </div>
  );
}
