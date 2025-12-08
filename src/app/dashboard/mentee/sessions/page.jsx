"use client";

import ComingSoon from "@/components/ComingSoon";
import { TrendingUp } from "lucide-react";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";
// import { TrendingUp } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// // Import components
// import SessionStats from "./components/SessionStats";
// import SessionFilter from "./components/SessionFilter";
// import SessionCard from "./components/SessionCard";
// import CancelDialog from "./components/CancelDialog";
// import FeedbackDialog from "./components/FeedbackDialog";
// import RescheduleApprovalDialog from "./components/RescheduleApprovalDialog";
// import EmptyState from "./components/EmptyState";
// import { LoadingState, ErrorState } from "./components/StateComponents";
// import { Calendar, Clock, UserCheck, Award, AlertCircle } from "lucide-react";

// export default function MenteeSessions() {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [sessions, setSessions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [actionLoading, setActionLoading] = useState({});
  
//   // State for feedback dialog
//   const [feedbackOpen, setFeedbackOpen] = useState(false);
//   const [feedbackSession, setFeedbackSession] = useState(null);
//   const [feedbackText, setFeedbackText] = useState("");
//   const [feedbackRating, setFeedbackRating] = useState(5);
//   const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

//   // State for cancellation dialog
//   const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
//   const [sessionToCancel, setSessionToCancel] = useState(null);
//   const [cancelReason, setCancelReason] = useState("");
//   const [isCancelling, setIsCancelling] = useState(false);

//   // State for reschedule approval dialog
//   const [rescheduleApprovalOpen, setRescheduleApprovalOpen] = useState(false);
//   const [sessionToApprove, setSessionToApprove] = useState(null);
//   const [isApprovingReschedule, setIsApprovingReschedule] = useState(false);
  
//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   const fetchSessions = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       // Get the current authenticated user
//       const { data: { user }, error: userError } = await supabase.auth.getUser();

//       if (userError || !user) {
//         throw new Error("You must be logged in to view your sessions");
//       }

//       console.log("Current user ID:", user.id);

//       // Method 1: Try to get mentee data first
//       const { data: menteeData, error: menteeError } = await supabase
//         .from("mentee_data")
//         .select("id")
//         .eq("user_id", user.id)
//         .single();

//       let bookingsData = [];

//       if (menteeData && !menteeError) {
//         console.log("Found mentee data:", menteeData);

//         // Fetch bookings using mentee_id from mentee_data table
//         const { data: bookingsFromMenteeData, error: bookingsError1 } = await supabase
//           .from("bookings")
//           .select("*")
//           .eq("mentee_id", menteeData.id)
//           .order("start_time", { ascending: true });

//         if (bookingsError1) {
//           console.error("Error fetching bookings with mentee_id:", bookingsError1);
//         } else {
//           bookingsData = bookingsFromMenteeData || [];
//           console.log("Bookings found with mentee_id:", bookingsData.length);
//         }
//       }

//       // Method 2: If no bookings found or no mentee data, try direct user_id lookup
//       if (bookingsData.length === 0) {
//         console.log("Trying direct user_id lookup in bookings table");

//         const { data: bookingsFromUserId, error: bookingsError2 } = await supabase
//           .from("bookings")
//           .select("*")
//           .eq("mentee_id", user.id) // Assuming mentee_id might store user_id directly
//           .order("start_time", { ascending: true });

//         if (bookingsError2) {
//           console.error("Error fetching bookings with user_id:", bookingsError2);
//         } else {
//           bookingsData = bookingsFromUserId || [];
//           console.log("Bookings found with user_id:", bookingsData.length);
//         }
//       }

//       // If we have bookings, fetch mentor details for each booking
//       if (bookingsData && bookingsData.length > 0) {
//         // Get unique mentor IDs from the bookings
//         const mentorIds = [...new Set(bookingsData.map(booking => booking.mentor_id))].filter(id => id);

//         console.log("Mentor IDs to fetch:", mentorIds);

//         if (mentorIds.length > 0) {          // Fetch mentor details for these IDs
//           const { data: mentorsData, error: mentorsError } = await supabase
//             .from("mentor_data")
//             .select("*")
//             .in("id", mentorIds);

