// Huptle one-click apply (/jobs/<id>/apply), opened from a job card on /events. No Figma: the account pages' dark band
// and bordered notice (logged in SPEC-VS-DESIGN, HU rows).
import { OTP_LENGTH } from "@/data/auth";

export const jobApplyCopy = {
  metaTitle: "Apply on Huptle",
  eyebrow: "Apply on Huptle",
  title: "Taking you to Huptle",
  subtitle: "You’ll land on the job with your name and email filled in, no new account needed.",
  checking: "Getting your application ready…",
  redirecting: "Opening Huptle…",
  shareNote: "We share your name and email with Huptle to start your application.",
  back: "Back to opportunities",
  signedOut: { title: "Log in to apply", body: "Applying on Huptle is one click for Mentorle mentees. Log in or create an account first.", login: "Log in", signup: "Create an account" },
  menteesOnly: { title: "For mentees", body: "One-click apply on Huptle is for mentee accounts. Mentor and admin accounts can apply on Huptle directly." },
  jobGone: { title: "This job isn’t open any more", body: "It may have been filled or closed on Huptle. Have a look at the other openings." },
  unavailable: { title: "Huptle can’t be reached right now", body: "Please try again in a few minutes.", retry: "Try again" },
  verify: {
    title: "Verify your email first",
    body: (email: string) => `Huptle needs a verified email. We’ll send an ${OTP_LENGTH}-digit code to ${email}.`,
    send: "Send code",
    sending: "Sending…",
    codeTitle: "Enter your code",
    codeBody: (email: string) => `We sent an ${OTP_LENGTH}-digit code to ${email}. It expires in 10 minutes.`,
    codeLabel: "Verification code",
    submit: "Verify and continue",
    submitting: "Verifying…",
    resend: "Send a new code",
    resendIn: (seconds: number) => `Send a new code in ${seconds}s`,
    errors: {
      code: `Enter the ${OTP_LENGTH}-digit code.`,
      wrong: "That code didn’t work. Check it, or send a new one.",
      send: "Couldn’t send the code. Please try again in a minute.",
      generic: "Something went wrong. Please try again.",
    },
  },
};
