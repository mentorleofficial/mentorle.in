// Shapes mirror the Mentorle platform's Supabase tables (users, mentee_profiles); ./service.ts reads and
// writes them.

export type AppRole = "admin" | "mentor" | "mentee";

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: AppRole; // mentorle.in is for mentees; mentor and admin accounts are sent to the platform
  avatar_url: string | null;
};

export type Session = { user: AuthUser };

export type SignUpInput = {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  // date_of_birth is a mentee_profiles column; terms_accepted_at is kept on the auth user's metadata as the
  // consent record (SPEC-VS-DESIGN A1, A5). Signup asks for no marketing consent: service emails (reminders,
  // bookings) need none, and mentee_profiles.marketing_opt_in stays false until a mentee opts in later.
  date_of_birth: string;
  terms_accepted_at: string;
};

export type OtpType = "signup" | "recovery";

// Platform: features/mentee-onboarding/api.ts MenteeProfileData (core fields used by the wizard).
export type MenteeProfile = {
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  phone: string | null;
  headline: string;
  bio: string;
  organization_unit: string;
  goals: string;
  academic_details: string;
  interests: string[];
  preferred_mentor_areas: string[];
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  // The platform's format: a storage URL into the private mentee-resumes bucket (opened with a signed link).
  resume_url: string | null;
  onboarded_at: string | null;
};

export type MenteeProfileUpdate = Partial<Omit<MenteeProfile, "user_id" | "email" | "onboarded_at">>;

export type AuthErrorCode =
  | "email_taken"
  | "invalid_credentials"
  | "email_not_confirmed"
  | "otp_invalid"
  | "weak_password"
  | "same_password"
  | "rate_limited"
  | "not_signed_in"
  | "unknown";

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message = code) {
    super(message);
    this.code = code;
  }
}
