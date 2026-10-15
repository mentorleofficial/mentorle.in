"use client";

import { Chevron } from "@/components/forms/PhoneField";
import { FieldMessage, errorId, inputClasses } from "@/components/forms/fields";
import { MONTHS } from "@/data/auth";

type DateFieldProps = {
  id: string;
  legend: string;
  labels: { day: string; month: string; year: string };
  // ISO "YYYY-MM-DD"; partially filled values keep empty parts ("2001--09"), "" when nothing is chosen.
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  minYear: number;
  maxYear: number;
};

// Three selects instead of <input type="date">: consistent across browsers and quick to fill on phones.
export function DateField({ id, legend, labels, value, onChange, onBlur, error, minYear, maxYear }: DateFieldProps) {
  const [year = "", month = "", day = ""] = value ? value.split("-") : [];
  const set = (next: { year?: string; month?: string; day?: string }) => {
    const parts = { year, month, day, ...next };
    onChange(parts.year || parts.month || parts.day ? `${parts.year}-${parts.month}-${parts.day}` : "");
  };
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => String(maxYear - index));
  const select = (name: "day" | "month" | "year", current: string, options: { value: string; label: string }[], width: string) => (
    <div className={`relative ${width}`}>
      <select
        id={name === "day" ? id : `${id}-${name}`}
        aria-label={`${legend}: ${labels[name]}`}
        value={current}
        onChange={(event) => set({ [name]: event.target.value })}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId(id) : undefined}
        className={inputClasses(error, `cursor-pointer appearance-none pr-6 ${current ? "" : "text-ink/55"}`)}
      >
        <option value="">{labels[name]}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-ink">
            {option.label}
          </option>
        ))}
      </select>
      <Chevron />
    </div>
  );

  return (
    // Validate only when focus leaves the whole group, not when moving from Day to Month.
    <fieldset
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onBlur?.();
      }}
    >
      <legend className="mb-1.5 text-left text-xs text-muted">{legend}</legend>
      <div className="flex gap-2">
        {select("day", day, Array.from({ length: 31 }, (_, index) => ({ value: String(index + 1).padStart(2, "0"), label: String(index + 1) })), "w-[4.5rem] shrink-0")}
        {select("month", month, MONTHS.map((label, index) => ({ value: String(index + 1).padStart(2, "0"), label })), "min-w-0 flex-1")}
        {select("year", year, years.map((item) => ({ value: item, label: item })), "w-[5.25rem] shrink-0")}
      </div>
      <FieldMessage id={id} error={error} />
    </fieldset>
  );
}
