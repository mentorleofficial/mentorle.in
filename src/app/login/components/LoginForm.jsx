// components/LoginForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          // Check if user profile is complete
          const userEmail = session.user.email;
          
          // Check in mentee_data first
          const { data: menteeData } = await supabase
            .from("mentee_data")
            .select("*")
            .eq("email", userEmail)
            .single();

          // Check if it's first time login (profile incomplete)
          if (menteeData) {
            const isProfileIncomplete = 
              !menteeData.interests || 
              menteeData.interests.length === 0 || 
              !menteeData.preferred_industries || 
              menteeData.preferred_industries.length === 0 ||
              !menteeData.education ||
              !menteeData.linkedin_url;

            if (isProfileIncomplete) {
              // First time user - redirect to profile
              router.push("/dashboard/mentee/profile");
              return;
            }
          }

          // Check in mentor_data if not found in mentee_data
          const { data: mentorData } = await supabase
            .from("mentor_data")
            .select("*")
            .eq("email", userEmail)
            .single();

          if (mentorData) {
            const isProfileIncomplete = 
              !mentorData.expertise_area || 
              mentorData.expertise_area.length === 0 || 
              !mentorData.experience_years ||
              !mentorData.linkedin_url;

            if (isProfileIncomplete) {
              // First time mentor - redirect to profile
              router.push("/dashboard/mentor/profile");
              return;
            }
          }

          // Profile is complete, proceed with normal redirect
          const redirectTo = returnUrl
            ? decodeURIComponent(returnUrl)
            : "/dashboard";
          router.push(redirectTo);
          return;
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsCheckingAuth(false);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [returnUrl, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        const redirectTo = returnUrl
          ? decodeURIComponent(returnUrl)
          : "/dashboard";
        router.push(redirectTo);
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email: formData.userEmail,
          password: formData.userPassword,
        }
      );

      if (authError) throw authError;

      // Check if user profile is complete
      const userEmail = data.user.email;
      
      // Check in mentee_data first
      const { data: menteeData } = await supabase
        .from("mentee_data")
        .select("*")
        .eq("email", userEmail)
        .single();

      // Check if it's first time login (profile incomplete)
      if (menteeData) {
        const isProfileIncomplete = 
          !menteeData.interests || 
          menteeData.interests.length === 0 || 
          !menteeData.preferred_industries || 
          menteeData.preferred_industries.length === 0 ||
          !menteeData.education ||
          !menteeData.linkedin_url;

        if (isProfileIncomplete) {
          // First time user - redirect to profile
          router.push("/dashboard/mentee/profile");
          return;
        }
      }

      // Check in mentor_data if not found in mentee_data
      const { data: mentorData } = await supabase
        .from("mentor_data")
        .select("*")
        .eq("email", userEmail)
        .single();

      if (mentorData) {
        const isProfileIncomplete = 
          !mentorData.expertise_area || 
          mentorData.expertise_area.length === 0 || 
          !mentorData.experience_years ||
          !mentorData.linkedin_url;

        if (isProfileIncomplete) {
          // First time mentor - redirect to profile
          router.push("/dashboard/mentor/profile");
          return;
        }
      }

      // Profile is complete, proceed with normal redirect
      const redirectTo = returnUrl
        ? decodeURIComponent(returnUrl)
        : "/dashboard";
      router.push(redirectTo);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="userEmail"
            placeholder="Enter your email"
            value={formData.userEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            name="userPassword"
            placeholder="Enter your password"
            value={formData.userPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black border-2 border-black transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Logging In..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-sm text-center space-y-2">
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-600 hover:underline"
          >
            Sign Up
          </button>
        </p>
        <p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
}
