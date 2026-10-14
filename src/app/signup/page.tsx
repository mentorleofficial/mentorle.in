import type { Metadata } from "next";
import HomePage from "@/app/page";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a Mentorle account and join the network of ambitious builders.",
};

// Direct visit or refresh: there is no previous page to sit over, so the form opens over the homepage.
export default function SignupPage() {
  return (
    <>
      <HomePage />
      <AuthModal mode="signup" intercepted={false} />
    </>
  );
}
