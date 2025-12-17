"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import MentorVideo from "@/app/dashboard/mentee/booking/components/MentorVideo";
import { 
  Briefcase, 
  MapPin, 
  Lightbulb, 
  ExternalLink, 
  Linkedin, 
  Star,
  Calendar,
  Users,
  Award,
  Globe
} from "lucide-react";
import { slugToName } from "@/lib/slugUtils";

export default function PublicMentorProfile() {
  const router = useRouter();
  const params = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthAndFetchMentor = async () => {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      // Fetch mentor data
      if (params.id) {
        try {
          let mentorData, error;

          // Check if params.id is a UUID (mentor ID) or a slug (mentor name)
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.id);
          
          if (isUUID) {
            // Fetch by mentor user_id
            const result = await supabase
              .from("mentor_data")
              .select("*")
              .eq("user_id", params.id)
              .single();
            mentorData = result.data;
            error = result.error;
          } else {
            // Fetch by mentor name slug with multiple fallback strategies
            const nameFromSlug = slugToName(params.id);
            console.log("Looking for mentor with name:", nameFromSlug);
            
            // Try exact match first
            const exactResult = await supabase
              .from("mentor_data")
              .select("*")
              .eq("name", nameFromSlug)
              .single();

            if (!exactResult.error && exactResult.data) {
              mentorData = exactResult.data;
            } else {
              // Try case-insensitive match
              console.log("Exact match failed, trying case-insensitive match");
              const caseInsensitiveResult = await supabase
                .from("mentor_data")
                .select("*")
                .ilike("name", nameFromSlug)
                .single();

              if (!caseInsensitiveResult.error && caseInsensitiveResult.data) {
                mentorData = caseInsensitiveResult.data;
              } else {
                // Try partial match
                console.log("Case-insensitive match failed, trying partial match");
                const partialResult = await supabase
                  .from("mentor_data")
                  .select("*")
                  .ilike("name", `%${nameFromSlug}%`)
                  .limit(1);

                if (!partialResult.error && partialResult.data && partialResult.data.length > 0) {
                  mentorData = partialResult.data[0];
                } else {
                  error = partialResult.error || new Error("Mentor not found");
                }
              }
            }
          }

          if (error) {
            console.error("Error fetching mentor:", error);
            setLoading(false);
            return;
          }

          if (mentorData) {
            setMentor(mentorData);
            await fetchProfileImage(mentorData.profile_url);
          }
        } catch (error) {
          console.error("Error fetching mentor:", error);
        }
      }
      
      setLoading(false);
    };

    checkAuthAndFetchMentor();
  }, [params.id]);

  const fetchProfileImage = async (profileUrl) => {
    if (!profileUrl) {
      setImageLoading(false);
      return;
    }

    try {
      if (profileUrl.startsWith("http")) {
        setImageUrl(profileUrl);
        setImageLoading(false);
        return;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(profileUrl);

      if (data?.publicUrl) {
        setImageUrl(data.publicUrl);
      }
    } catch (error) {
      console.error("Error getting image URL:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const getInitials = () => {
    if (!mentor || !mentor.name) return "M";
    const nameParts = mentor.name.split(' ');
    const firstName = nameParts[0] || 'M';
    const lastName = nameParts[1] || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };



  const expertise_area = Array.isArray(mentor?.expertise_area)
    ? mentor.expertise_area
    : mentor?.expertise_area
      ? [mentor.expertise_area]
      : [];
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mentor Not Found</h1>
          <p className="text-gray-600 mb-8">The mentor profile you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* <Link href="/" className="flex items-center">
              <Image
                src="/mentorlelogo.png"
                alt="Mentorle"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link> */}
            {/* {!isAuthenticated && (
              <div className="flex gap-4">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center ">
            {/* Profile Image */}
            <div className="flex justify-center lg:justify-start ">
              <div className="relative">
                <div className="w-80 h-80 rounded overflow-hidden bg-gray-200 shadow-2xl">
                  {imageLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                  ) : imageError || !imageUrl ? (
                    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-600 to-gray-700">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold text-white">
                          {getInitials()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white/80">No Profile Image</span>
                    </div>
                  ) : (
                    <Image
                      src={imageUrl}
                      alt={mentor.name || "Mentor"}
                      fill
                      className="object-cover rounded"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  )}
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <h1 className="text-5xl font-bold">
                  {mentor.name || "Mentor"}
                </h1>
                {mentor.badge && (
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                      mentor.badge.toLowerCase() === 'instructor' ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                  >
                    {mentor.badge.charAt(0).toUpperCase() + mentor.badge.slice(1)}
                  </span>
                )}
              </div>
              
              {mentor.Industry && (
                <p className="text-xl text-gray-300 mb-6">{mentor.Industry}</p>
              )}

              {mentor.location && (
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">{mentor.location}</span>
                </div>
              )}

              {mentor.experience_years && (
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">{mentor.experience_years} years of experience</span>
                </div>
              )}

              {/* Coming Soon Button */}
              <div className="bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg cursor-not-allowed opacity-75 text-center">
                Booking Coming Soon
              </div>

              <p className="text-sm text-gray-400 mt-4">
                We're working on bringing you the best mentorship experience. Stay tuned!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {mentor.bio && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
              </div>
            )}

            {/* YouTube Video/Channel */}
            {mentor.youtube && (
              <MentorVideo youtubeUrl={mentor.youtube} />
            )}

            {/* Expertise */}
            {expertise_area.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="h-6 w-6 text-amber-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Expertise</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {expertise_area.map((item, index) => (
                    <span
                      key={index}
                      className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            {/* <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-700">4.9 Rating</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">100+ Sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Available This Week</span>
                </div>
              </div>
            </div> */}

            {/* Contact */}
            {(mentor.linkedin_url || mentor.portfolio_url) && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
                <div className="space-y-3">
                  {mentor.linkedin_url && (
                    <a
                      href={mentor.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                      LinkedIn Profile
                    </a>
                  )}
                  {mentor.portfolio_url && (
                    <a
                      href={mentor.portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                      Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Coming Soon CTA */}
            <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Booking Coming Soon!</h3>
              <p className="text-gray-300 text-sm mb-4">
                We're working hard to bring you amazing mentorship sessions
              </p>
              <div className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold text-center cursor-not-allowed opacity-75">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
