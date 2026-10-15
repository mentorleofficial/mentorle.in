// Shapes mirror the Mentorle platform's Supabase tables (users, mentee_profiles) so the mock service in
// ./service.ts can later be swapped for the real database without touching the screens.

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: "mentee";
  avatar_url: string | null;
};

export type Session = { user: AuthUser };

export type SignUpInput = {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  // Not yet columns on the platform: the spec's 18+ gate and DPDP consent record (SPEC-VS-DESIGN A1, A5).
  date_of_birth: string;
  terms_accepted_at: string;
  marketing_opt_in: boolean;
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
  onboarded_at: string | null;
};

export type MenteeProfileUpdate = Partial<Omit<MenteeProfile, "user_id" | "email" | "onboarded_at">>;

export type AuthErrorCode =
  | "email_taken"
  | "invalid_credentials"
  | "email_not_confirmed"
  | "otp_invalid"
  | "not_signed_in"
  | "unknown";

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode, message = code) {
    super(message);
    this.code = code;
  }
}
