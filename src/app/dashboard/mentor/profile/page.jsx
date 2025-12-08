"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

// Components
import ProfilePicture from "./components/ProfilePicture";
import BasicInfo from "./components/BasicInfo";
import ProfessionalInfo from "./components/ProfessionalInfo";
import PastExperience from "./components/PastExperience";
import SocialLinks from "./components/SocialLinks";

// Utils
import { uploadProfileImage, deleteProfileImage, cleanupBrokenImageUrls } from "./utils/storageUtils";

function MentorProfileContent() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  // Form data according to mentor_data table schema
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    current_role: "",
    industry: "",
    experience_years: "",
    expertise_area: [],
    languages_spoken: [],
    past_experience: [],
    linkedin_url: "",
    github_url: "",
    youtube: "",
    portfolio_url: ""
  });

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
            title: "Error",
            description: "Failed to load profile data.",
            variant: "destructive",
          });
          return;
        }

        setProfile(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          location: data.location || "",
          current_role: data.current_role || "",
          industry: data.industry || "",
          experience_years: data.experience_years || "",
          expertise_area: data.expertise_area || [],
          languages_spoken: data.languages_spoken || [],
          past_experience: data.past_experience || [],
          linkedin_url: data.linkedin_url || "",
          github_url: data.github_url || "",
          youtube: data.youtube || "",
          portfolio_url: data.portfolio_url || ""
        });
        setAvatarUrl(data.profile_url || "");
        setIsLoading(false);

        // Clean up any broken image URLs
        if (data.profile_url) {
          cleanupBrokenImageUrls(session.user.id);
        }
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, values) => {
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const handleExperienceChange = (experience) => {
    setFormData(prev => ({
      ...prev,
      past_experience: experience
    }));
  };

  const handleAvatarChange = (file, url) => {
    setAvatarFile(file);
    setAvatarUrl(url);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate profile data
      if (!profile || !profile.user_id) {
        throw new Error("Profile data not loaded. Please refresh the page.");
      }

      // Validate required fields
      if (!formData.name || !formData.email) {
        throw new Error("Name and email are required fields.");
      }

      let profileUrl = profile?.profile_url || "";

      // Upload new avatar if selected
      if (avatarFile) {
        // Delete previous image if exists
        if (profile?.profile_url) {
          await deleteProfileImage(profile.profile_url);
        }

        // Upload new image
        profileUrl = await uploadProfileImage(avatarFile, profile.user_id);
      }

      // Update profile data according to table schema
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        current_role: formData.current_role,
        Industry: formData.industry,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : null,
        expertise_area: formData.expertise_area,
        languages_spoken: formData.languages_spoken,
        past_experience: formData.past_experience,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        youtube: formData.youtube,
        portfolio_url: formData.portfolio_url,
        profile_url: profileUrl,
        updated_at: new Date().toISOString()
      };

      // Update profile in database
      const { error } = await supabase
        .from("mentor_data")
        .update(updateData)
        .eq("user_id", profile.user_id);

      if (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      // Refresh profile data
      const { data: updatedProfile, error: fetchError } = await supabase
        .from("mentor_data")
        .select("*")
        .eq("user_id", profile.user_id)
        .single();

      if (fetchError) {
        console.warn("Failed to fetch updated profile:", fetchError);
      } else {
        setProfile(updatedProfile);
        setFormData({
          name: updatedProfile.name || "",
          email: updatedProfile.email || "",
          phone: updatedProfile.phone || "",
          bio: updatedProfile.bio || "",
          location: updatedProfile.location || "",
          current_role: updatedProfile.current_role || "",
          industry: updatedProfile.industry || "",
          experience_years: updatedProfile.experience_years || "",
          expertise_area: updatedProfile.expertise_area || [],
          languages_spoken: updatedProfile.languages_spoken || [],
          past_experience: updatedProfile.past_experience || [],
          linkedin_url: updatedProfile.linkedin_url || "",
          github_url: updatedProfile.github_url || "",
          youtube: updatedProfile.youtube || "",
          portfolio_url: updatedProfile.portfolio_url || ""
        });
        setAvatarUrl(updatedProfile.profile_url || "");
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-3">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-gray-600">Update your mentor profile information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <ProfilePicture
              profileUrl={avatarUrl}
              onAvatarChange={handleAvatarChange}
            />
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-3 space-y-6">
            {/* Basic Information */}
            <BasicInfo
              formData={formData}
              onInputChange={handleInputChange}
            />

            {/* Professional Information */}
            <ProfessionalInfo
              formData={formData}
              onInputChange={handleInputChange}
              onArrayChange={handleArrayChange}
            />

            {/* Past Experience */}
            <PastExperience
              pastExperience={formData.past_experience}
              onExperienceChange={handleExperienceChange}
            />

            {/* Social Links */}
            <SocialLinks
              formData={formData}
              onInputChange={handleInputChange}
            />

            {/* Save Button */}
            <div className="flex justify-end pt-6">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-2"
                size="lg"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentorProfile() {
  return (
    <RoleProtected requiredRole={[ROLES.MENTOR, ROLES.PENDING_MENTOR]}>
      <MentorProfileContent />
    </RoleProtected>
  );
}