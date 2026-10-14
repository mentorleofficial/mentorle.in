export type AuthMode = "login" | "signup";

export type AuthField = {
  name: "fullName" | "email" | "password";
  label: string;
  type: "text" | "email" | "password";
  autoComplete: string;
};

const fields = {
  fullName: { name: "fullName", label: "Full Name", type: "text", autoComplete: "name" },
  email: { name: "email", label: "Email Address", type: "email", autoComplete: "email" },
  // The design's placeholder is lowercase "password"; capitalised here to match the other fields (logged in SPEC-VS-DESIGN).
  password: { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
} satisfies Record<string, AuthField>;

export const authCopy: Record<
  AuthMode,
  { title: string; subtitle: string; submit: string; fields: AuthField[]; switchPrompt: string; switchLabel: string; switchHref: string }
> = {
  login: {
    title: "Welcome Back",
    subtitle: "Log in to manage your mentorship journey.",
    submit: "Log In",
    fields: [fields.email, fields.password],
    switchPrompt: "Don’t have an account?",
    switchLabel: "Sign up",
    switchHref: "/signup",
  },
  signup: {
    title: "Create an Account",
    subtitle: "Join the network of ambitious builders.",
    submit: "Sign Up",
    fields: [fields.fullName, fields.email, { ...fields.password, autoComplete: "new-password" }],
    switchPrompt: "Already have an account?",
    switchLabel: "Log in",
    switchHref: "/login",
  },
};

export const MIN_PASSWORD_LENGTH = 8;

export const authMessages = {
  required: (label: string) => `Enter your ${label.toLowerCase()}.`,
  email: "Enter a valid email address.",
  password: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
  // Frontend only: there is no auth backend yet (logged in SPEC-VS-DESIGN).
  notConnected: "Accounts aren’t live yet. Sign-in opens soon, so nothing has been saved.",
};
