// Copy for the login, signup and forgot-password modals. The flows mirror the Mentorle platform's mentee
// auth (../Mentorle-Version2): email + password, an 8-digit email code to verify signup and password resets.
// Only the first login and signup screens have a Figma design; the other screens extend that card's style
// (logged in SPEC-VS-DESIGN).

export type AuthMode = "login" | "signup" | "forgot" | "reset" | "onboarding";

export const OTP_LENGTH = 8;
export const RESEND_SECONDS = 60;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72;
export const MIN_AGE = 18;

export const authCopy = {
  login: {
    title: "Welcome Back",
    subtitle: "Log in to manage your mentorship journey.",
    submit: "Log In",
    submitting: "Logging in…",
    forgot: "Forgot password?",
    switchPrompt: "Don’t have an account?",
    switchLabel: "Sign up",
    switchHref: "/signup",
  },
  signup: {
    title: "Create an Account",
    subtitle: "Join the network of ambitious builders.",
    submit: "Sign Up",
    submitting: "Creating account…",
    switchPrompt: "Already have an account?",
    switchLabel: "Log in",
    switchHref: "/login",
    // Spec additions (DOB gate, consent) — not in the Figma, logged in SPEC-VS-DESIGN.
    dobLabel: "Date of birth",
    passwordHint: `At least ${MIN_PASSWORD_LENGTH} characters.`,
    terms: {
      before: "I agree to Mentorle’s",
      terms: { label: "Terms", href: "/terms" },
      and: "and",
      privacy: { label: "Privacy Policy", href: "/privacy" },
    },
  },
  verify: {
    title: "Verify your email",
    subtitle: (email: string) => ({ before: `Enter the ${OTP_LENGTH}-digit code we sent to`, email }),
    submit: "Verify & Continue",
    submitting: "Verifying…",
    resendPrompt: "Didn’t receive it?",
    resend: "Resend code",
    resendIn: (seconds: number) => `Resend in ${seconds}s`,
    resent: "A new code is on its way.",
    edit: "Edit email",
    codeLabel: "Verification code",
  },
  welcome: {
    title: "You’re in!",
    subtitle: "Your email is verified. Let’s set up your profile so mentors get to know you.",
    cta: "Set up my profile",
  },
  forgot: {
    title: "Forgot Password",
    subtitle: "Enter your email and we’ll send you a code and a link to reset your password.",
    submit: "Send Code",
    submitting: "Sending…",
    back: "Back to log in",
    backHref: "/login",
  },
  reset: {
    title: "Reset Password",
    subtitle: (email: string) => ({ before: "If there’s an account for", email, after: `you’ll get an ${OTP_LENGTH}-digit code there.` }),
    submit: "Reset Password",
    submitting: "Resetting…",
    change: "Change email",
  },
  // /reset-password, opened from the "Reset Password" button in the email.
  resetLink: {
    checking: "Checking your link…",
    title: "Choose a New Password",
    subtitle: (email: string) => ({ before: "For", email }),
    submit: "Save Password",
    submitting: "Saving…",
    expired: {
      title: "This link has expired",
      subtitle: "Reset links work once and expire after 10 minutes. Ask for a new one.",
      cta: "Send a New Link",
      href: "/forgot-password",
    },
  },
  resetDone: {
    title: "Password updated",
    subtitle: "Your new password is saved and you’re logged in.",
    cta: "Continue",
  },
  fields: {
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    // The design's placeholder is lowercase "password"; capitalised to match the other fields (SPEC-VS-DESIGN A4).
    password: "Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    country: "Country code",
    day: "Day",
    month: "Month",
    year: "Year",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },
  close: "Close",
  // Mentor and admin accounts log in on the platform (accounts aren't shared between the two sites' sessions).
  platformAccount: {
    title: "Use the Mentorle platform",
    body: (role: "mentor" | "admin") =>
      role === "mentor"
        ? "This is a mentor account. Mentors manage their sessions and profile on the Mentorle platform."
        : "This is an admin account. Admins work on the Mentorle platform.",
    cta: "Go to the platform",
    back: "Use a different account",
  },
};

export const authErrors = {
  fullNameRequired: "Enter your full name.",
  fullNameReserved: "Please enter your real name.",
  fullNameLong: "Keep your name under 100 characters.",
  email: "Enter a valid email address.",
  emailTaken: "This email is already registered. Log in instead.",
  phone: "Enter a valid phone number.",
  dob: "Enter your date of birth.",
  dobInvalid: "That date doesn’t exist.",
  underAge: `You need to be ${MIN_AGE} or older to join Mentorle.`,
  passwordShort: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
  passwordLong: `Keep it under ${MAX_PASSWORD_LENGTH} characters.`,
  passwordRequired: "Enter your password.",
  passwordMismatch: "Passwords don’t match.",
  terms: "Please accept the Terms and Privacy Policy to continue.",
  otp: `Enter the ${OTP_LENGTH}-digit code.`,
  otpWrong: "That code is wrong or has expired. Check your email or resend it.",
  credentials: "Wrong email or password.",
  rateLimited: "Too many attempts. Please wait a minute and try again.",
  weakPassword: "That password is too easy to guess. Try a longer one.",
  samePassword: "Choose a password different from your current one.",
  unverified: "Verify your email first. We’ve sent you a new code.",
  generic: "Something went wrong. Please try again.",
};

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Same list and dial codes as the platform's phone input (features/mentee-onboarding/profileOptions.ts).
export const COUNTRY_CODES = [
  { code: "IN", dial: "+91", name: "India" },
  { code: "US", dial: "+1", name: "United States" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "AE", dial: "+971", name: "UAE" },
  { code: "SG", dial: "+65", name: "Singapore" },
  { code: "AU", dial: "+61", name: "Australia" },
  { code: "CA", dial: "+1", name: "Canada" },
  { code: "DE", dial: "+49", name: "Germany" },
  { code: "FR", dial: "+33", name: "France" },
  { code: "JP", dial: "+81", name: "Japan" },
  { code: "CN", dial: "+86", name: "China" },
  { code: "BR", dial: "+55", name: "Brazil" },
  { code: "NZ", dial: "+64", name: "New Zealand" },
  { code: "ZA", dial: "+27", name: "South Africa" },
  { code: "KR", dial: "+82", name: "South Korea" },
  { code: "MY", dial: "+60", name: "Malaysia" },
  { code: "PH", dial: "+63", name: "Philippines" },
  { code: "ID", dial: "+62", name: "Indonesia" },
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "PK", dial: "+92", name: "Pakistan" },
  { code: "BD", dial: "+880", name: "Bangladesh" },
  { code: "LK", dial: "+94", name: "Sri Lanka" },
  { code: "NP", dial: "+977", name: "Nepal" },
  { code: "SA", dial: "+966", name: "Saudi Arabia" },
] as const;

export const DEFAULT_COUNTRY = "IN";

export const accountMenu = {
  label: "Account",
  completeProfile: { label: "Complete your profile", href: "/onboarding" },
  findMentor: { label: "Find a mentor", href: "/mentors" },
  logout: "Log out",
};