//           if (mentorsError) {
//             console.error("Error fetching mentor data:", mentorsError);
//             // Continue without mentor data rather than failing completely
//           }

//           // Create a map of mentor data by ID for easy lookup
//           const mentorsMap = {};
//           if (mentorsData) {
//             mentorsData.forEach(mentor => {
//               mentorsMap[mentor.id] = mentor;
//             });
//           }

//           // Add mentor data to each booking
//           bookingsData.forEach(booking => {
//             booking.mentor_data = mentorsMap[booking.mentor_id] || null;
//           });
//         }
        
//         // Check and update sessions that should be marked as completed
//         const now = new Date();
//         const sessionsToUpdate = [];
        
//         bookingsData = bookingsData.map(booking => {
//           // Only update sessions with status 'confirmed'
//           if (booking.status?.toLowerCase() === 'confirmed' && 
//               booking.end_time && 
//               new Date(booking.end_time) < now) {
            
//             // Mark for database update
//             sessionsToUpdate.push(booking.id);
            
//             // Update in our local data
//             return { ...booking, status: 'completed' };
//           }
//           return booking;
//         });
        
//         // Update any sessions that need to be marked as completed in the database
//         if (sessionsToUpdate.length > 0) {
//           console.log(`Marking ${sessionsToUpdate.length} sessions as completed:`, sessionsToUpdate);
          
//           // Update sessions in batches to avoid potential issues with large updates
//           const batchSize = 10;
//           for (let i = 0; i < sessionsToUpdate.length; i += batchSize) {
//             const batch = sessionsToUpdate.slice(i, i + batchSize);
//             await supabase
//               .from("bookings")
//               .update({ status: 'completed' })
//               .in("id", batch);
//           }
//         }
//       }

//       console.log("Final bookings data:", bookingsData);
//       setSessions(bookingsData || []);

//       // If no sessions found, log some debugging info
//       if (!bookingsData || bookingsData.length === 0) {
//         console.log("No sessions found. Debugging info:");
//         console.log("- User ID:", user.id);
//         console.log("- Mentee data:", menteeData);
//         console.log("- Mentee error:", menteeError);

//         // Let's also check what's actually in the bookings table
//         const { data: allBookings, error: allBookingsError } = await supabase
//           .from("bookings")
//           .select("id, mentee_id, mentor_id, status")
//           .limit(5);

//         if (!allBookingsError) {
//           console.log("Sample bookings in table:", allBookings);
//         }
//       }

//     } catch (error) {
//       console.error("Error fetching sessions:", error);
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle session cancellation
//   const handleCancelSession = async () => {
//     if (!sessionToCancel) return;
    
//     try {
//       setIsCancelling(true);
      
//       // Update booking status to canceled in database
//       const { error } = await supabase
//         .from("bookings")
//         .update({ 
//           status: 'canceled',
//           cancel_reason: cancelReason,
//           canceled_at: new Date().toISOString(),
//           canceled_by: 'mentee'
//         })
//         .eq("id", sessionToCancel.id);

//       if (error) throw error;

//       // Update session in local state
//       setSessions(prev => 
//         prev.map(session => 
//           session.id === sessionToCancel.id 
//             ? { ...session, status: 'canceled', cancel_reason: cancelReason } 
//             : session
//         )
//       );

//       toast({
//         title: "Session canceled",
//         description: "The mentoring session has been canceled successfully.",
//         variant: "success",
//       });

//       // Close dialog and reset state
//       setCancelDialogOpen(false);
//       setSessionToCancel(null);
//       setCancelReason("");
      
//     } catch (error) {
//       console.error("Error canceling session:", error);
//       toast({
//         title: "Error",
//         description: "Failed to cancel the session. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsCancelling(false);
//     }
//   };

//   // Handle reschedule approval
//   const handleApproveReschedule = async () => {
//     if (!sessionToApprove) return;
    
//     try {
//       setIsApprovingReschedule(true);
      
//       // Update booking status to confirmed (approve the reschedule)
//       const { error } = await supabase
//         .from("bookings")
//         .update({ 
//           status: 'confirmed',
//           reschedule_approved_at: new Date().toISOString(),
//         })
//         .eq("id", sessionToApprove.id);

