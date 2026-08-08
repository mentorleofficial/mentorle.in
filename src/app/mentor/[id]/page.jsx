"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import MentorVideo from "@/components/MentorVideo";
import {
  Briefcase,
  MapPin,
  Lightbulb,
  Linkedin,
  Globe,
  Github,
} from "lucide-react";
import { PLATFORM_URL } from "@/lib/platform";

export default function PublicMentorProfile() {
  const params = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchMentor = async () => {
      if (!params.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/mentors/${encodeURIComponent(params.id)}`
        );
        if (!response.ok) {
          setMentor(null);
          return;
        }
        const payload = await response.json();
        setMentor(payload.data || null);
      } catch (error) {
        console.error("Error fetching mentor:", error);
        setMentor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [params.id]);

  const getInitials = () => {
    if (!mentor?.name) return "M";
    return mentor.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Mentor not found</h1>
        <Link href="/mentor" className="text-blue-600 hover:underline">
          Browse mentors
        </Link>
      </div>
    );
  }

  const expertise_area = Array.isArray(mentor.expertise_area)
    ? mentor.expertise_area
    : [];
  const imageUrl = mentor.profilePicUrl || mentor.profile_url || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center ">
            <div className="flex justify-center lg:justify-start ">
              <div className="relative">
                <div className="w-80 h-80 rounded overflow-hidden bg-gray-200 shadow-2xl relative">
                  {imageError || !imageUrl ? (
                    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-600 to-gray-700">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold text-white">
                          {getInitials()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white/80">
                        No Profile Image
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={imageUrl}
                      alt={mentor.name || "Mentor"}
                      fill
                      className="object-cover rounded"
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 flex-wrap">
                <h1 className="text-5xl font-bold">
                  {mentor.name || "Mentor"}
                </h1>
                {mentor.badge && (
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                      mentor.badge.toLowerCase() === "instructor"
                        ? "bg-green-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {mentor.badge.charAt(0).toUpperCase() +
                      mentor.badge.slice(1)}
                  </span>
                )}
              </div>

              {(mentor.current_role || mentor.headline) && (
                <p className="text-xl text-gray-200 mb-3">
                  {mentor.current_role || mentor.headline}
                </p>
              )}

              {mentor.Industry && (
                <p className="text-lg text-gray-300 mb-4">{mentor.Industry}</p>
              )}

              {mentor.current_organization && (
                <p className="text-base text-gray-400 mb-4">
                  {mentor.current_organization}
                </p>
              )}

              {mentor.location && (
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">{mentor.location}</span>
                </div>
              )}

              {mentor.experience_years ? (
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-300">
                    {mentor.experience_years} years of experience
                  </span>
                </div>
              ) : null}

              <a
                href={PLATFORM_URL}
                className="bg-white text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors inline-block w-full text-center"
              >
                Book on Platform
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {mentor.bio && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
              </div>
            )}

            {mentor.youtube && <MentorVideo youtubeUrl={mentor.youtube} />}

            {expertise_area.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="h-6 w-6 text-amber-500" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Expertise
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {expertise_area.map((item) => (
                    <span
                      key={item}
                      className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {(mentor.linkedin_url ||
              mentor.portfolio_url ||
              mentor.github_url) && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Connect
                </h3>
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
                  {mentor.github_url && (
                    <a
                      href={mentor.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Book a Session</h3>
              <p className="text-gray-300 text-sm mb-4">
                Continue on the Mentorle platform to book this mentor.
              </p>
              <a
                href={PLATFORM_URL}
                className="block w-full bg-white text-black py-3 rounded-lg font-semibold text-center hover:bg-gray-100 transition-colors"
              >
                Go to Platform
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
