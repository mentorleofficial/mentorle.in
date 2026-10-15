import type { Metadata } from "next";
import HomePage from "@/app/page";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your Mentorle password with a code sent to your email.",
  robots: { index: false },
};

// Direct visit or refresh: there is no previous page to sit over, so the form opens over the homepage.
export default function ForgotPasswordPage() {
  return (
    <>
      <HomePage />
      <AuthModal mode="forgot" intercepted={false} />
    </>
  );
}
