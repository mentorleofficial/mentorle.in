"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RiSendPlaneFill } from "react-icons/ri";
import { Phone } from "lucide-react";


export default function ApplyMentor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    expertise_area: [], // Changed to array
    bio: "",
    experience_years: "",
    linkedin_url: "",
    portfolio_url: "",
    phone:""
  });
  const [currentExpertise, setCurrentExpertise] = useState(""); // For input field
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addExpertise = () => {
    if (currentExpertise.trim() && !formData.expertise_area.includes(currentExpertise.trim())) {
      setFormData({
        ...formData,
        expertise_area: [...formData.expertise_area, currentExpertise.trim()]
      });
      setCurrentExpertise("");
    }
  };

  const removeExpertise = (indexToRemove) => {
    setFormData({
      ...formData,
      expertise_area: formData.expertise_area.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleExpertiseKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addExpertise();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate that at least one expertise area is added
    if (formData.expertise_area.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one expertise area.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const user = authData.user;

      // Wait a moment for the auth state to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get mentor role ID
      const { data: mentorRole, error: roleError } = await supabase
        .from("roles")
        .select("id")
        .eq("name", "mentor")
        .single();

      if (roleError || !mentorRole) {
        throw new Error("Mentor role not found in database");
      }

      // Insert user role
      const { error: userRoleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: user.id,
          role_id: mentorRole.id,
          name: formData.name,
        });

      if (userRoleError) {
        throw new Error(`Failed to assign mentor role: ${userRoleError.message}`);
      }

      // Insert mentor data
      const { error: mentorDataError } = await supabase.from("mentor_data").insert({
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        expertise_area: formData.expertise_area,
        bio: formData.bio,
        experience_years: parseInt(formData.experience_years) || null,
        linkedin_url: formData.linkedin_url,
        portfolio_url: formData.portfolio_url,
        status: "pending",
        created_at: new Date().toISOString(),
        phone: formData.phone, 
      });

      if (mentorDataError) {
        // If mentor data insertion fails, remove the user role
        await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", user.id)
          .eq("role_id", mentorRole.id);
        throw new Error(`Failed to create mentor profile: ${mentorDataError.message}`);
      }

      // Check if user needs email confirmation
      if (authData.user && !authData.session) {
        toast({
          title: "Application Submitted",
          description: "Please check your email to verify your account, then you can access your dashboard.",
          duration: 8000,
        });
        router.push("/login?message=Please check your email to verify your account");
      } else {
        // User is automatically signed in
        toast({
          title: "Application Submitted",
          description: "Your mentor application has been submitted for review.",
        });
        router.push("/dashboard/mentor");
      }
    } catch (error) {
      console.error("Application submission error:", error);
      
      // Clean up any partial data if possible
      try {
        if (authData?.user?.id) {
          // Try to clean up any partial role assignment
          await supabase
            .from("user_roles")
            .delete()
            .eq("user_id", authData.user.id);
        }
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Apply to Become a Mentor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            name="name"
              value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Password <span className="text-red-500">*</span>
          </label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
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
          <label className="block text-sm font-medium mb-2">
            Expertise Areas <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Enter expertise area (e.g., React, Python, UI/UX)"
              value={currentExpertise}
              onChange={(e) => setCurrentExpertise(e.target.value)}
              onKeyPress={handleExpertiseKeyPress}
            />
            <Button 
              type="button" 
              onClick={addExpertise}
              disabled={!currentExpertise.trim()}
            >
              Add
            </Button>
          </div>
          {formData.expertise_area.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.expertise_area.map((expertise, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  <span>{expertise}</span>
                  <button
                    type="button"
                    onClick={() => removeExpertise(index)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {formData.expertise_area.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Please add at least one expertise area
            </p>
          )}        </div>        
        <div>
          <label className="block text-sm font-medium">
            Bio <span className="text-red-500">*</span>
          </label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            name="experience_years"
            value={formData.experience_years}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            LinkedIn URL <span className="text-red-500">*</span>
          </label>
          <Input
            name="linkedin_url"
            value={formData.linkedin_url}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Portfolio URL / Resume URL
          </label>
          <Input
            name="portfolio_url"
            value={formData.portfolio_url}
            onChange={handleChange}
          />
        </div>        
        <Button type="submit" disabled={isLoading} className="flex items-center gap-2 w-full">
          <RiSendPlaneFill className="w-4 h-4" />
          {isLoading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
}