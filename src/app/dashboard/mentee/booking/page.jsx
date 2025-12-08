// "use client";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import useMentorStore from "@/store/store";
// import { v4 as uuidv4 } from "uuid";

// // Import components
// import MentorProfile from "./components/MentorProfile";
// import MentorTabs from "./components/MentorTabs";
// import MentorVideo from "./components/MentorVideo";
// import BookingSidebar from "./components/BookingSidebar";
// import LoadingState from "./components/LoadingState";
// import NotFoundState from "./components/NotFoundState";

// export default function MentorBookingPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const mentorData = useMentorStore((state) => state.mentorData);
//   const [loading, setLoading] = useState(true);
//   const [mentor, setMentor] = useState(null);
//   const [availabilitySlots, setAvailabilitySlots] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [avatarUrl, setAvatarUrl] = useState(null);
//   const [imageLoading, setImageLoading] = useState(true);

//     const fetchProfileImage = async (profileUrl) => {
//       if (!profileUrl) {
//         setImageLoading(false);
//         return;
//       }

//       try {
//         if (profileUrl.startsWith("http")) {
//           setAvatarUrl(profileUrl);
//           setImageLoading(false);
//           return;
//         }

//         const { data } = supabase.storage.from("media").getPublicUrl(profileUrl);

//         if (data?.publicUrl) {
//           setAvatarUrl(data.publicUrl);
//         }
//       } catch (error) {
//         // console.error("Error getting image URL:", error);
//       } finally {
//         setImageLoading(false);
//       }
//     };    useEffect(() => {
//     const fetchMentorData = async () => {
//       setLoading(true);

//       let mentorId = null;      // First, check if mentor ID is provided in URL parameters (for shareable links)
//       const mentorIdFromUrl = searchParams.get('mentor');
//       if (mentorIdFromUrl) {
//         // console.log("Mentor ID from URL:", mentorIdFromUrl);
//         mentorId = mentorIdFromUrl;

//         // Fetch mentor data directly from database using URL parameter
//         try {
//           const { data: mentorFromDb, error } = await supabase
//             .from("mentor_data")
//             .select("*")
//             .eq("id", mentorIdFromUrl)
//             .single();

//           if (error) {
//             console.error("Error fetching mentor from URL parameter:", error);
//             router.push("/dashboard/mentee/findmentor");
//             return;
//           } else if (mentorFromDb) {
//             // console.log("Mentor data from URL parameter:", mentorFromDb);
//             setMentor(mentorFromDb);
//             await fetchProfileImage(mentorFromDb.profile_url);
//           }
//         } catch (fetchError) {
//           console.error("Error in fetch operation for URL parameter:", fetchError);
//           router.push("/dashboard/mentee/findmentor");
//           return;
//         }
//       } else {
//         // Fallback to existing logic: Get mentor data from store or localStorage
//         if (mentorData) {
//           // console.log("Mentor data from store:", mentorData);
//           mentorId = mentorData.id;
//           setMentor(mentorData); // Set initial data
//         } else {
//           try {
//             const storedData = localStorage.getItem("mentor-storage");
//             if (storedData) {
//               const parsedData = JSON.parse(storedData).state.mentorData;
//               if (parsedData) {
//                 // console.log("Mentor data from localStorage:", parsedData);
//                 mentorId = parsedData.id;
//                 setMentor(parsedData); // Set initial data
//               } else {
//                 router.push("/dashboard/mentee/findmentor");
//                 return;
//               }
//             } else {
//               router.push("/dashboard/mentee/findmentor");
//               return;
//             }
//           } catch (error) {
//             console.error("Error parsing stored mentor data:", error);
//             router.push("/dashboard/mentee/findmentor");
//             return;
//           }
//         }

//         // Fetch complete mentor profile from database for store/localStorage data
//         if (mentorId) {
//           try {
//             // Fetch complete mentor profile with all fields
//             const { data: completeProfile, error } = await supabase
//               .from("mentor_data")
//               .select("*, past_experience, current_role, reviews, languages_spoken, youtube")
//               .eq("id", mentorId)
//               .single();

