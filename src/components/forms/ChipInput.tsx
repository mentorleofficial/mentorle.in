"use client";

import { useState } from "react";
import { FieldLabel, FieldMessage, errorId, inputClasses, outlineButtonClasses } from "@/components/forms/fields";

type ChipInputProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
  suggestions: string[];
  maxLength: number;
  error?: string;
  hint?: string;
  copy: { add: string; remove: (value: string) => string; suggestions: string };
};

// Tag input ported from the platform's onboarding ChipInput: Enter or comma adds, Backspace on empty removes
// the last tag, duplicates (case-insensitive) are ignored, suggestions add with one click.
export function ChipInput({ id, label, placeholder, value, onChange, suggestions, maxLength, error, hint, copy }: ChipInputProps) {
  const [draft, setDraft] = useState("");
  const has = (item: string) => value.some((existing) => existing.toLowerCase() === item.toLowerCase());
  const add = (raw: string) => {
    const item = raw.trim().slice(0, maxLength);
    if (!item || has(item)) {
      setDraft("");
      return;
    }
    onChange([...value, item]);
    setDraft("");
  };
  const remaining = suggestions.filter((item) => !has(item));

  return (
    <div>
      <FieldLabel id={id} label={label} />
      <div className="flex gap-2">
        <input
          id={id}
          value={draft}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add(draft);
            } else if (event.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId(id) : undefined}
          className={inputClasses(error)}
        />
        <button
          type="button"
          onClick={() => add(draft)}
          className={outlineButtonClasses("h-[2.25rem] px-4")}
        >
          {copy.add}
        </button>
      </div>
      <FieldMessage id={id} error={error} hint={hint} />

      {value.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {value.map((item) => (
            <li key={item} className="flex items-center gap-1 bg-ink py-1 pr-1 pl-3 text-sm text-white">
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((existing) => existing !== item))}
                aria-label={copy.remove(item)}
                className="flex size-6 items-center justify-center text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-brand"
              >
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-3" aria-hidden>
                  <path d="M2 2l8 8M10 2l-8 8" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {remaining.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{copy.suggestions}</span>
          {remaining.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => add(item)}
              className="border border-line bg-white px-3 py-1 text-xs text-ink transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              + {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
