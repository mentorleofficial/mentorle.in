"use client";

import { useState } from "react";
import { FieldLabel, FieldMessage, errorId, inputClasses } from "@/components/forms/fields";
import { COUNTRY_CODES, DEFAULT_COUNTRY } from "@/data/auth";

export const Chevron = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-muted" aria-hidden>
    <path d="M2.5 4.5L6 8l3.5-3.5" />
  </svg>
);

const byLongestDial = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);

// Value format matches the platform's PhoneInput: "+91 9876543210" ("" when no number is typed).
const parse = (value: string) => {
  const match = value.startsWith("+") ? byLongestDial.find((country) => value.startsWith(`${country.dial} `)) : undefined;
  return { code: match?.code ?? DEFAULT_COUNTRY, digits: match ? value.slice(match.dial.length + 1) : value.replace(/\D/g, "") };
};

type PhoneFieldProps = {
  id: string;
  label: string;
  countryLabel: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  labelHidden?: boolean;
};

export function PhoneField({ id, label, countryLabel, value, onChange, onBlur, error, labelHidden }: PhoneFieldProps) {
  const parsed = parse(value);
  // Kept in state because two countries share a dial code (+1 for US and Canada).
  const [code, setCode] = useState(parsed.code);
  const country = COUNTRY_CODES.find((item) => item.code === code) ?? COUNTRY_CODES[0];
  const emit = (dial: string, digits: string) => onChange(digits ? `${dial} ${digits}` : "");

  return (
    <div>
      <FieldLabel id={id} label={label} hidden={labelHidden} />
      <div className="flex">
        <div className="relative w-[5.5rem] shrink-0 has-[select:focus-visible]:z-10 has-[select:focus-visible]:outline-2 has-[select:focus-visible]:outline-brand">
          {/* The native select shows its long option text, so a short "IN +91" sits on top and the select is transparent. */}
          <span className={inputClasses(error, "pointer-events-none absolute inset-0 flex items-center border-r-0 pr-6")} aria-hidden>
            {country.code} {country.dial}
          </span>
          <select
            aria-label={countryLabel}
            value={code}
            onChange={(event) => {
              const next = COUNTRY_CODES.find((item) => item.code === event.target.value) ?? COUNTRY_CODES[0];
              setCode(next.code);
              emit(next.dial, parsed.digits);
            }}
            className="absolute inset-0 w-full cursor-pointer opacity-0"
          >
            {COUNTRY_CODES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name} ({item.dial})
              </option>
            ))}
          </select>
          <Chevron />
        </div>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder={labelHidden ? label : undefined}
          maxLength={15}
          value={parsed.digits}
          onChange={(event) => emit(country.dial, event.target.value.replace(/\D/g, ""))}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId(id) : undefined}
          className={inputClasses(error)}
        />
      </div>
      <FieldMessage id={id} error={error} />
    </div>
  );
}
