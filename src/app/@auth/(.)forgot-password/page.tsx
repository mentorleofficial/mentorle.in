import { AuthModal } from "@/components/auth/AuthModal";

// Soft navigation to /forgot-password from any page: open the form over that page.
export default function ForgotPasswordIntercepted() {
  return <AuthModal mode="forgot" intercepted />;
}