//             if (error) {
//               console.error("Error fetching complete mentor profile:", error);
//             } else if (completeProfile) {
//               // console.log("Complete mentor profile:", completeProfile);
//               // Update mentor state with complete data
//               setMentor(completeProfile);
//               await fetchProfileImage(completeProfile.profile_url);
//             }
//           } catch (fetchError) {
//             console.error("Error in fetch operation:", fetchError);
//           }
//         }
//       }

//       // Fetch availability slots for any mentor ID we have
//       if (mentorId) {
//         fetchAvailabilitySlots(mentorId);
//       }

//       setLoading(false);
//     };

//     fetchMentorData();
//   }, [mentorData, router, searchParams]);

//   const fetchAvailabilitySlots = async (mentorId) => {
//     try {
//       // console.log("Fetching availability for mentor_id:", mentorId);

//       // Validate mentor_id exists in mentor_data
//       const { data: mentorCheck, error: mentorError } = await supabase
//         .from("mentor_data")
//         .select("id")
//         .eq("id", mentorId)
//         .single();

//       if (mentorError || !mentorCheck) {
//         // console.error("Mentor ID not found in mentor_data:", mentorError);
//         throw new Error("Invalid mentor ID");
//       }

//       const { data, error } = await supabase
//         .from("mentor_availability")
//         .select("*")
//         .eq("mentor_id", mentorId)
//         .eq("status", "available")
//         .order("day_of_week", { ascending: true })
//         .order("start_time", { ascending: true });

//       if (error) {
//         // console.error("Supabase query error:", error);
//         throw error;
//       }

//       // console.log("Availability slots fetched:", data);
//       setAvailabilitySlots(data || []);
//       setLoading(false);
//     } catch (error) {
//       // console.error("Error fetching availability slots:", error);
//       setAvailabilitySlots([]);
//       setLoading(false);
//       alert("Failed to load availability slots. Please try again.");
//     }
//   };

//   const handleBookSession = async () => {
//     if (!selectedSlot) {
//       alert("Please select an availability slot first");
//       return;
//     }

//     const {
//       data: { session },
//     } = await supabase.auth.getSession();

//     if (!session) {
//       alert("You must be logged in to book a session");
//       router.push("/login");
//       return;
//     }

//     try {
//       // Fetch mentee's data
//       const { data: menteeData, error: menteeError } = await supabase
//         .from("mentee_data")
//         .select("id, user_id, email, first_name, last_name")
//         .eq("user_id", session.user.id)
//         .single();

//       if (menteeError || !menteeData?.user_id) {
//         // console.error("Mentee error:", menteeError || "No mentee data found");
//         throw new Error(
//           "Could not find your profile. Please complete your profile setup."
//         );
//       }

//       // Fetch mentor's email
//       const { data: mentorProfile, error: mentorError } = await supabase
//         .from("mentor_data")
//         .select("email, first_name, last_name")
//         .eq("id", mentor.id)
//         .single();

//       if (mentorError || !mentorProfile?.email) {
//         // console.error("Mentor error:", mentorError || "No mentor email found");
//         throw new Error("Could not find mentor's email.");
//       }

//       // Validate mentor ID
//       const isValidUUID = (uuid) => {
//         const uuidRegex =
//           /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
//         return uuidRegex.test(uuid);
//       };

//       let validMentorId = String(mentor.id);
//       if (!isValidUUID(validMentorId)) {
//         // console.log(
//         //   "Mentor ID is not a valid UUID, fetching from mentor_data..."
//         // );
//         const { data: mentorData, error: mentorError } = await supabase
//           .from("mentor_data")
//           .select("user_id")
//           .eq("id", validMentorId)
//           .single();

//         if (mentorError || !mentorData?.user_id) {
//           // console.error(
//           //   "Mentor fetch error:",
//           //   mentorError || "No mentor data found"
//           // );
//           throw new Error("Could not find a valid mentor profile.");
//         }
//         validMentorId = mentorData.user_id;
//       }

//       const validMenteeId = menteeData.user_id;

