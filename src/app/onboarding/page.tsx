import type { Metadata } from "next";
import HomePage from "@/app/page";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "Complete your profile",
  description: "Set up your Mentorle profile so mentors get to know you.",
  robots: { index: false },
};

// Direct visit or refresh: the wizard opens over the homepage, like /login and /signup.
export default function OnboardingPage() {
  return (
    <>
      <HomePage />
      <AuthModal mode="onboarding" intercepted={false} />
    </>
  );
}
