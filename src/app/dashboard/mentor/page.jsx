"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";

function MentorDashboardContent() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("mentor_data")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Access Denied",
            description: "You don't have mentor privileges.",
            variant: "destructive",
          });
          router.push("/dashboard");
          return;
        }

        // Show notification if mentor application is still pending
        if (data.status === "pending") {
          toast({
            title: "Application Pending",
            description: "Your mentor application is still under review. You can set up your profile while waiting for approval.",
          });
        }

        setProfile(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetchProfile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Pending Status Banner */}
        {profile?.status === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Application Under Review
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Your mentor application is currently being reviewed. You can set up your profile while waiting for approval.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area - Ready for New Components */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Mentor Dashboard
          </h1>
          
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              🚧 Dashboard components will be implemented here
            </div>
            <p className="text-gray-400 mt-2">
              Ready for new component development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentorDashboard() {
  return (
    <RoleProtected requiredRole={[ROLES.MENTOR, ROLES.PENDING_MENTOR]}>
      <MentorDashboardContent />
    </RoleProtected>
  );
}