import { AuthModal } from "@/components/auth/AuthModal";

// Soft navigation to /login from any page: open the form over that page.
export default function LoginIntercepted() {
  return <AuthModal mode="login" intercepted />;
}