//       // Prepare booking timestamps
//       let bookingDate;
//       if (selectedSlot.specific_date) {
//         bookingDate = new Date(selectedSlot.specific_date);
//       } else {
//         const today = new Date();
//         const currentDayOfWeek = today.getDay();
//         const targetDayOfWeek = selectedSlot.day_of_week;
//         let daysToAdd = targetDayOfWeek - currentDayOfWeek;
//         if (daysToAdd <= 0) {
//           daysToAdd += 7;
//         }
//         bookingDate = new Date();
//         bookingDate.setDate(today.getDate() + daysToAdd);
//       }

//       const [startHours, startMinutes] = selectedSlot.start_time
//         .split(":")
//         .map(Number);
//       const [endHours, endMinutes] = selectedSlot.end_time
//         .split(":")
//         .map(Number);

//       const startTimestamp = new Date(bookingDate);
//       startTimestamp.setHours(startHours, startMinutes, 0);

//       const endTimestamp = new Date(bookingDate);
//       endTimestamp.setHours(endHours, endMinutes, 0);

//       // Generate unique Jitsi meeting room name
//       const meetingRoomName = `MentorSession-${uuidv4()}`;

//       // Redirect to confirmation page with all booking data
//       router.push(
//         `/dashboard/mentee/confirmation?slotId=${selectedSlot.id}&mentorId=${validMentorId}&menteeId=${validMenteeId}&meetingRoomName=${meetingRoomName}&startTime=${encodeURIComponent(
//           startTimestamp.toISOString()
//         )}&endTime=${encodeURIComponent(
//           endTimestamp.toISOString()
//         )}&menteeEmail=${encodeURIComponent(
//           menteeData.email
//         )}&menteeName=${encodeURIComponent(
//           `${menteeData.first_name} ${menteeData.last_name}`
//         )}&mentorEmail=${encodeURIComponent(
//           mentorProfile.email
//         )}&mentorName=${encodeURIComponent(
//           `${mentorProfile.first_name} ${mentorProfile.last_name}`
//         )}`
//       );
//     } catch (error) {
//       // console.error("Error preparing booking:", error);
//       alert(`Failed to prepare booking: ${error.message}`);
//     }
//   };

//   const formatTimeSlot = (slot) => {
//     if (slot.is_recurring) {
//       const days = [
//         "Sunday",
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//       ];
//       const day = days[slot.day_of_week];
//       const startTime = slot.start_time.substring(0, 5);
//       const endTime = slot.end_time.substring(0, 5);
//       return `${day}, ${startTime} - ${endTime}`;
//     } else {
//       const date = slot.specific_date
//         ? new Date(slot.specific_date)
//         : new Date();
//       const dateString = date.toLocaleDateString("en-US", {
//         weekday: "short",
//         month: "short",
//         day: "numeric",
//       });
//       const startTime = slot.start_time.substring(0, 5);
//       const endTime = slot.end_time.substring(0, 5);
//       return `${dateString}, ${startTime} - ${endTime}`;
//     }
//   };

//   const handleImageError = () => {
//     // console.error("Profile image failed to load");
//     setAvatarUrl(null);
//     setImageLoading(false);  };

//   // Loading state
//   if (loading) {
//     return <LoadingState />;
//   }

//   // Not found state
//   if (!mentor) {
//     return <NotFoundState />;
//   }

//   // Main content
//   return (
//     <div className="max-w-8xl mx-auto p-2 mt-10">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
//         <div className="lg:col-span-2">
//           <MentorProfile
//             mentor={mentor}
//             avatarUrl={avatarUrl}
//             imageLoading={imageLoading}
//             handleImageError={handleImageError}
//           />
//           {mentor.youtube && <MentorVideo youtubeUrl={mentor.youtube} />}
//           <MentorTabs mentor={mentor} />
//         </div>

//         <div>
//           <BookingSidebar
//             availabilitySlots={availabilitySlots}
//             selectedSlot={selectedSlot}
//             setSelectedSlot={setSelectedSlot}
//             formatTimeSlot={formatTimeSlot}
//             handleBookSession={handleBookSession}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// app/dashboard/mentee/Booking/page.js updated to use Suspense for loading state

import { Suspense } from "react";
import MentorBookingPage from "./MentorBookingPage";

export default function BookingPageWrapper() {
  return (
    <Suspense fallback={<div className="p-4">Loading booking page...</div>}>
      <MentorBookingPage />
    </Suspense>
  );
}