//       if (error) throw error;

//       // Update session in local state
//       setSessions(prev => 
//         prev.map(session => 
//           session.id === sessionToApprove.id 
//             ? { 
//                 ...session, 
//                 status: 'confirmed',
//                 reschedule_approved_at: new Date().toISOString(),            
//               } 
//             : session
//         )
//       );

//       toast({
//         title: "Reschedule approved",
//         description: "The new session time has been confirmed.",
//         variant: "success",
//       });

//       // Close dialog and reset state
//       setRescheduleApprovalOpen(false);
//       setSessionToApprove(null);
      
//     } catch (error) {
//       console.error("Error approving reschedule:", error);
//       toast({
//         title: "Error",
//         description: "Failed to approve the reschedule. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsApprovingReschedule(false);
//     }
//   };

//   // Handle reschedule decline
//   const handleDeclineReschedule = async (declineReason = "") => {
//     if (!sessionToApprove) return;
    
//     try {
//       setIsApprovingReschedule(true);
      
//       // Update booking status back to confirmed with original times
//       const updateData = {
//         start_time: sessionToApprove.original_start_time,
//         end_time: sessionToApprove.original_end_time,
//         status: 'confirmed',
//         reschedule_declined_at: new Date().toISOString(),
//         reschedule_decline_reason: declineReason || 'Mentee declined the reschedule request'
//       };

//       const { error } = await supabase
//         .from("bookings")
//         .update(updateData)
//         .eq("id", sessionToApprove.id);

//       if (error) throw error;

//       // Update session in local state
//       setSessions(prev => 
//         prev.map(session => 
//           session.id === sessionToApprove.id 
//             ? { 
//                 ...session, 
//                 start_time: sessionToApprove.original_start_time,
//                 end_time: sessionToApprove.original_end_time,
//                 status: 'canceled',
//                 reschedule_declined_at: new Date().toISOString(),
//                 reschedule_decline_reason: declineReason
//               } 
//             : session
//         )
//       );

//       toast({
//         title: "Reschedule declined",
//         description: "The session will remain at the original time.",
//         variant: "success",
//       });

//       // Close dialog and reset state
//       setRescheduleApprovalOpen(false);
//       setSessionToApprove(null);
      
//     } catch (error) {
//       console.error("Error declining reschedule:", error);
//       toast({
//         title: "Error",
//         description: "Failed to decline the reschedule. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsApprovingReschedule(false);
//     }
//   };  // Handle feedback submission
//   const handleSubmitFeedback = async () => {
//     console.log("handleSubmitFeedback called with session:", feedbackSession);
    
//     if (!feedbackSession || !feedbackSession.mentor_data) {
//       console.error("Missing feedbackSession or mentor_data:", feedbackSession);
//       return;
//     }
    
//     try {
//       setIsSubmittingFeedback(true);
//       console.log("Starting feedback submission process");
      
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error("You must be logged in to submit feedback");
      
//       // Get the mentee data to include name in review
//       const { data: menteeData } = await supabase
//         .from("mentee_data")
//         .select("name, email")
//         .eq("user_id", user.id)
//         .single();
        
//       if (!menteeData) throw new Error("Could not find your profile data");
      
//       // Get current reviews
//       const { data: mentorData, error: mentorError } = await supabase
//         .from("mentor_data")
//         .select("reviews")
//         .eq("id", feedbackSession.mentor_id)
//         .single();
        
//       if (mentorError) throw mentorError;
      
//       // Prepare the new review according to required schema
//       const newReview = {
//         id: `review-${Date.now()}`,
//         rating: feedbackRating,
//         comment: feedbackText,
//         reviewer: {
//           id: user.id,
//           name: menteeData.name,
//           email: menteeData.email || user.email
//         },
//         created_at: new Date().toISOString()
//       };
      
//       // Append new review to existing reviews or create new array
//       const existingReviews = Array.isArray(mentorData.reviews) ? mentorData.reviews : [];
//       const updatedReviews = [...existingReviews, newReview];
      
//       // Update mentor_data with new reviews
//       const { error: updateError } = await supabase
//         .from("mentor_data")
//         .update({ reviews: updatedReviews })
//         .eq("id", feedbackSession.mentor_id);
        
