"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUserWithRole } from "@/lib/auth";
import { ROLES, DASHBOARD_ROUTES } from "@/lib/roles";
import { supabase } from "@/lib/supabase";

export default function DashboardClient() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const error = searchParams.get("error");
  const errorPath = searchParams.get("requestedPath");

  useEffect(() => {
    if (error && errorPath) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to access ${errorPath}`,
        variant: "destructive",
      });
    }
  }, [error, errorPath, toast]);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        // CRITICAL: Check for recovery token FIRST - if found, redirect to reset-password
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasRecoveryToken = hashParams.get('type') === 'recovery' || hashParams.has('access_token');
        
        if (hasRecoveryToken) {
          // We have a recovery token - redirect to reset-password page immediately
          sessionStorage.setItem('isPasswordResetFlow', 'true');
          router.push('/reset-password');
          return;
        }

        // CRITICAL: Don't redirect if we're in password reset flow
        const currentPath = window.location.pathname;
        
        if (currentPath === '/reset-password' || 
            (typeof window !== 'undefined' && sessionStorage.getItem('isPasswordResetFlow') === 'true')) {
          // If we're on reset-password page, stay there
          if (currentPath !== '/reset-password') {
            router.push('/reset-password');
          }
          return;
        }

        const userWithRole = await getCurrentUserWithRole();

        if (!userWithRole) {
          router.push("/login");
          return;
        }

        setUser(userWithRole);
        setRole(userWithRole.role);

        const dashboardRoute = DASHBOARD_ROUTES[userWithRole.role];
        if (dashboardRoute) {
          router.push(dashboardRoute);
          return;
        }

        setIsLoading(false);
      } catch (error) {
        
        router.push("/login");
      }
    };

    checkUserAndRedirect();
  }, [router, toast]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {user?.userData?.first_name || user?.email}!
        </h2>
        <div className="mb-4">
          <p>Email: {user?.email}</p>
          {user?.userData && (
            <>
              <p>First Name: {user.userData.first_name}</p>
              <p>Last Name: {user.userData.last_name}</p>
            </>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
