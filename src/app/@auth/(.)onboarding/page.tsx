import { AuthModal } from "@/components/auth/AuthModal";

// Soft navigation to /onboarding (after signup, or "Complete your profile"): the wizard opens over that page.
export default function OnboardingIntercepted() {
  return <AuthModal mode="onboarding" intercepted />;
}
