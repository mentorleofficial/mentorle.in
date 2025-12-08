"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import useMentorStore from "@/store/store";

// Import components
import MentorProfile from "./components/MentorProfile";
import MentorTabs from "./components/MentorTabs";
import MentorVideo from "./components/MentorVideo";
import BookingSidebar from "./components/BookingSidebar";
import LoadingState from "./components/LoadingState";
import NotFoundState from "./components/NotFoundState";

export default function MentorBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mentorData = useMentorStore((state) => state.mentorData);
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  const fetchProfileImage = async (profileUrl) => {
    if (!profileUrl) {
      setImageLoading(false);
      return;
    }

    try {
      if (profileUrl.startsWith("http")) {
        setAvatarUrl(profileUrl);
        setImageLoading(false);
        return;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(profileUrl);

      if (data?.publicUrl) {
        setAvatarUrl(data.publicUrl);
      }
    } catch (error) {
      // console.error("Error getting image URL:", error);
    } finally {
      setImageLoading(false);
    }
  };
  useEffect(() => {
    const fetchMentorData = async () => {
      setLoading(true);

      let mentorId = null; // First, check if mentor ID is provided in URL parameters (for shareable links)
      const mentorIdFromUrl = searchParams.get("mentor");
      if (mentorIdFromUrl) {
        // console.log("Mentor ID from URL:", mentorIdFromUrl);
        mentorId = mentorIdFromUrl;

        // Fetch mentor data directly from database using URL parameter
        try {
          const { data: mentorFromDb, error } = await supabase
            .from("mentor_data")
            .select("*")
            .eq("id", mentorIdFromUrl)
            .single();

          if (error) {
            console.error("Error fetching mentor from URL parameter:", error);
            router.push("/dashboard/mentee/findmentor");
            return;
          } else if (mentorFromDb) {
            // console.log("Mentor data from URL parameter:", mentorFromDb);
            setMentor(mentorFromDb);
            await fetchProfileImage(mentorFromDb.profile_url);
          }
        } catch (fetchError) {
          console.error(
            "Error in fetch operation for URL parameter:",
            fetchError
          );
          router.push("/dashboard/mentee/findmentor");
          return;
        }
      } else {
        // Fallback to existing logic: Get mentor data from store or localStorage
        if (mentorData) {
          // console.log("Mentor data from store:", mentorData);
          mentorId = mentorData.id;
          setMentor(mentorData); // Set initial data
        } else {
          try {
            const storedData = localStorage.getItem("mentor-storage");
            if (storedData) {
              const parsedData = JSON.parse(storedData).state.mentorData;
              if (parsedData) {
                // console.log("Mentor data from localStorage:", parsedData);
                mentorId = parsedData.id;
                setMentor(parsedData); // Set initial data
              } else {
                router.push("/dashboard/mentee/findmentor");
                return;
              }
            } else {
              router.push("/dashboard/mentee/findmentor");
              return;
            }
          } catch (error) {
            console.error("Error parsing stored mentor data:", error);
            router.push("/dashboard/mentee/findmentor");
            return;
          }
        }

        // Fetch complete mentor profile from database for store/localStorage data
        if (mentorId) {
          try {
            // Fetch complete mentor profile with all fields
            const { data: completeProfile, error } = await supabase
              .from("mentor_data")
              .select("*")
              .eq("id", mentorId)
              .single();

            if (error) {
              console.error("Error fetching complete mentor profile:", error);
            } else if (completeProfile) {
              // console.log("Complete mentor profile:", completeProfile);
              // Update mentor state with complete data
              setMentor(completeProfile);
              await fetchProfileImage(completeProfile.profile_url);
            }
          } catch (fetchError) {
            console.error("Error in fetch operation:", fetchError);
          }
        }
      }

      setLoading(false);
    };

    fetchMentorData();
  }, [mentorData, router, searchParams]);







  const handleImageError = () => {
    // console.error("Profile image failed to load");
    setAvatarUrl(null);
    setImageLoading(false);
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Not found state
  if (!mentor) {
    return <NotFoundState />;
  }

  // Main content
  return (
    <div className="max-w-8xl mx-auto p-2 mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="lg:col-span-2">
          <MentorProfile
            mentor={mentor}
            avatarUrl={avatarUrl}
            imageLoading={imageLoading}
            handleImageError={handleImageError}
          />
          {mentor.youtube && <MentorVideo youtubeUrl={mentor.youtube} />}
          <MentorTabs mentor={mentor} />
        </div>

        <div>
          <BookingSidebar />
        </div>
      </div>
    </div>
  );
}
