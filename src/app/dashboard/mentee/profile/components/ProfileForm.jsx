"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

const EDUCATION_LEVELS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Professional Certification",
  "Other"
];

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Marketing",
  "Design",
  "Engineering",
  "Business",
  "Media & Entertainment",
  "Real Estate",
  "Consulting",
  "Government",
  "Non-profit",
  "Other"
];

const INTERESTS = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "DevOps",
  "UI/UX Design",
  "Product Management",
  "Digital Marketing",
  "Business Strategy",
  "Entrepreneurship",
  "Leadership",
  "Communication",
  "Project Management",
  "Sales",
  "Finance",
  "Healthcare",
  "Education"
];

export default function ProfileForm({ profile, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    current_status: "",
    education_level: "",
    goals: "",
    location: "",
    timezone: "Asia/Kolkata",
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
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        current_status: profile.current_status || "",
        education_level: profile.education_level || "",
        goals: profile.goals || "",
        location: profile.location || "",
        timezone: profile.timezone || "Asia/Kolkata",
        interests: profile.interests || [],
        preferred_industries: profile.preferred_industries || [],
         education: {
           field: "",
           degree: "",
           school: "",
           start_year: "",
           end_year: "",
           ...(profile.education || {})
         },
         linkedin_url: profile.linkedin_url || "",
         github_url: profile.github_url || "",
         instagram_url: profile.instagram_url || ""
      });
    }
  }, [profile]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

     if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
       newErrors.phone = "Please enter a valid phone number";
     }

     // Social media URL validation
     const isValidUrl = (url, expectedDomain) => {
       if (!url) return true; // Empty URLs are allowed
       try {
         const urlObj = new URL(url);
         return urlObj.hostname.includes(expectedDomain);
       } catch {
         return false;
       }
     };

     if (formData.linkedin_url && !isValidUrl(formData.linkedin_url, 'linkedin.com')) {
       newErrors.linkedin_url = "Please enter a valid LinkedIn URL";
     }

     if (formData.github_url && !isValidUrl(formData.github_url, 'github.com')) {
       newErrors.github_url = "Please enter a valid GitHub URL";
     }

     if (formData.instagram_url && !isValidUrl(formData.instagram_url, 'instagram.com')) {
       newErrors.instagram_url = "Please enter a valid Instagram URL";
     }

     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Ensure education object is properly formatted
      const formattedData = {
        ...formData,
        education: {
          field: formData.education?.field || "",
          degree: formData.education?.degree || "",
          school: formData.education?.school || "",
          start_year: formData.education?.start_year || "",
          end_year: formData.education?.end_year || ""
        }
      };
      
      await onSave(formattedData);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleArrayChange = (field, value) => {
    const currentArray = formData[field];
    if (currentArray.includes(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: currentArray.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value]
      }));
    }
  };

  const handleEducationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      education: {
        field: "",
        degree: "",
        school: "",
        start_year: "",
        end_year: "",
        ...prev.education,
        [field]: value
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <input
              type="text"
              value={formData.current_status}
              onChange={(e) => handleInputChange("current_status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Student, Professional, Job Seeker"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Level
            </label>
            <select
              value={formData.education_level}
              onChange={(e) => handleInputChange("education_level", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select education level</option>
              {EDUCATION_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your location"
            />
          </div>
        </div>

        {/* Detailed Education */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Detailed Education</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Field of Study
              </label>
              <input
                type="text"
                value={formData.education?.field || ""}
                onChange={(e) => handleEducationChange("field", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Computer Science and Engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree
              </label>
              <input
                type="text"
                value={formData.education?.degree || ""}
                onChange={(e) => handleEducationChange("degree", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., BTech, BSc, MSc"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School/University
              </label>
              <input
                type="text"
                value={formData.education?.school || ""}
                onChange={(e) => handleEducationChange("school", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Guru Nanak Dev University, Amritsar"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Year
                </label>
                <input
                  type="number"
                  value={formData.education?.start_year || ""}
                  onChange={(e) => handleEducationChange("start_year", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2024"
                  min="1900"
                  max="2100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Year
                </label>
                <input
                  type="number"
                  value={formData.education?.end_year || ""}
                  onChange={(e) => handleEducationChange("end_year", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2028"
                  min="1900"
                  max="2100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about yourself, your background, and what you're looking to achieve"
            rows={4}
            maxLength={500}
          />
          <p className="text-gray-500 text-sm mt-1">
            {formData.bio.length}/500 characters
          </p>
        </div>

        {/* Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goals
          </label>
          <textarea
            value={formData.goals}
            onChange={(e) => handleInputChange("goals", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What are your career or learning goals? What do you want to achieve?"
            rows={4}
            maxLength={500}
          />
          <p className="text-gray-500 text-sm mt-1">
            {formData.goals.length}/500 characters
          </p>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {INTERESTS.map(interest => (
              <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleArrayChange("interests", interest)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Preferred Industries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Industries
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {INDUSTRIES.map(industry => (
              <label key={industry} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferred_industries.includes(industry)}
                  onChange={() => handleArrayChange("preferred_industries", industry)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{industry}</span>
              </label>
            ))}
          </div>
        </div>

         {/* Timezone */}
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             Timezone
           </label>
           <select
             value={formData.timezone}
             onChange={(e) => handleInputChange("timezone", e.target.value)}
             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
           >
             <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
             <option value="UTC">UTC</option>
             <option value="America/New_York">America/New_York (EST)</option>
             <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
             <option value="Europe/London">Europe/London (GMT)</option>
             <option value="Europe/Paris">Europe/Paris (CET)</option>
             <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
             <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
           </select>
         </div>

         {/* Social Media Links */}
         <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
           <h3 className="text-lg font-semibold text-purple-900 mb-4">Social Media Links</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 LinkedIn URL
               </label>
               <input
                 type="url"
                 value={formData.linkedin_url}
                 onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                   errors.linkedin_url ? 'border-red-300' : 'border-gray-300'
                 }`}
                 placeholder="https://linkedin.com/in/yourprofile"
               />
               {errors.linkedin_url && (
                 <p className="text-red-600 text-sm mt-1">{errors.linkedin_url}</p>
               )}
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 GitHub URL
               </label>
               <input
                 type="url"
                 value={formData.github_url}
                 onChange={(e) => handleInputChange("github_url", e.target.value)}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                   errors.github_url ? 'border-red-300' : 'border-gray-300'
                 }`}
                 placeholder="https://github.com/yourusername"
               />
               {errors.github_url && (
                 <p className="text-red-600 text-sm mt-1">{errors.github_url}</p>
               )}
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Instagram URL
               </label>
               <input
                 type="url"
                 value={formData.instagram_url}
                 onChange={(e) => handleInputChange("instagram_url", e.target.value)}
                 className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                   errors.instagram_url ? 'border-red-300' : 'border-gray-300'
                 }`}
                 placeholder="https://instagram.com/yourusername"
               />
               {errors.instagram_url && (
                 <p className="text-red-600 text-sm mt-1">{errors.instagram_url}</p>
               )}
             </div>
           </div>
         </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}