//       if (updateError) throw updateError;
//         // Update booking to reflect feedback was given
//       const { data: bookingUpdateData, error: bookingUpdateError } = await supabase
//         .from("bookings")
//         .update({ feedback_given: true })
//         .eq("id", feedbackSession.id)
//         .select();
        
//       if (bookingUpdateError) {
//         // console.error("Error updating booking with feedback_given:", bookingUpdateError);
//         throw bookingUpdateError;
//       }
      
//       // console.log("Booking updated with feedback_given=true:", bookingUpdateData);
        
//       // Update local state to reflect feedback given
//       setSessions(prev => {
//         const updated = prev.map(session => 
//           session.id === feedbackSession.id 
//             ? { ...session, feedback_given: true } 
//             : session
//         );      
//         // console.log("Updated sessions in state:", updated.find(s => s.id === feedbackSession.id));
//         return updated;
//       });
      
//       toast({
//         title: "Feedback submitted",
//         description: "Thank you for sharing your feedback!",
//         variant: "success",
//       });
      
//       // Refresh sessions to ensure we have the most up-to-date data
//       await fetchSessions();
//         // Close dialog and reset state
//       // console.log("Closing feedback dialog and resetting state");
//       setFeedbackOpen(false);
//       setFeedbackText("");
//       setFeedbackRating(5);
      
//       // Log the updated session before clearing
//       // console.log("Updated session before clearing:", feedbackSession);
//       setFeedbackSession(null);
      
//     } catch (error) {
//       // console.error("Error submitting feedback:", error);
//       toast({
//         title: "Error",
//         description: "Failed to submit feedback. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmittingFeedback(false);
//     }
//   };

//   // Format date: "Monday, January 1, 2023"
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Format time: "10:00 AM - 11:00 AM"
//   const formatTimeRange = (startTime, endTime) => {
//     const start = new Date(startTime);
//     const end = new Date(endTime);

//     const formatTime = (date) => {
//       return date.toLocaleTimeString('en-US', {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true
//       });
//     };

//     return `${formatTime(start)} - ${formatTime(end)}`;
//   };

//   // Get status badge color and icon
//   const getStatusDetails = (status) => {
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
//       case 'pending_reschedule':
//         return {
//           color: 'bg-orange-100 text-orange-800 border-orange-200',
//           icon: <Calendar className="h-3 w-3" />,
//           gradient: 'from-orange-50 to-orange-100'
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
//     }
//   };

//   // Filter sessions based on status
//   const filteredSessions = filterStatus === 'all'
//     ? sessions
//     : sessions.filter(session => session.status?.toLowerCase() === filterStatus.toLowerCase());

//   // Get mentor profile image URL
//   const getMentorImageUrl = (profileUrl) => {
//     if (!profileUrl) return null;

//     // Check if profileUrl is already a full URL
//     if (profileUrl.startsWith('http')) {
//       return profileUrl;
//     }

//     // Otherwise, get public URL from Supabase
//     const { data } = supabase.storage
//       .from('media')
//       .getPublicUrl(profileUrl);

//     return data?.publicUrl || null;
//   };

//   // Check if a session can be joined (within 30 minutes of start time)
//   const canJoinSession = (session) => {
//     if (session.status !== 'confirmed') return false;
    
//     const sessionStartTime = new Date(session.start_time);
//     const currentTime = new Date();
//     const timeDifferenceMs = sessionStartTime.getTime() - currentTime.getTime();
//     const timeDifferenceMinutes = timeDifferenceMs / (1000 * 60);
    
//     // Allow joining within 30 minutes before start and up to 30 minutes after
//     return timeDifferenceMinutes <= 30 && timeDifferenceMinutes >= -30;
//   };

//   const getSessionStats = () => {
//     const total = sessions.length;
//     const completed = sessions.filter(s => s.status?.toLowerCase() === 'completed').length;
//     const upcoming = sessions.filter(s => s.status?.toLowerCase() === 'confirmed').length;
//     const pending = sessions.filter(s => s.status?.toLowerCase() === 'pending').length;
//     const pendingReschedule = sessions.filter(s => s.status?.toLowerCase() === 'pending_reschedule').length;

