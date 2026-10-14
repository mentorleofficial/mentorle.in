import { AuthModal } from "@/components/auth/AuthModal";

// Soft navigation to /signup from any page: open the form over that page.
export default function SignupIntercepted() {
  return <AuthModal mode="signup" intercepted />;
}
