"use client";

import { authService } from "@/lib/auth/service";
import { browserSupabase } from "@/lib/supabase/browser";

// The mentee's resume, stored like the platform's uploadMenteeResume: resumes/<user id>/<time>.<ext> in the
// private `mentee-resumes` bucket, with the file's storage URL in mentee_profiles.resume_url (the platform's
// format, so both sites read the same value). The bucket is private, so viewing makes a short-lived signed link.

const BUCKET = "mentee-resumes";
export const RESUME_MAX_BYTES = 10 * 1024 * 1024;
export const RESUME_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
export const RESUME_ACCEPT = ".pdf,.doc,.docx";

const db = () => browserSupabase();

// "…/object/public/mentee-resumes/resumes/<id>/<file>" (or a bare path) → "resumes/<id>/<file>".
export const resumePath = (url: string) => {
  const marker = `/${BUCKET}/`;
  const index = url.indexOf(marker);
  return decodeURIComponent((index >= 0 ? url.slice(index + marker.length) : url).split("?")[0]);
};

// "1792…-asha-verma-cv.pdf" → "asha-verma-cv.pdf" (files uploaded on the platform are just "<time>.pdf").
export const resumeFileName = (url: string) => (resumePath(url).split("/").pop() ?? "").replace(/^\d{10,}-/, "");

// A storage-safe version of the original name, so the card can show it.
const safeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "resume";

export const resumeService = {
  async upload(userId: string, file: File, previous: string | null) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const path = `resumes/${userId}/${Date.now()}-${safeName(file.name)}.${ext}`;
    const { error } = await db().storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: true });
    if (error) throw new Error(`resume upload failed: ${error.message}`);
    const url = db().storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    await authService.upsertMenteeProfile(userId, { resume_url: url });
    // The old file isn't referenced any more.
    if (previous) await db().storage.from(BUCKET).remove([resumePath(previous)]);
    return url;
  },

  async signedUrl(url: string) {
    const { data, error } = await db().storage.from(BUCKET).createSignedUrl(resumePath(url), 600);
    if (error || !data) throw new Error(`resume link failed: ${error?.message}`);
    return data.signedUrl;
  },

  async remove(userId: string, url: string) {
    await authService.upsertMenteeProfile(userId, { resume_url: null });
    await db().storage.from(BUCKET).remove([resumePath(url)]);
  },
};