//     return { total, completed, upcoming, pending, pendingReschedule };
//   };

//   const stats = getSessionStats();
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30">
//       <div className="container mt-10 mx-auto px-4 py-4">
//         {/* Header Section with Stats */}
//         <div className="mb-4">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-2">
//                 My Sessions
//               </h1>
//               <p className="text-gray-600 flex items-center">
//                 <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
//                 Track your mentoring journey and upcoming sessions
//               </p>
//             </div>

//             {/* Quick Stats */}
//             {sessions.length > 0 && <SessionStats stats={stats} />}
//           </div>
//         </div>

//         {/* Enhanced Filter Section */}
//         <SessionFilter 
//           filterStatus={filterStatus}
//           setFilterStatus={setFilterStatus}
//           stats={stats}
//           sessions={sessions}
//         />

//         {/* Loading, Error, and Empty States */}
//         {isLoading ? (
//           <LoadingState />
//         ) : error ? (
//           <ErrorState error={error} />
//         ) : filteredSessions.length === 0 ? (
//           <EmptyState filterStatus={filterStatus} router={router} />
//         ) : (
//           <div className="grid grid-cols-1 gap-3">
//             {filteredSessions.map((session, index) => {
//               const mentorImageUrl = session.mentor_data?.profile_url ? getMentorImageUrl(session.mentor_data.profile_url) : null;
//               const statusDetails = getStatusDetails(session.status);
//               const canJoin = canJoinSession(session);
              
//               return (
//                 <SessionCard
//                   key={session.id}
//                   session={session}
//                   index={index}
//                   mentorImageUrl={mentorImageUrl}
//                   statusDetails={statusDetails}
//                   canJoin={canJoin}
//                   formatDate={formatDate}
//                   formatTimeRange={formatTimeRange}
//                   onCancelSession={() => {
//                     setSessionToCancel(session);
//                     setCancelDialogOpen(true);
//                   }}
//                   onLeaveFeedback={() => {
//                     // console.log("Setting feedback session:", session);
//                     // console.log("Feedback status before dialog:", session.feedback_given);
//                     setFeedbackSession(session);
//                     setFeedbackOpen(true);
//                   }}
//                   onRescheduleApproval={() => {
//                     setSessionToApprove(session);
//                     setRescheduleApprovalOpen(true);
//                   }}
//                 />
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Dialogs */}
//       <CancelDialog
//         open={cancelDialogOpen}
//         onOpenChange={setCancelDialogOpen}
//         cancelReason={cancelReason}
//         setCancelReason={setCancelReason}
//         onCancelSession={handleCancelSession}
//         isCancelling={isCancelling}
//       />      <FeedbackDialog
//         open={feedbackOpen}
//         onOpenChange={setFeedbackOpen}
//         feedbackText={feedbackText}
//         setFeedbackText={setFeedbackText}
//         feedbackRating={feedbackRating}
//         setFeedbackRating={setFeedbackRating}
//         isSubmittingFeedback={isSubmittingFeedback}
//         onSubmitFeedback={handleSubmitFeedback}
//       />

//       <RescheduleApprovalDialog
//         isOpen={rescheduleApprovalOpen}
//         onClose={() => {
//           setRescheduleApprovalOpen(false);
//           setSessionToApprove(null);
//         }}
//         onApprove={handleApproveReschedule}
//         onDecline={handleDeclineReschedule}
//         isLoading={isApprovingReschedule}
//         session={sessionToApprove}
//         mentorName={sessionToApprove?.mentor_data ? 
//           `${sessionToApprove.mentor_data.first_name} ${sessionToApprove.mentor_data.last_name}` : 
//           'Mentor'
//         }
//       />

//       {/* Add CSS animations */}
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

//       {/* Add CSS animations */}
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
//     </div>
//   );
// }



export default function MenteeSessions() {
  return (
     <div className="min-h-screen">   
       {/* <div> */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">         
      <h1 className="text-3xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
                My Sessions
              </h1>
               <p className="text-gray-600 flex items-center"> Track your mentoring journey and upcoming sessions</p>
              </div> 
              {/* </div>  */}

                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-1">
                <ComingSoon />
                </div>
                </div>
           </div>
  )
}