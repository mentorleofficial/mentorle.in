import type { Metadata } from "next";
import HomePage from "@/app/page";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to manage your mentorship journey on Mentorle.",
};

// Direct visit or refresh: there is no previous page to sit over, so the form opens over the homepage.
export default function LoginPage() {
  return (
    <>
      <HomePage />
      <AuthModal mode="login" intercepted={false} />
    </>
  );
}
