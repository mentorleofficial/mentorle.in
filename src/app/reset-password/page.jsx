"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateUserPassword, checkPasswordResetSession, validatePassword } from "@/lib/passwordReset";
import { supabase } from "@/lib/supabase";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let subscription = null;
    let isProcessing = false;

    const checkSession = async () => {
      // Prevent multiple simultaneous checks
      if (isProcessing) return;
      isProcessing = true;

      try {
        // CRITICAL: Set flag IMMEDIATELY before anything else
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('isPasswordResetFlow', 'true');
        }

        // CRITICAL: Check for recovery token in URL hash FIRST
        // Supabase adds access_token and type=recovery to the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasRecoveryToken = hashParams.get('type') === 'recovery' || hashParams.has('access_token');
        
        if (!hasRecoveryToken) {
          // No recovery token - this is not a valid reset password flow
          setError("Invalid reset link. Please request a new password reset link.");
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('isPasswordResetFlow');
          }
          isProcessing = false;
          return;
        }

        // Listen for auth state changes to catch recovery token processing
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && hasRecoveryToken)) {
            // Recovery session established, check if valid
            const result = await checkPasswordResetSession();
            if (result.success) {
              setIsValidSession(true);
            } else {
              setError(result.error || "Invalid or expired reset link. Please request a new reset link.");
            }
          }
        });
        subscription = authSubscription;

        // Wait a moment for Supabase to process the recovery token
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check session after recovery token processing
        const result = await checkPasswordResetSession();
        if (result.success) {
          setIsValidSession(true);
        } else {
          // Wait a bit more and retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          const retryResult = await checkPasswordResetSession();
          if (retryResult.success) {
            setIsValidSession(true);
          } else {
            setError("Processing reset link... Please wait.");
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
        setError("Error occurred during session check.");
      } finally {
        isProcessing = false;
      }
    };

    // Run immediately on mount
    checkSession();

    // Cleanup subscription and remove flag on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      // Remove the flag when component unmounts (but only if password wasn't reset)
      if (typeof window !== 'undefined' && !message.includes('successfully reset')) {
        sessionStorage.removeItem('isPasswordResetFlow');
      }
    };
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    setIsLoading(true);

    try {
      const result = await updateUserPassword(password);
      
      if (result.success) {
        setMessage("Password successfully reset! Redirecting to login...");
        
        // Clear the password reset flow flag
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('isPasswordResetFlow');
        }
        
        // Sign out the user to clear the session before redirecting to login
        await supabase.auth.signOut();
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(result.error || "Error occurred during password reset. Please try again.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Error occurred during password reset. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-xl">Checking session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !isValidSession}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-xl">Loading...</div>
    </div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
