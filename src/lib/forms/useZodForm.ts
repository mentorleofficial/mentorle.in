"use client";

import { useState } from "react";
import type { z } from "zod";
import { fieldErrors } from "@/lib/auth/schema";

// Minimal form state for zod schemas: errors show once a field is blurred or the form is submitted
// (the platform's react-hook-form `mode: "onBlur"`), and server errors stay until that field changes.
export function useZodForm<Values extends Record<string, unknown>, Output>(schema: z.ZodType<Output, Values>, initial: Values, idPrefix: string) {
  type Name = keyof Values & string;
  const [values, setValues] = useState<Values>(initial);
  const [touched, setTouched] = useState<Partial<Record<Name, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Partial<Record<Name, string>>>({});

  const parsed = schema.safeParse(values);
  const validationErrors = parsed.success ? {} : fieldErrors(parsed.error);

  const error = (name: Name) => serverErrors[name] ?? (touched[name] ? validationErrors[name] : undefined);

  const setValue = <K extends Name>(name: K, value: Values[K]) => {
    setValues((current) => ({ ...current, [name]: value }));
    setServerErrors((current) => ({ ...current, [name]: undefined }));
  };

  const blur = (name: Name) => setTouched((current) => ({ ...current, [name]: true }));

  const setError = (name: Name, message: string) => {
    setServerErrors((current) => ({ ...current, [name]: message }));
    document.getElementById(`${idPrefix}-${name}`)?.focus();
  };

  // Validates everything; focuses the first invalid field and returns null, or returns the parsed output.
  const submit = (): Output | null => {
    setTouched(Object.fromEntries(Object.keys(values).map((name) => [name, true])) as Partial<Record<Name, boolean>>);
    if (parsed.success) return parsed.data;
    const first = Object.keys(values).find((name) => name in validationErrors);
    if (first) document.getElementById(`${idPrefix}-${first}`)?.focus();
    return null;
  };

  const field = (name: Name) => ({ id: `${idPrefix}-${name}`, error: error(name), onBlur: () => blur(name) });

  return { values, setValue, error, setError, submit, field };
}
