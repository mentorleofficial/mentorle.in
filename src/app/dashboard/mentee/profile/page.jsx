"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";
import ProfileHeader from "./components/ProfileHeader";
import ProfileForm from "./components/ProfileForm";
import ProfileDisplay from "./components/ProfileDisplay";
import { User, Edit3 } from "lucide-react";

function ProfileContent() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          return;
        }

        const response = await fetch(`/api/mentee/profile?user_id=${session.user.id}`);
        const result = await response.json();

        if (!response.ok) {
          console.error("Error fetching profile:", result);
          toast({
            title: "Error",
            description: result.error || "Failed to load profile data.",
            variant: "destructive",
          });
          return;
        }

         const profileData = result.data || { 
           user_id: session.user.id,
           interests: [],
           preferred_industries: [],
           education: {
             field: "",
             degree: "",
             school: "",
             start_year: "",
             end_year: ""
           },
           linkedin_url: "",
           github_url: "",
           instagram_url: ""
         };
         
         setProfile(profileData);
         
         // Check if profile is incomplete (first time user)
         const isIncomplete = 
           !profileData.interests || 
           profileData.interests.length === 0 || 
           !profileData.preferred_industries || 
           profileData.preferred_industries.length === 0 ||
           !profileData.education ||
           !profileData.linkedin_url;
         
         if (isIncomplete) {
           setIsFirstTimeUser(true);
           setIsEditing(true); // Auto-enable edit mode for first-time users
         }
      } catch (error) {
        console.error("Error in fetchProfile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleProfileSave = async (updatedProfile) => {
    try {
      const response = await fetch('/api/mentee/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: profile.user_id,
          ...updatedProfile
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error saving profile:", result);
        toast({
          title: "Error",
          description: result.error || "Failed to save profile data.",
          variant: "destructive",
        });
        return;
      }

      setProfile(prev => ({ ...prev, ...updatedProfile }));
      setIsEditing(false);
      setIsFirstTimeUser(false); // Remove welcome banner after first save
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile data.",
        variant: "destructive",
      });
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <ProfileHeader 
          profile={profile} 
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
        />
        
        <div className="mt-6">
          {isEditing ? (
            <>
              {/* Welcome Banner for First Time Users */}
              {isFirstTimeUser && (
                <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <User className="w-12 h-12" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">Welcome to Mentorle! 🎉</h2>
                      <p className="text-blue-50 mb-4">
                        Let's complete your profile to get started. This helps us match you with the right mentors 
                        and personalize your experience.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-blue-100">
                        <Edit3 className="w-4 h-4" />
                        <span>Fill in the details below to complete your profile</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <ProfileForm
                profile={profile}
                onSave={handleProfileSave}
                onCancel={handleEditCancel}
              />
            </>
          ) : (
            <ProfileDisplay profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RoleProtected requiredRole={ROLES.MENTEE}>
      <ProfileContent />
    </RoleProtected>
  );
}
