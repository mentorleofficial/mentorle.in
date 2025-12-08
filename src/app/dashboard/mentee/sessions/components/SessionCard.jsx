"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  Calendar,
  Video,
  XCircle,
  Star,
  ExternalLink,
  Loader2,
  UserCheck,
  Award,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const SessionCard = ({
  session,
  index,
  mentorImageUrl,
  statusDetails,
  canJoin,
  formatDate,
  formatTimeRange,
  onCancelSession,
  onLeaveFeedback,
  onRescheduleApproval,
}) => {
  const [mentor, setMentor] = useState(session.mentor_data || {});
  const [isLoadingMentor, setIsLoadingMentor] = useState(false);
  const [sessionStatus, setSessionStatus] = useState(session.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Get status details based on current sessionStatus
  const getStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <UserCheck className="h-3 w-3" />,
          gradient: "from-green-50 to-green-100",
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="h-3 w-3" />,
          gradient: "from-yellow-50 to-yellow-100",
        };
      // case "pending_reschedule":
      //   return {
      //     color: "bg-orange-100 text-orange-800 border-orange-200",
      //     icon: <AlertCircle className="h-3 w-3" />,
      //     gradient: "from-orange-50 to-orange-100",
      //   };
      case "canceled":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <AlertCircle className="h-3 w-3" />,
          gradient: "from-red-50 to-red-100",
        };
      case "completed":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Award className="h-3 w-3" />,
          gradient: "from-blue-50 to-blue-100",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <Calendar className="h-3 w-3" />,
          gradient: "from-gray-50 to-gray-100",
        };
    }
  };

  // Fetch complete mentor data if necessary
  useEffect(() => {
    const fetchMentorData = async () => {
      // Only fetch if we don't have complete mentor data or if it's missing essential fields
      if (!mentor || !mentor.first_name) {
        try {
          setIsLoadingMentor(true);

          // Ensure we have the mentor_id
          if (!session.mentor_id) {
            console.error("No mentor_id found for session:", session.id);
            setIsLoadingMentor(false);
            return;
          }

          // Fetch complete mentor data
          const { data, error } = await supabase
            .from("mentor_data")
            .select("*")
            .eq("id", session.mentor_id)
            .single();

          if (error) {
            console.error("Error fetching mentor data:", error);
            setIsLoadingMentor(false);
            return;
          }

          if (data) {
            console.log("Updated mentor data fetched:", data);
            setMentor(data);
          }
        } catch (err) {
          console.error("Error in fetchMentorData:", err);
        } finally {
          setIsLoadingMentor(false);
        }
      } else {
        // If we already have mentor data, ensure loading state is off
        setIsLoadingMentor(false);
      }
    };

    fetchMentorData();
  }, [session.mentor_id]);

  // Check if confirmed session should be marked as completed
  useEffect(() => {
    const checkSessionCompletion = async () => {
      // Only check for confirmed sessions with end times in the past
      if (
        session.status?.toLowerCase() === "confirmed" &&
        session.end_time &&
        new Date(session.end_time) < new Date()
      ) {
        try {
          console.log("Marking session as completed in real-time:", session.id);
          setIsUpdatingStatus(true);

          // Update in database
          const { error } = await supabase
            .from("bookings")
            .update({ status: "completed" })
            .eq("id", session.id);

          if (error) {
            console.error("Error updating session status to completed:", error);
            return;
          }

          // Update local state
          setSessionStatus("completed");

          console.log("Session marked as completed:", session.id);
        } catch (err) {
          console.error("Error in checkSessionCompletion:", err);
        } finally {
          setIsUpdatingStatus(false);
        }
      }
    };

    checkSessionCompletion();

    // Set up an interval to check periodically
    const intervalId = setInterval(checkSessionCompletion, 60000); // Check every minute

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [session.id, session.status, session.end_time]);

  // Use local sessionStatus instead of passed in session.status
  const currentStatusDetails = statusDetails || getStatusDetails(sessionStatus);

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <Card
        key={session.id}
        className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-md bg-white/80 backdrop-blur-sm"
        style={{
          animationDelay: `${index * 100}ms`,
          animation: "fadeInUp 0.6s ease-out forwards",
        }}
      >
        <div
          className={`h-1 bg-gradient-to-r ${currentStatusDetails.gradient}`}
        ></div>
        <div className="flex flex-col lg:flex-row">
          {/* Enhanced Mentor Info Section */}
          <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gradient-to-br from-gray-50/50 to-white">
            <div className="flex items-start mb-4 space-x-4">
              {/* Avatar Container */}
              <div className="relative shrink-0">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden ring-4 ring-white shadow-md relative">
                  {mentorImageUrl ? (
                    <Image
                      src={mentorImageUrl}
                      alt={mentor?.name || "Mentor"}
                      fill
                      sizes="64px"
                      className="object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center text-3xl font-bold text-indigo-700 select-none">
                      {mentor?.name
                        ? mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()
                        : mentor?.first_name
                          ? mentor.first_name[0].toUpperCase()
                          : "M"}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
              </div>

              {/* Mentor Info */}
              <div className="flex flex-col">
                {isLoadingMentor ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-500">
                      Loading mentor details...
                    </span>
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {mentor?.first_name
                        ? mentor.name
                        : "Mentor"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {mentor?.current_role || "Professional Mentor"}
                    </p>
                    {mentor?.experience_years && (
                      <p className="text-xs text-blue-600 font-medium">
                        {mentor.experience_years}+ years experience
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
            {/* Expertise Tags */}
            {mentor?.expertise_area && (
              <div className="flex flex-wrap gap-2 mb-3">
                {isLoadingMentor ? (
                  <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs animate-pulse">
                    Loading expertise...
                  </div>
                ) : (
                  <>
                    {/* Handle case where expertise_area is an array */}
                    {Array.isArray(mentor?.expertise_area) ? (
                      mentor.expertise_area.map((area, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100"
                        >
                          {area}
                        </span>
                      ))
                    ) : mentor?.expertise_area ? (
                      <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
                        {mentor.expertise_area}
                      </span>
                    ) : null}
                  </>
                )}
              </div>
            )}

            {/* Notes Section */}
            {session?.notes && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 mb-1">
                  Your Session Notes:
                </h4>
                <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-lg">
                  {session.notes}
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Session Details */}
          <div className="p-6 flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {" "}
                  <h3 className="font-semibold text-lg text-gray-900">
                    Mentoring Session
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${currentStatusDetails.color}`}
                    >
                      {currentStatusDetails.icon}
                      {sessionStatus
                        ? sessionStatus.charAt(0).toUpperCase() +
                          sessionStatus.slice(1)
                        : "Unknown"}
                    </span>
                    {isUpdatingStatus && (
                      <span className="text-xs text-blue-500 flex items-center">
                        <div className="mr-1 h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
                        Updating...
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {/* Date */}
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-indigo-500" />
                    <span className="text-sm text-gray-700">
                      {formatDate
                        ? formatDate(session.start_time)
                        : new Date(session.start_time).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-3 text-indigo-500" />
                    <span className="text-sm text-gray-700">
                      {formatTimeRange
                        ? formatTimeRange(session.start_time, session.end_time)
                        : `${new Date(session.start_time).toLocaleTimeString()} - ${new Date(session.end_time).toLocaleTimeString()}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
              {/* Reschedule Approval Button - Only for pending reschedule sessions */}
              {/* {sessionStatus?.toLowerCase() === "pending_reschedule" && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={onRescheduleApproval}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Review Reschedule
                  </Button>
                  
                  
                  {session.reschedule_reason && (
                    <div className="w-full mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-xs text-orange-600 font-medium mb-1">Reschedule Reason:</p>
                      <p className="text-xs text-orange-800">{session.reschedule_reason}</p>
                    </div>
                  )}
                </>
              )} */}

              {/* Meeting Button - Only show for upcoming sessions */}
              { sessionStatus === "confirmed" && canJoin && session.meeting_link &&(
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 bg-black hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => window.open(session.meeting_link, "_blank")}
                >
                  <Video className="h-4 w-4" />
                  Join Session
                </Button>
              )}

              {/* Feedback Button - Only for completed sessions without feedback */}
              {sessionStatus?.toLowerCase() === "completed" &&
                !session.feedback_given && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                    onClick={onLeaveFeedback}
                  >
                    <Star className="h-4 w-4" />
                    Leave Feedback
                  </Button>
                )}

              {/* Cancel Button - Only for upcoming sessions */}
              {/* {["pending"].includes(
                sessionStatus?.toLowerCase()
              ) &&
                new Date(session.start_time) > new Date() && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-red-200 text-red-700 hover:bg-red-50"
                    onClick={onCancelSession}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Session
                  </Button>
                )} */}

              {/* Completed Feedback Badge */}
              {sessionStatus?.toLowerCase() === "completed" &&
                session.feedback_given && (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      Feedback Submitted
                    </span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default SessionCard;

// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   CheckCircle,
//   Clock,
//   Calendar,
//   Video,
//   XCircle,
//   Star,
//   ExternalLink,
//   Loader2,
// } from "lucide-react";
// import Image from "next/image";
// import { supabase } from "@/lib/supabase";

// const SessionCard = ({
//   session,
//   index,
//   mentorImageUrl,
//   statusDetails,
//   canJoin,
//   formatDate,
//   formatTimeRange,
//   onCancelSession,
//   onLeaveFeedback,
// }) => {
//   const [mentor, setMentor] = useState(session.mentor_data);
//   const [isLoadingMentor, setIsLoadingMentor] = useState(false);

//   // Fetch complete mentor data if necessary
//   useEffect(() => {
//     const fetchMentorData = async () => {
//       // If we don't have mentor data or missing essential fields, fetch it
//       if (!mentor || !mentor.first_name || !mentor.expertise) {
//         try {
//           setIsLoadingMentor(true);

//           // Ensure we have the mentor_id
//           if (!session.mentor_id) {
//             // console.error("No mentor_id found for session:", session.id);
//             return;
//           }

//           // Fetch complete mentor data
//           const { data, error } = await supabase
//             .from("mentor_data")
//             .select("*") // Select all fields to ensure we get everything
//             .eq("id", session.mentor_id)
//             .single();

//           if (error) {
//             // console.error("Error fetching mentor data:", error);
//             return;
//           }

//           if (data) {
//             // console.log("Updated mentor data fetched:", data);
//             setMentor(data);
//           }
//         } catch (err) {
//         //   console.error("Error in fetchMentorData:", err);
//         } finally {
//           setIsLoadingMentor(false);
//         }
//       }
//     };

//     fetchMentorData();
//   }, [session.mentor_id, mentor]);

//   return (
//     <>
//       <style jsx>{`
//         @keyframes fadeInUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//       `}</style>

//       <Card
//         key={session.id}
//         className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-md bg-white/80 backdrop-blur-sm"
//         style={{
//           animationDelay: `${index * 100}ms`,
//           animation: "fadeInUp 0.6s ease-out forwards",
//         }}
//       >
//         <div className={`h-1 bg-gradient-to-r ${statusDetails.gradient}`}></div>
//         <div className="flex flex-col lg:flex-row">
//           {/* Enhanced Mentor Info Section */}
//           <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gradient-to-br from-gray-50/50 to-white">
//             <div className="flex items-start mb-4 space-x-4">
//               {/* Avatar Container */}
//               <div className="relative shrink-0">
//                 <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden ring-4 ring-white shadow-md relative">
//                   {mentorImageUrl ? (
//                     <Image
//                       src={mentorImageUrl}
//                       alt={mentor?.name || "Mentor"}
//                       fill
//                       sizes="64px"
//                       className="object-cover rounded-2xl"
//                     />
//                   ) : (
//                     <div className="h-16 w-16 flex items-center justify-center text-3xl font-bold text-indigo-700 select-none">
//                       {mentor?.first_name && mentor?.last_name
//                         ? `${mentor.first_name[0] || ""}${mentor.last_name[0] || ""}`.toUpperCase()
//                         : mentor?.first_name
//                           ? mentor.first_name[0].toUpperCase()
//                           : "M"}
//                     </div>
//                   )}
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white"></div>
//               </div>

//               {/* Mentor Info */}
//               <div className="flex flex-col">
//                 {isLoadingMentor ? (
//                   <div className="flex items-center space-x-2">
//                     <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//                     <span className="text-sm text-gray-500">
//                       Loading mentor details...
//                     </span>
//                   </div>
//                 ) : (
//                   <>
//                     <h3 className="font-semibold text-lg text-gray-900">
//                       {mentor?.first_name
//                         ? mentor.name
//                         : "Mentor"}
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       {mentor?.current_role || "Professional Mentor"}
//                     </p>
//                     {mentor?.experience_years && (
//                       <p className="text-xs text-blue-600 font-medium">
//                         {mentor.experience_years}+ years experience
//                       </p>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//             {/* Expertise Tags */}
//             {mentor?.expertise_area && (
//               <div className="flex flex-wrap gap-2 mb-3">
//                 {isLoadingMentor ? (
//                   <div className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs animate-pulse">
//                     Loading expertise...
//                   </div>
//                 ) : (
//                   <>
//                     {/* Handle case where expertise_area is an array */}
//                     {Array.isArray(mentor?.expertise_area) ? (
//                       mentor.expertise_area.map((area, idx) => (
//                         <span
//                           key={idx}
//                           className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100"
//                         >
//                           {area}
//                         </span>
//                       ))
//                     ) : mentor?.expertise_area ? (
//                       <span className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">
//                         {mentor.expertise_area}
//                       </span>
//                     ) : null}
//                   </>
//                 )}
//               </div>
//             )}

//             {/* Notes Section */}
//             {session?.notes && (
//               <div className="mt-3 pt-3 border-t border-gray-100">
//                 <h4 className="text-xs font-semibold text-gray-500 mb-1">
//                   Your Session Notes:
//                 </h4>
//                 <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-lg">
//                   {session.notes}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Enhanced Session Details */}
//           <div className="p-6 flex-1">
//             <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-6">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-3">
//                   <h3 className="font-semibold text-lg text-gray-900">
//                     Mentoring Session
//                   </h3>
//                   <span
//                     className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusDetails.color}`}
//                   >
//                     {statusDetails.icon}
//                     {session.status
//                       ? session.status.charAt(0).toUpperCase() +
//                         session.status.slice(1)
//                       : "Unknown"}
//                   </span>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center text-gray-600">
//                     <div className="bg-blue-100 p-1.5 rounded-lg mr-3">
//                       <Calendar className="h-4 w-4 text-blue-600" />
//                     </div>
//                     <span className="font-medium">
//                       {formatDate(session.start_time)}
//                     </span>
//                   </div>
//                   <div className="flex items-center text-gray-600">
//                     <div className="bg-indigo-100 p-1.5 rounded-lg mr-3">
//                       <Clock className="h-4 w-4 text-indigo-600" />
//                     </div>
//                     <span className="font-medium">
//                       {formatTimeRange(session.start_time, session.end_time)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Action Buttons */}
//             <div className="flex flex-wrap gap-3">
//               {/* Join Meeting Button - Only show if confirmed AND within time window */}
//               {canJoin && session.meeting_link && (
//                 <Button
//                   size="sm"
//                   className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
//                 >
//                   <a
//                     href={session.meeting_link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="inline-flex items-center gap-2"
//                   >
//                     <Video className="h-4 w-4 mr-2" />
//                     Join Meeting
//                   </a>
//                 </Button>
//               )}

//               {/* Cancel Button - Only show for pending/confirmed sessions */}
//               {/* {(session.status === "pending" ||
//                 session.status === "confirmed") && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
//                   onClick={() => onCancelSession(session)}
//                 >
//                   <XCircle className="h-4 w-4 mr-2" />
//                   Cancel Session
//                 </Button>
//               )} */}

//               {/* Feedback Button - Only for completed sessions with no feedback given */}
//               {session.status === "completed" && !session.feedback_given && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 text-yellow-700 hover:from-yellow-100 hover:to-orange-100 transition-all duration-200"
//                   onClick={() => onLeaveFeedback(session)}
//                 >
//                   <Star className="h-4 w-4 mr-2" />
//                   Leave Feedback
//                 </Button>
//               )}              {/* Feedback Already Given Indicator */}
//               {session.status === "completed" && session.feedback_given && (
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs">
//                   <CheckCircle className="h-3 w-3 text-green-600" />
//                   Feedback Submitted
//                 </div>
//               )}

//               {/* For debugging: show status when feedback is not given */}
//               {/* {session.status === "completed" && !session.feedback_given && (
//                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
//                   <span className="text-xs text-gray-500">No feedback given yet</span>
//                 </div>
//               )} */}
//             </div>
//           </div>
//         </div>
//       </Card>
//     </>
//   );
// };

// export default SessionCard;

// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   CheckCircle,
//   Clock,
//   Calendar,
//   Video,
//   XCircle,
//   Star,
//   ExternalLink,
//   Loader2,
// } from "lucide-react";
// import Image from "next/image";
// import { supabase } from "@/lib/supabase";

// const SessionCard = ({
//   session,
//   index,
//   mentorImageUrl,
//   statusDetails,
//   canJoin,
//   formatDate,
//   formatTimeRange,
//   onCancelSession,
//   onLeaveFeedback,
// }) => {  const [mentor, setMentor] = useState(session.mentor_data);
//   const [isLoadingMentor, setIsLoadingMentor] = useState(false);
//   const [sessionStatus, setSessionStatus] = useState(session.status);
//   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

//   // Get status details based on current sessionStatus
//   const getStatusDetails = (status) => {
//     const { Calendar, Clock, UserCheck, Award, AlertCircle } = require("lucide-react");

//     switch (status?.toLowerCase()) {
//       case 'confirmed':
//         return {
//           color: 'bg-green-100 text-green-800 border-green-200',
//           icon: <UserCheck className="h-3 w-3" />,
//           gradient: 'from-green-50 to-green-100'
//         };
//       case 'pending':
//         return {
//           color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//           icon: <Clock className="h-3 w-3" />,
//           gradient: 'from-yellow-50 to-yellow-100'
//         };
//       case 'canceled':
//         return {
//           color: 'bg-red-100 text-red-800 border-red-200',
//           icon: <AlertCircle className="h-3 w-3" />,
//           gradient: 'from-red-50 to-red-100'
//         };
//       case 'completed':
//         return {
//           color: 'bg-blue-100 text-blue-800 border-blue-200',
//           icon: <Award className="h-3 w-3" />,
//           gradient: 'from-blue-50 to-blue-100'
//         };
//       default:
//         return {
//           color: 'bg-gray-100 text-gray-800 border-gray-200',
//           icon: <Calendar className="h-3 w-3" />,
//           gradient: 'from-gray-50 to-gray-100'
//         };
//     }  };

//   // Fetch complete mentor data if necessary
//   useEffect(() => {
//     const fetchMentorData = async () => {
//       // If we don't have mentor data or missing essential fields, fetch it
//       if (!mentor || !mentor.first_name || !mentor.expertise) {
//         try {
//           setIsLoadingMentor(true);

//           // Ensure we have the mentor_id
//           if (!session.mentor_id) {
//             // console.error("No mentor_id found for session:", session.id);
//             return;
//           }

//           // Fetch complete mentor data
//           const { data, error } = await supabase
//             .from("mentor_data")
//             .select("*") // Select all fields to ensure we get everything
//             .eq("id", session.mentor_id)
//             .single();

//           if (error) {
//             // console.error("Error fetching mentor data:", error);
//             return;
//           }

//           if (data) {
//             // console.log("Updated mentor data fetched:", data);
//             setMentor(data);
//           }
//         } catch (err) {
//         //   console.error("Error in fetchMentorData:", err);
//         } finally {
//           setIsLoadingMentor(false);
//         }
//       }
//     };

//     fetchMentorData();
//   }, [session.mentor_id, mentor]);

//   // Check if confirmed session should be marked as completed
//   useEffect(() => {
//     const checkSessionCompletion = async () => {
//       // Only check for confirmed sessions with end times in the past
//       if (
//         session.status?.toLowerCase() === "confirmed" &&
//         session.end_time &&
//         new Date(session.end_time) < new Date()
//       ) {
//         try {
//           console.log("Marking session as completed in real-time:", session.id);
//           setIsUpdatingStatus(true);

//           // Update in database
//           const { error } = await supabase
//             .from("bookings")
//             .update({ status: "completed" })
//             .eq("id", session.id);

//           if (error) {
//             console.error("Error updating session status to completed:", error);
//             return;
//           }

//           // Update local state
//           setSessionStatus("completed");

//           console.log("Session marked as completed:", session.id);
//         } catch (err) {
//           console.error("Error in checkSessionCompletion:", err);
//         } finally {
//           setIsUpdatingStatus(false);
//         }
//       }
//     };

//     checkSessionCompletion();

//     // Set up an interval to check periodically
//     const intervalId = setInterval(checkSessionCompletion, 60000); // Check every minute

//     return () => clearInterval(intervalId); // Clean up on unmount
//   }, [session.id, session.status, session.end_time]);

//   // Use local sessionStatus instead of passed in session.status
//   const currentStatusDetails = statusDetails || getStatusDetails(sessionStatus);

// return (
//   <>
//     <style jsx>{`
//       @keyframes fadeInUp {
//         from {
//           opacity: 0;
//           transform: translateY(20px);
//         }
//         to {
//           opacity: 1;
//           transform: translateY(0);
//         }
//       }
//     `}</style>

//     <Card
//       key={session.id}
//       className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white"
//       style={{
//         animationDelay: `${index * 100}ms`,
//         animation: "fadeInUp 0.6s ease-out forwards",
//       }}
//     >
//       {/* Status Bar */}
//       <div className={`h-1 bg-gradient-to-r ${currentStatusDetails.gradient}`}></div>

//       <div className="p-4">
//         {/* Header Row */}
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-3">
//             {/* Compact Avatar */}
//             <div className="relative shrink-0">
//               <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden ring-2 ring-white shadow-sm">
//                 {mentorImageUrl ? (
//                   <Image
//                     src={mentorImageUrl}
//                     alt={`${mentor?.first_name || "Mentor"} ${mentor?.last_name || ""}`}
//                     fill
//                     sizes="48px"
//                     className="object-cover rounded-xl"
//                   />
//                 ) : (
//                   <div className="h-12 w-12 flex items-center justify-center text-lg font-bold text-indigo-700">
//                     {mentor?.first_name && mentor?.last_name
//                       ? `${mentor.first_name[0] || ""}${mentor.last_name[0] || ""}`.toUpperCase()
//                       : mentor?.first_name
//                         ? mentor.first_name[0].toUpperCase()
//                         : "M"}
//                   </div>
//                 )}
//               </div>
//               <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 h-3 w-3 rounded-full border-2 border-white"></div>
//             </div>

//             {/* Mentor Info */}
//             <div className="min-w-0 flex-1">
//               {isLoadingMentor ? (
//                 <div className="flex items-center gap-2">
//                   <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
//                   <span className="text-sm text-gray-500">Loading...</span>
//                 </div>
//               ) : (
//                 <>
//                   <h3 className="font-semibold text-gray-900 truncate">
//                     {mentor?.first_name
//                       ? `${mentor.first_name} ${mentor.last_name || ""}`
//                       : "Mentor"}
//                   </h3>
//                   <p className="text-sm text-gray-600 truncate">
//                     {mentor?.current_role || "Professional Mentor"}
//                   </p>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Status Badge */}
//           <span
//             className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border shrink-0 ${currentStatusDetails.color}`}
//           >
//             {currentStatusDetails.icon}
//             {sessionStatus
//               ? sessionStatus.charAt(0).toUpperCase() + sessionStatus.slice(1)
//               : "Unknown"}
//           </span>
//         </div>

//         {/* Session Details Row */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-4 text-sm text-gray-600">
//             <div className="flex items-center gap-1">
//               <Calendar className="h-4 w-4 text-blue-600" />
//               <span>{formatDate(session.start_time)}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Clock className="h-4 w-4 text-indigo-600" />
//               <span>{formatTimeRange(session.start_time, session.end_time)}</span>
//             </div>
//           </div>

//           {/* Experience Badge */}
//           {mentor?.experience_years && (
//             <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
//               {mentor.experience_years}+ years
//             </span>
//           )}
//         </div>

//         {/* Expertise Tags - Compact */}
//         {mentor?.expertise_area && (
//           <div className="flex flex-wrap gap-1 mb-3">
//             {Array.isArray(mentor?.expertise_area) ? (
//               mentor.expertise_area.slice(0, 2).map((area, idx) => (
//                 <span
//                   key={idx}
//                   className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100"
//                 >
//                   {area}
//                 </span>
//               ))
//             ) : (
//               <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">
//                 {mentor.expertise_area}
//               </span>
//             )}
//             {Array.isArray(mentor?.expertise_area) && mentor.expertise_area.length > 2 && (
//               <span className="text-xs text-gray-500 px-2 py-0.5">
//                 +{mentor.expertise_area.length - 2} more
//               </span>
//             )}
//           </div>
//         )}

//         {/* Notes - Compact */}
//         {session?.notes && (
//           <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
//             <span className="text-xs text-gray-500 font-medium">Notes: </span>
//             <span className="line-clamp-2">{session.notes}</span>
//           </div>
//         )}

//         {/* Action Buttons - Horizontal */}
//         <div className="flex items-center gap-2 flex-wrap">
//           {/* Join Meeting Button */}
//           {sessionStatus === "confirmed" && canJoin && session.meeting_link && (
//             <Button
//               size="sm"
//               className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
//             >
//               <a
//                 href={session.meeting_link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1"
//               >
//                 <Video className="h-3 w-3" />
//                 Join Meeting
//               </a>
//             </Button>
//           )}

//           {/* Feedback Button */}
//           {sessionStatus === "completed" && !session.feedback_given && (
//             <Button
//               variant="outline"
//               size="sm"
//               className="border-yellow-200 text-yellow-700 hover:bg-yellow-50"
//               onClick={() => onLeaveFeedback(session)}
//             >
//               <Star className="h-3 w-3 mr-1" />
//               Feedback
//             </Button>
//           )}

//           {/* Feedback Submitted */}
//           {sessionStatus === "completed" && session.feedback_given && (
//             <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
//               <CheckCircle className="h-3 w-3" />
//               Feedback Given
//             </div>
//           )}

//           {/* Update Status Indicator */}
//           {isUpdatingStatus && (
//             <span className="text-xs text-blue-500 flex items-center">
//               <div className="mr-1 h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
//               Updating...
//             </span>
//           )}
//         </div>
//       </div>
//     </Card>
//   </>
// );
// }

// export default SessionCard;
