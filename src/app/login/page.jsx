// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { supabase } from "../../lib/supabase"; // Make sure this path is correct

// export default function LoginPage() {
//   const [formData, setFormData] = useState({
//     userEmail: "",
//     userPassword: "",
//   });
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const returnUrl = searchParams.get('returnUrl');
//     // Check if user is already authenticated on page load
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const { data: { session } } = await supabase.auth.getSession();
//           if (session) {
//           // console.log("User already authenticated, redirecting");
//           // User is already logged in, redirect to returnUrl or dashboard
//           const redirectTo = returnUrl ? decodeURIComponent(returnUrl) : "/dashboard";
//           router.push(redirectTo);
//           return;
//         }
//       } catch (error) {
//         console.error("Auth check error:", error);
//       } finally {
//         setIsCheckingAuth(false);
//         setIsLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, [returnUrl, router]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);

//     try {      // Check if already authenticated first
//       const { data: sessionData } = await supabase.auth.getSession();
//       if (sessionData.session) {
//         // Already logged in, redirect to returnUrl or dashboard
//         const redirectTo = returnUrl ? decodeURIComponent(returnUrl) : "/dashboard";
//         router.push(redirectTo);
//         return;
//       }

//       // Not authenticated, proceed with login
//       const { data, error: authError } = await supabase.auth.signInWithPassword(
//         {
//           email: formData.userEmail,
//           password: formData.userPassword,
//         }
//       );

//       if (authError) throw authError;

//       if (!data.user) {
//         throw new Error("Login failed");
//       }      // Login successful, redirect to returnUrl or dashboard
//       // console.log("Login successful, redirecting");
//       const redirectTo = returnUrl ? decodeURIComponent(returnUrl) : "/dashboard";
//       router.push(redirectTo);
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   // Show loading indicator while checking authentication status
//   if (isCheckingAuth) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-pulse text-xl">Checking authentication...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//         {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium">Email</label>
//             <input
//               type="email"
//               name="userEmail"
//               placeholder="Enter your email"
//               value={formData.userEmail}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Password</label>
//             <input
//               type="password"
//               name="userPassword"
//               placeholder="Enter your password"
//               value={formData.userPassword}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border rounded-lg"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-black text-white py-2 rounded-lg hover:bg-blue-700"
//             disabled={isLoading}
//           >
//             {isLoading ? "Logging In..." : "Login"}
//           </button>
//         </form>

//         <p className="mt-4 text-sm text-center">
//           Don't have an account?{" "}
//           <button
//             onClick={() => router.push("/signup")}
//             className="text-blue-600 hover:underline"
//           >
//             Sign Up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// update code

import { Suspense } from "react";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Suspense fallback={<div className="text-lg">Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
