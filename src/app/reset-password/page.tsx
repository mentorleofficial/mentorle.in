import type { Metadata } from "next";
import HomePage from "@/app/page";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your Mentorle account.",
  robots: { index: false },
};

// Opened from the "Reset Password" button in the reset email (always a direct visit), over the homepage.
export default function ResetPasswordPage() {
  return (
    <>
      <HomePage />
      <AuthModal mode="reset" intercepted={false} />
    </>
  );
}
