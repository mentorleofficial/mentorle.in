"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Global guard component that prevents redirects to dashboard during password reset flow
 * This component should be included in the root layout to catch redirects early
 */
export default function PasswordResetGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hasRecoveryToken = hashParams.get('type') === 'recovery' || hashParams.has('access_token');
    
    // If we have a recovery token but we're not on reset-password page, redirect there
    if (hasRecoveryToken && pathname !== '/reset-password') {
      sessionStorage.setItem('isPasswordResetFlow', 'true');
      // Preserve the hash when redirecting
      router.push('/reset-password' + window.location.hash);
      return;
    }

    // If we're on dashboard but have the password reset flag, redirect to reset-password
    if (pathname.startsWith('/dashboard') && 
        sessionStorage.getItem('isPasswordResetFlow') === 'true' &&
        !pathname.includes('/reset-password')) {
      // Check if we still have the recovery token
      if (hasRecoveryToken) {
        router.push('/reset-password' + window.location.hash);
      } else {
        // Token might be in sessionStorage or we need to check URL
        router.push('/reset-password');
      }
      return;
    }
  }, [pathname, router]);

  return null;
}
