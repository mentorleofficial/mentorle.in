"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Script from "next/script";

export default function ResetPasswordLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const hasHandledRecovery = useRef(false);

  useEffect(() => {
    // CRITICAL: Prevent any automatic redirects when on reset password page
    // This runs BEFORE any other components can redirect
    if (pathname !== '/reset-password') {
      // Clear flag when leaving reset password page
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('isPasswordResetFlow');
      }
      return;
    }

    const handleRecoveryFlow = async () => {
      if (hasHandledRecovery.current) return;
      hasHandledRecovery.current = true;

      // Check for recovery token in URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hasRecoveryToken = hashParams.get('type') === 'recovery' || hashParams.has('access_token');
      
      if (hasRecoveryToken) {
        // Set flag immediately to prevent any redirects
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('isPasswordResetFlow', 'true');
        }
      } else {
        // No recovery token but we're on reset password page
        // This shouldn't happen, but if it does, redirect to login
        router.push('/login');
      }
    };

    handleRecoveryFlow();
  }, [pathname, router]);

  return (
    <>
      {/* CRITICAL: Set flag synchronously before React renders to prevent redirects */}
      <Script id="reset-password-flag" strategy="beforeInteractive">
        {`
          if (typeof window !== 'undefined') {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const hasRecoveryToken = hashParams.get('type') === 'recovery' || hashParams.has('access_token');
            if (hasRecoveryToken || window.location.pathname === '/reset-password') {
              sessionStorage.setItem('isPasswordResetFlow', 'true');
            }
          }
        `}
      </Script>
      {children}
    </>
  );
}
