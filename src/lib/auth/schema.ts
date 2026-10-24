import { z } from "zod";
import { MAX_PASSWORD_LENGTH, MIN_AGE, MIN_PASSWORD_LENGTH, OTP_LENGTH, authErrors } from "@/data/auth";
import { onboardingCopy, onboardingLimits } from "@/data/onboarding";

// Validation rules ported from the Mentorle platform (MenteeSignupForm, ForgotPassword, mentee-onboarding/schema)
// plus the spec's 18+ date-of-birth gate and required consent.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESERVED_NAMES = ["admin", "mentor", "mentee"];

const email = z.string().trim().max(255, authErrors.email).regex(EMAIL_PATTERN, authErrors.email);

const newPassword = z
  .string()
  .min(1, authErrors.passwordShort)
  .min(MIN_PASSWORD_LENGTH, authErrors.passwordShort)
  .max(MAX_PASSWORD_LENGTH, authErrors.passwordLong);

// Stored as "+91 9876543210" like the platform. India needs 10 digits; other countries 4–15 (platform rule).
export const validPhone = (value: string) => {
  const match = value.match(/^\+(\d{1,4})\s(\d+)$/);
  if (!match) return false;
  const digits = match[2];
  if (match[1] === "91") return /^[6-9]\d{9}$/.test(digits);
  return digits.length >= 4 && digits.length <= 15;
};

// Age in whole years on `today` for an ISO "YYYY-MM-DD" birth date; null when the date doesn't exist.
export const ageOn = (iso: string, today = new Date()) => {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  let age = today.getFullYear() - year;
  if (today.getMonth() < month - 1 || (today.getMonth() === month - 1 && today.getDate() < day)) age -= 1;
  return age;
};

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, authErrors.fullNameRequired)
    .max(100, authErrors.fullNameLong)
    .refine((value) => !RESERVED_NAMES.includes(value.toLowerCase()), authErrors.fullNameReserved),
  email,
  phone: z.string().trim().min(1, authErrors.phone).refine(validPhone, authErrors.phone),
  dateOfBirth: z.string().superRefine((value, ctx) => {
    if (!value || value.includes("--") || value.startsWith("-") || value.endsWith("-")) {
      ctx.addIssue({ code: "custom", message: authErrors.dob });
      return;
    }
    const age = ageOn(value);
    if (age === null || age < 0 || age > 120) ctx.addIssue({ code: "custom", message: authErrors.dobInvalid });
    else if (age < MIN_AGE) ctx.addIssue({ code: "custom", message: authErrors.underAge });
  }),
  password: newPassword,
  terms: z.boolean().refine(Boolean, authErrors.terms),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, authErrors.passwordRequired),
});

export const forgotSchema = z.object({ email });

export const otpSchema = z.string().regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), authErrors.otp);

// Setting a new password from the email link (no code to type).
export const newPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string().min(1, authErrors.passwordMismatch),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: authErrors.passwordMismatch,
    path: ["confirmPassword"],
  });

export const resetSchema = z
  .object({
    otp: otpSchema,
    password: newPassword,
    confirmPassword: z.string().min(1, authErrors.passwordMismatch),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: authErrors.passwordMismatch,
    path: ["confirmPassword"],
  });

// --- Onboarding ---------------------------------------------------------------------------------------

// Platform behaviour: trim, drop trailing slashes, add https:// when missing.
export const normaliseUrl = (value: string) => {
  const clean = value.trim().replace(/\/+$/, "");
  if (!clean) return "";
  return /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
};

const isUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const { errors } = onboardingCopy;
const optionalUrl = (test: (url: string) => boolean, message: string) =>
  z
    .string()
    .transform(normaliseUrl)
    .refine((url) => !url || (isUrl(url) && test(url)), message);

const chips = (min: number, max: number, minMessage: string, maxMessage: string) =>
  z.array(z.string().trim().min(1).max(onboardingLimits.chip)).min(min, minMessage).max(max, maxMessage);

export const onboardingSchema = z.object({
  full_name: z.string().trim().min(2, errors.fullName).max(120, errors.fullName),
  headline: z.string().trim().max(onboardingLimits.headline, errors.headline),
  bio: z.string().trim().max(onboardingLimits.bio, errors.bio),
  organization_unit: z.string().trim().max(120),
  goals: z.string().trim().min(onboardingLimits.goalsMin, errors.goals).max(onboardingLimits.goals),
  academic_details: z.string().trim().max(onboardingLimits.academic),
  interests: chips(onboardingLimits.interestsMin, onboardingLimits.interestsMax, errors.interests, errors.interestsMax),
  preferred_mentor_areas: chips(onboardingLimits.areasMin, onboardingLimits.areasMax, errors.areas, errors.areasMax),
  linkedin_url: optionalUrl((url) => /linkedin\.com\/(in|pub)\//i.test(url), errors.linkedin),
  github_url: optionalUrl((url) => /github\.com\//i.test(url), errors.github),
  portfolio_url: optionalUrl(() => true, errors.portfolio),
});

export type OnboardingValues = z.input<typeof onboardingSchema>;
export type OnboardingField = keyof OnboardingValues;

// Fields validated before leaving each wizard step (the review step validates everything).
export const onboardingStepFields: OnboardingField[][] = [
  ["full_name"],
  ["headline", "bio", "organization_unit"],
  ["goals", "academic_details"],
  ["interests"],
  ["preferred_mentor_areas", "linkedin_url", "github_url", "portfolio_url"],
  [],
];

// First error message per field, from a zod error.
export const fieldErrors = (error: z.ZodError) => {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (!(key in result)) result[key] = issue.message;
  }
  return result;
};
