"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Phone } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    userEmail: "",
    userPassword: "",
    phone: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const router = useRouter();
  
  // Check if user is already authenticated on page load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // CRITICAL: Don't redirect if we're in password reset flow
        const currentPath = window.location.pathname;
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasRecoveryToken = hashParams.get('type') === 'recovery' || hashParams.has('access_token');
        
        if (currentPath === '/reset-password' || hasRecoveryToken || 
            (typeof window !== 'undefined' && sessionStorage.getItem('isPasswordResetFlow') === 'true')) {
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("User already authenticated, redirecting to dashboard");
          // User is already logged in, redirect to dashboard
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Trim form data before processing (but allow spaces during typing)
      const trimmedName = formData.name.trim();
      const trimmedEmail = formData.userEmail.trim();
      const trimmedPhone = formData.phone.trim();

      // Validate required fields after trimming
      if (!trimmedName) {
        throw new Error("Please enter your full name");
      }
      if (!trimmedEmail) {
        throw new Error("Please enter your email");
      }
      if (!trimmedPhone) {
        throw new Error("Please enter your phone number");
      }

      // Validate phone number
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(trimmedPhone)) {
        throw new Error("Invalid phone number format");
      }

      // Check if email already exists in the database
      const { data: existingMentee } = await supabase
        .from("mentee_data")
        .select("email")
        .eq("email", trimmedEmail)
        .single();

      const { data: existingMentor } = await supabase
        .from("mentor_data")
        .select("email")
        .eq("email", trimmedEmail)
        .single();

      const { data: existingAdmin } = await supabase
        .from("admin_data")
        .select("email")
        .eq("email", trimmedEmail)
        .single();

      if (existingMentee || existingMentor || existingAdmin) {
        setError("An account already exists with this email. Please login or use a different email.");
        setIsLoading(false);
        return;
      }

      // Sign up with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: formData.userPassword,
      });

      if (authError) {
        if (authError.message.includes("rate limit")) {
          setError("Too many attempts. Please try again later.");
        } else if (authError.message.includes("already registered") || 
                   authError.message.includes("User already registered") ||
                   authError.message.includes("email exists")) {
          setError("An account already exists with this email. Please login or use a different email.");
        } else {
          setError(authError.message);
        }
        throw authError;
      }

      if (!data.user) {
        throw new Error("User registration failed");
      }

      // Store additional user data in the `mentee_data` table
      const { error: dbError } = await supabase.from("mentee_data").insert([
        {
          user_id: data.user.id,
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          created_at: new Date().toISOString(),
        },
      ]);

      if (dbError) {
        // Check for duplicate email constraint violation
        if (dbError.code === "23505" || dbError.message.includes("duplicate") || dbError.message.includes("already exists")) {
          setError("An account already exists with this email. Please login or use a different email.");
          throw new Error("Email already exists");
        }
        throw new Error("Failed to save additional user data: " + dbError.message);
      }

      // Assign default 'mentee' role using the new RBAC system
      // First get the 'mentee' role ID
      const { data: menteeRole, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "mentee")
        .single();

      if (roleError) {
        console.error("Error fetching mentee role:", roleError);
        throw new Error("Failed to assign user role: " + roleError.message);
      }

      // Then assign the role to the user
      const { error: userRoleError } = await supabase
        .from("user_roles")
        .insert([
          {
            user_id: data.user.id,
            role_id: menteeRole.id,
            name: trimmedName
          },
        ]);

      if (userRoleError) {
        console.error("Error assigning user role:", userRoleError);
        throw new Error("Failed to assign user role: " + userRoleError.message);
      }

      alert(
        "Account created successfully! Please check your email to confirm your registration before logging in."
      );
      router.push("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }  };

  // Show loading indicator while checking authentication status
  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-xl">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="userEmail"
              type="email"
              name="userEmail"
              placeholder="Enter your email"
              value={formData.userEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone
            </label>
            <div className="flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <label htmlFor="userPassword" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="userPassword"
              type="password"
              name="userPassword"
              placeholder="Enter your password"
              value={formData.userPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              minLength="6"
              required
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                Signing Up...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}