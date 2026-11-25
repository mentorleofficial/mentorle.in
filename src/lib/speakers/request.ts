"use client";

import { z } from "zod";
import { speakerRequestCopy as copy } from "@/data/speakers";
import { EMAIL_PATTERN, validPhone } from "@/lib/auth/schema";
import { browserSupabase } from "@/lib/supabase/browser";

// Speaker requests (/speaker-hub/request) → the platform's submit_speaker_request() (public; it checks the fields
// again, limits repeat requests and notifies admins, who handle them on Admin → Speaker requests).

const choice = (values: readonly { value: string }[]) => z.string().refine((value) => values.some((item) => item.value === value), copy.errors.choose);
const todayIso = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export const speakerRequestSchema = z
  .object({
    speaker: z.string(),
    name: z.string().trim().min(2, copy.errors.name).max(100, copy.errors.name),
    email: z.string().trim().max(255, copy.errors.email).regex(EMAIL_PATTERN, copy.errors.email),
    phone: z.string().trim().refine((value) => value === "" || validPhone(value), copy.errors.phone),
    organization: z.string().trim().min(2, copy.errors.organization).max(150, copy.errors.organization),
    eventName: z.string().trim().min(2, copy.errors.eventName).max(150, copy.errors.eventName),
    eventType: choice(copy.eventTypes),
    eventDate: z.string().refine((value) => value === "" || value >= todayIso(), copy.errors.pastDate),
    audienceSize: choice(copy.audienceSizes),
    format: choice(copy.formats),
    city: z.string().trim().max(100),
    message: z.string().trim().max(2000),
  })
  .refine((values) => values.format === "online" || values.city.length >= 2, { message: copy.errors.city, path: ["city"] });

export type SpeakerRequest = z.infer<typeof speakerRequestSchema>;

export class SpeakerRequestError extends Error {
  constructor(public code: "rate_limited" | "invalid_email" | "past_date" | "unknown") {
    super(code);
  }
}

export async function submitSpeakerRequest(values: SpeakerRequest, speakerName: string | null) {
  const { error } = await browserSupabase().rpc("submit_speaker_request", {
    _name: values.name,
    _email: values.email,
    _phone: values.phone || null,
    _organization: values.organization,
    _event_name: values.eventName,
    _event_type: values.eventType,
    _event_date: values.eventDate || null,
    _audience_size: values.audienceSize,
    _format: values.format,
    _city: values.format === "online" ? null : values.city,
    _message: values.message || null,
    _speaker_slug: values.speaker || null,
    _speaker_name: speakerName,
  });
  if (!error) return;
  if (error.hint === "rate_limited") throw new SpeakerRequestError("rate_limited");
  if (/email/i.test(error.message)) throw new SpeakerRequestError("invalid_email");
  if (/past/i.test(error.message)) throw new SpeakerRequestError("past_date");
  throw new SpeakerRequestError("unknown");
}
