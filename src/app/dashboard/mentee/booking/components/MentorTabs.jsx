// import { useState, useEffect } from "react";
// import { User, Briefcase, Star, Calendar, Building, Send, Trash2, AlertTriangle } from "lucide-react";
// import { supabase } from "@/lib/supabase";
// import { useToast } from "@/hooks/use-toast";

// export default function MentorTabs({ mentor }) {
//   const [activeTab, setActiveTab] = useState("about");
//   const [pastExperiences, setPastExperiences] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const { toast } = useToast();
  
//   // Parse past experience data
//   useEffect(() => {
//     if (mentor?.past_experience) {
//       try {
//         if (Array.isArray(mentor.past_experience)) {
//           setPastExperiences(mentor.past_experience);
//         } else if (typeof mentor.past_experience === 'string') {
//           const parsed = JSON.parse(mentor.past_experience);
//           setPastExperiences(Array.isArray(parsed) ? parsed : [parsed]);
//         } else if (typeof mentor.past_experience === 'object') {
//           if (mentor.past_experience.role || mentor.past_experience.company) {
//             setPastExperiences([mentor.past_experience]);
//           } else {
//             const experiences = Object.values(mentor.past_experience)
//               .filter(item => item && typeof item === 'object');
//             setPastExperiences(experiences.length > 0 ? experiences : [mentor.past_experience]);
//           }
//         }
//       } catch (error) {
//         setPastExperiences([]);
//       }
//     } else {
//       setPastExperiences([]);
//     }
//   }, [mentor]);

//   // Load reviews - Fixed to fetch fresh data from database
//   useEffect(() => {
//     const loadReviews = async () => {
//       if (!mentor?.id) return;
      
//       try {
//         // Fetch fresh mentor data to get current reviews
//         const { data: mentorData, error } = await supabase
//           .from('mentor_data')
//           .select('reviews')
//           .eq('id', mentor.id)
//           .single();
        
//         if (error) {
//           console.error("Error fetching reviews:", error);
//           setReviews([]);
//           return;
//         }
        
//         if (mentorData?.reviews) {
//           let reviewsData;
          
//           if (typeof mentorData.reviews === 'string') {
//             try {
//               reviewsData = JSON.parse(mentorData.reviews);
//             } catch (e) {
//               reviewsData = [];
//             }
//           } else if (Array.isArray(mentorData.reviews)) {
//             reviewsData = mentorData.reviews;
//           } else if (typeof mentorData.reviews === 'object' && mentorData.reviews !== null) {
//             reviewsData = [mentorData.reviews];
//           } else {
//             reviewsData = [];
//           }
          
//           const validReviews = reviewsData
//             .filter(review => review && typeof review === 'object')
//             .map(review => ({
//               ...review,
//               id: review.id || crypto.randomUUID()
//             }))
//             .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));
          
//           setReviews(validReviews);
//         } else {
//           setReviews([]);
//         }
//       } catch (error) {
//         console.error("Error loading reviews:", error);
//         setReviews([]);
//       }
//     };
    
//     loadReviews();
//   }, [mentor?.id]);

//   // Get current authenticated user - Fixed to remove non-existent table reference
//   useEffect(() => {
//     const getCurrentUser = async () => {
//       try {
//         const { data: { session } } = await supabase.auth.getSession();
//         if (session?.user) {
//           // Fetch fresh mentee data to ensure we have current first_name and last_name
//           const { data: menteeData, error } = await supabase
//             .from('mentee_data')
//             .select('id, user_id, first_name, last_name')
//             .eq('user_id', session.user.id)
//             .single();
          
//           if (!error && menteeData && menteeData.first_name && menteeData.last_name) {
//             setCurrentUser({
//               ...menteeData,
//               email: session.user.email
//             });
//           } else {
//             // Fallback to user_metadata if mentee data is incomplete
//             setCurrentUser({
//               id: session.user.id,
//               user_id: session.user.id,
//               email: session.user.email,
//               first_name: session.user.user_metadata?.first_name || '',
//               last_name: session.user.user_metadata?.last_name || ''
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching current user:", error);
//       }
//     };
    
//     getCurrentUser();
//   }, []);

//   // Submit review - Fixed to ensure proper database update
//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!currentUser) {
//       toast({
//         title: "Authentication Required",
//         description: "Please log in to leave a review",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     if (!newReview.comment.trim()) {
//       toast({
//         title: "Review Required",
//         description: "Please enter a review comment",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     if (!currentUser.first_name || !currentUser.last_name) {
//       toast({
//         title: "Profile Incomplete",
//         description: "Please complete your profile with first and last name before submitting a review",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     try {
//       setIsSubmitting(true);
      
//       // First, fetch the current reviews from database to ensure we have the latest data
//       const { data: currentMentorData, error: fetchError } = await supabase
//         .from('mentor_data')
//         .select('reviews')
//         .eq('id', mentor.id)
//         .single();
      
//       if (fetchError) throw fetchError;
      
//       // Parse current reviews
//       let currentReviews = [];
//       if (currentMentorData?.reviews) {
//         try {
//           if (typeof currentMentorData.reviews === 'string') {
//             currentReviews = JSON.parse(currentMentorData.reviews);
//           } else if (Array.isArray(currentMentorData.reviews)) {
//             currentReviews = currentMentorData.reviews;
//           } else if (typeof currentMentorData.reviews === 'object' && currentMentorData.reviews !== null) {
//             currentReviews = [currentMentorData.reviews];
//           }
//         } catch (error) {
//           currentReviews = [];
//         }
//       }
      
//       // Ensure valid array and entries have IDs
//       if (!Array.isArray(currentReviews)) currentReviews = [];
      
//       const validReviews = currentReviews
//         .filter(review => review && typeof review === 'object')
//         .map(review => ({
//           ...review,
//           id: review.id || crypto.randomUUID()
//         }));
      
//       // Create the new review object
//       const reviewObj = {
//         id: crypto.randomUUID(),
//         rating: newReview.rating,
//         comment: newReview.comment.trim(),
//         created_at: new Date().toISOString(),
//         reviewer: {
//           id: currentUser.id || currentUser.user_id,
//           name: `${currentUser.first_name} ${currentUser.last_name}`,
//           // profile_url: currentUser.profile_url || null,
//           email: currentUser.email
//         }
//       };
      
//       // Add new review at beginning
//       const updatedReviews = [reviewObj, ...validReviews];
      
//       // Update in Supabase
//       const { error } = await supabase
//         .from('mentor_data')
//         .update({ reviews: updatedReviews })
//         .eq('id', mentor.id);
      
//       if (error) throw error;
      
//       // Update local state
//       setReviews(updatedReviews);
//       setNewReview({ rating: 5, comment: "" });
      
//       toast({
//         title: "Review Submitted!",
//         description: "Thank you for sharing your feedback!",
//       });
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       toast({
//         title: "Submission Failed",
//         description: "Unable to submit review. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Delete review - Fixed to ensure proper database update
//   const handleDeleteReview = async (reviewId) => {
//     if (!currentUser || !reviewId) return;
    
//     if (!window.confirm("Are you sure you want to delete this review?")) return;
    
//     try {
//       // First, fetch the current reviews from database
//       const { data: currentMentorData, error: fetchError } = await supabase
//         .from('mentor_data')
//         .select('reviews')
//         .eq('id', mentor.id)
//         .single();
      
//       if (fetchError) throw fetchError;
      
//       // Parse current reviews
//       let currentReviews = [];
//       if (currentMentorData?.reviews) {
//         try {
//           if (typeof currentMentorData.reviews === 'string') {
//             currentReviews = JSON.parse(currentMentorData.reviews);
//           } else if (Array.isArray(currentMentorData.reviews)) {
//             currentReviews = currentMentorData.reviews;
//           } else if (typeof currentMentorData.reviews === 'object' && currentMentorData.reviews !== null) {
//             currentReviews = [currentMentorData.reviews];
//           }
//         } catch (error) {
//           currentReviews = [];
//         }
//       }
      
//       // Ensure valid array
//       if (!Array.isArray(currentReviews)) currentReviews = [];
      
//       // Filter out the review to delete
//       const updatedReviews = currentReviews.filter(review => review?.id !== reviewId);
      
//       // Update in database
//       const { error } = await supabase
//         .from('mentor_data')
//         .update({ reviews: updatedReviews })
//         .eq('id', mentor.id);
      
//       if (error) throw error;
      
//       // Update local state
//       setReviews(updatedReviews);
      
//       toast({
//         title: "Review Deleted",
//         description: "Your review has been successfully removed",
//       });
//     } catch (error) {
//       console.error("Error deleting review:", error);
//       toast({
//         title: "Delete Failed",
//         description: "Unable to delete review. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   // Check if review belongs to current user
//   const isUserReview = (review) => {
//     if (!currentUser || !review?.reviewer) return false;
    
//     const reviewerId = review.reviewer.id || review.reviewer.user_id;
//     const currentUserId = currentUser.id || currentUser.user_id;
    
//     if (reviewerId && currentUserId && String(reviewerId) === String(currentUserId)) return true;
    
//     const reviewerEmail = review.reviewer.email;
//     const currentUserEmail = currentUser.email;
    
//     if (reviewerEmail && currentUserEmail && reviewerEmail.toLowerCase() === currentUserEmail.toLowerCase()) return true;
    
//     return false;
//   };

//   // Star rating component
//   const StarRating = ({ rating, onChange }) => (
//     <div className="flex items-center space-x-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <button
//           key={star}
//           type="button"
//           onClick={() => onChange && onChange(star)}
//           className={`text-lg ${star <= rating ? "text-amber-400" : "text-gray-300"}`}
//           aria-label={`Rate ${star} out of 5 stars`}
//         >
//           ★
//         </button>
//       ))}
//     </div>
//   );

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
//       {/* Tab Headers */}
//       <div className="flex border-b border-gray-200 bg-gray-50">
//         <button
//           className={`px-6 py-4 font-semibold text-sm flex-1 transition-all duration-200 ${
//             activeTab === "about"
//               ? "bg-white border-b-2 border-black text-black shadow-sm"
//               : "text-gray-600 hover:text-black hover:bg-gray-100"
//           }`}
//           onClick={() => setActiveTab("about")}
//         >
//           <div className="flex items-center justify-center gap-2">
//             <User size={16} />
//             About
//           </div>
//         </button>
//         <button
//           className={`px-6 py-4 font-semibold text-sm flex-1 transition-all duration-200 ${
//             activeTab === "experience"
//               ? "bg-white border-b-2 border-black text-black shadow-sm"
//               : "text-gray-600 hover:text-black hover:bg-gray-100"
//           }`}
//           onClick={() => setActiveTab("experience")}
//         >
//           <div className="flex items-center justify-center gap-2">
//             <Briefcase size={16} />
//             Experience
//           </div>
//         </button>
//         <button
//           className={`px-6 py-4 font-semibold text-sm flex-1 transition-all duration-200 ${
//             activeTab === "reviews"
//               ? "bg-white border-b-2 border-black text-black shadow-sm"
//               : "text-gray-600 hover:text-black hover:bg-gray-100"
//           }`}
//           onClick={() => setActiveTab("reviews")}
//         >
//           <div className="flex items-center justify-center gap-2">
//             <Star size={16} />
//             Reviews
//           </div>
//         </button>
//       </div>

//       {/* Tab Content */}
//       <div className="p-6">
//         {activeTab === "about" && (
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <User size={20} className="text-purple-600" />
//               <h2 className="text-xl font-bold text-black">About Me</h2>
//             </div>
//             <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//               <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//                 {mentor.bio || "No bio available yet."}
//               </p>
//             </div>
//           </div>
//         )}

//         {activeTab === "experience" && (
//           <div>
//             <div className="flex items-center gap-2 mb-6">
//               <Briefcase size={20} className="text-blue-600" />
//               <h2 className="text-xl font-bold text-black">Professional Experience</h2>
//             </div>
//               {pastExperiences && pastExperiences.length > 0 ? (
//               <div className="space-y-4">
//                 {pastExperiences.map((exp, index) => (
//                   <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
//                     <div className="flex items-start gap-4">
//                       <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
//                         <Building size={20} />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h3 className="text-lg font-bold text-black mb-1">
//                           {exp.role || "Role not specified"}
//                         </h3>
//                         <div className="flex items-center gap-3 mb-2">
//                           <span className="text-blue-600 font-medium">
//                             {exp.company || "Company not specified"}
//                           </span>
//                           <div className="flex items-center gap-1 text-gray-600 text-sm">
//                             <Calendar size={14} className="text-green-600" />
//                             <span>{exp.duration || "Duration not specified"}</span>
//                           </div>
//                         </div>
//                         {exp.description && (
//                           <p className="text-gray-700 text-sm leading-relaxed">
//                             {exp.description}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ): (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
//                   <Briefcase className="text-gray-400" size={24} />
//                 </div>
//                 <p className="text-gray-500 font-medium">No experience listed yet</p>
//               </div>
//             )}
//           </div>
//         )}

//         {activeTab === "reviews" && (
//           <div>
//             <div className="flex items-center gap-2 mb-6">
//               <Star size={20} className="text-amber-600" />
//               <h2 className="text-xl font-bold text-black">Reviews & Feedback</h2>
//             </div>
            
//             {/* Review submission form */}
//             {/* <div className="mb-8 bg-gray-50 border border-gray-200 rounded-xl p-5">
//               <h3 className="text-lg font-medium mb-3">Write a Review</h3>
              
//               {!currentUser ? (
//                 <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
//                   <div className="flex justify-center mb-3">
//                     <AlertTriangle className="text-yellow-500" />
//                   </div>
//                   <p className="text-sm text-gray-700 mb-2">
//                     Please log in to leave a review for this mentor.
//                   </p>
//                 </div>
//               ) : (
//                 <form onSubmit={handleReviewSubmit}>
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Rating
//                     </label>
//                     <StarRating
//                       rating={newReview.rating}
//                       onChange={(rating) => setNewReview({...newReview, rating})}
//                     />
//                   </div>
                  
//                   <div className="mb-4">
//                     <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">
//                       Your Review
//                     </label>
//                     <textarea
//                       id="review-comment"
//                       value={newReview.comment}
//                       onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Share your experience with this mentor..."
//                       required
//                     />
//                   </div>
                  
//                   <button
//                     type="submit"
//                     disabled={isSubmitting || !newReview.comment.trim()}
//                     className={`px-4 py-2 rounded-lg bg-black text-white flex items-center justify-center gap-2 hover:bg-gray-800 ${
//                       (isSubmitting || !newReview.comment.trim()) ? "opacity-50 cursor-not-allowed" : ""
//                     }`}
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         Submitting...
//                       </>
//                     ) : (
//                       <>
//                         <Send size={14} />
//                         Submit Review
//                       </>
//                     )}
//                   </button>
//                 </form>
//               )}
//             </div> */}
            
//             {/* Reviews list */}
//             {reviews && reviews.length > 0 ? (
//               <div className="space-y-6">
//                 {reviews.map((review, index) => {
//                   if (!review || typeof review !== 'object') return null;
                    
//                   const reviewId = review.id || `review-${index}`;
//                   const reviewerName = review.reviewer?.name || "Anonymous User";
//                   const rating = typeof review.rating === 'number' ? review.rating : 5;
//                   const comment = review.comment || 'No comment provided';
                  
//                   let formattedDate = 'No date';
//                   if (review.created_at) {
//                     try {
//                       formattedDate = new Date(review.created_at).toLocaleDateString();
//                     } catch (e) {
//                       // Keep default value
//                     }
//                   }
                  
//                   return (
//                     <div 
//                       key={reviewId} 
//                       className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
//                     >
//                       <div className="flex justify-between items-start mb-3">
//                         <div className="flex items-center gap-3">
//                           {/* Avatar placeholder or profile image */}
//                           {/* <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
//                             {review.reviewer?.profile_url ? (
//                               <img 
//                                 src={review.reviewer.profile_url} 
//                                 alt={reviewerName.charAt(0).toUpperCase()}
//                                 className="w-full h-full object-cover"
//                               />
//                             ) : (
//                               <span className="font-medium text-sm">
//                                 {reviewerName.charAt(0).toUpperCase()}
//                               </span>
//                             )}
//                           </div> */}

//                           {/* Avatar with first letters of first and last name */}
//                           <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
//                             <span className="font-medium text-sm">
//                               {review.reviewer?.name ? (
//                                 <>
//                                   {review.reviewer.name.split(' ')[0]?.charAt(0)?.toUpperCase() || ''}
//                                   {review.reviewer.name.split(' ')[1]?.charAt(0)?.toUpperCase() || ''}
//                                 </>
//                               ) : (
//                                 'A'
//                               )}
//                             </span>
//                           </div>
                          
//                           <div>
//                             <div className="font-medium text-black">
//                               {reviewerName}
//                             </div>
//                             <div className="mt-1">
//                               <StarRating rating={rating} />
//                             </div>
//                           </div>
//                         </div>
                        
//                         {/* {isUserReview(review) && (
//                           <button
//                             onClick={() => handleDeleteReview(reviewId)}
//                             className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
//                             aria-label="Delete review"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         )} */}
//                       </div>
                      
//                       <div className="text-gray-700 text-sm leading-relaxed mb-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                         {comment}
//                       </div>
                      
//                       <div className="text-xs text-gray-500 flex items-center gap-1">
//                         <Calendar size={12} />
//                         {formattedDate}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center mx-auto mb-4">
//                   <Star className="text-amber-400" size={24} />
//                 </div>
//                 <p className="text-gray-600 font-medium mb-2">No reviews yet</p>
//                 <p className="text-gray-500 text-sm">Be the first to leave a review after your mentoring session!</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { User, Briefcase, Star, Calendar, Building, Send, Trash2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function MentorTabs({ mentor }) {
  const [activeTab, setActiveTab] = useState("about");
  const [pastExperiences, setPastExperiences] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const { toast } = useToast();
    // Parse past experience data and sort by date (latest first)
  useEffect(() => {
    if (mentor?.past_experience) {
      try {
        let experiences = [];
        
        if (Array.isArray(mentor.past_experience)) {
          experiences = mentor.past_experience;
        } else if (typeof mentor.past_experience === 'string') {
          const parsed = JSON.parse(mentor.past_experience);
          experiences = Array.isArray(parsed) ? parsed : [parsed];
        } else if (typeof mentor.past_experience === 'object') {
          if (mentor.past_experience.role || mentor.past_experience.company) {
            experiences = [mentor.past_experience];
          } else {
            const experiencesList = Object.values(mentor.past_experience)
              .filter(item => item && typeof item === 'object');
            experiences = experiencesList.length > 0 ? experiencesList : [mentor.past_experience];
          }
        }

        // Sort experiences by date (latest first)
        const sortedExperiences = experiences.sort((a, b) => {
          // Helper function to extract year from various date formats
          const extractYear = (exp) => {
            if (!exp) return 0;
            
            // Check for end_date, endDate, or similar fields
            const endDateFields = ['end_date', 'endDate', 'end_year', 'endYear', 'to', 'until'];
            const startDateFields = ['start_date', 'startDate', 'start_year', 'startYear', 'from', 'since'];
            
            // Try to find end date first (most recent job)
            for (const field of endDateFields) {
              if (exp[field]) {
                const year = extractYearFromString(exp[field]);
                if (year > 0) return year;
              }
            }
            
            // If no end date, check for "current", "present", etc.
            const duration = exp.duration || exp.period || '';
            if (typeof duration === 'string') {
              const currentKeywords = ['current', 'present', 'now', 'ongoing'];
              if (currentKeywords.some(keyword => duration.toLowerCase().includes(keyword))) {
                return new Date().getFullYear(); // Current year for ongoing jobs
              }
              
              // Try to extract year from duration string
              const year = extractYearFromString(duration);
              if (year > 0) return year;
            }
            
            // Try start date as fallback
            for (const field of startDateFields) {
              if (exp[field]) {
                const year = extractYearFromString(exp[field]);
                if (year > 0) return year;
              }
            }
            
            return 0; // No date found
          };
          
          // Helper function to extract year from string
          const extractYearFromString = (str) => {
            if (!str) return 0;
            
            // Handle string dates
            if (typeof str === 'string') {
              // Look for 4-digit year
              const yearMatch = str.match(/\b(19|20)\d{2}\b/);
              if (yearMatch) {
                return parseInt(yearMatch[0]);
              }
              
              // Handle date strings
              const date = new Date(str);
              if (!isNaN(date.getTime())) {
                return date.getFullYear();
              }
            }
            
            // Handle number
            if (typeof str === 'number') {
              if (str > 1900 && str < 2100) {
                return str;
              }
            }
            
            return 0;
          };
          
          const yearA = extractYear(a);
          const yearB = extractYear(b);
          
          // Sort by year (descending - latest first)
          return yearB - yearA;
        });

        setPastExperiences(sortedExperiences);
      } catch (error) {
        setPastExperiences([]);
      }
    } else {
      setPastExperiences([]);
    }
  }, [mentor]);

  // Load reviews - Fixed to fetch fresh data from database
  useEffect(() => {
    const loadReviews = async () => {
      if (!mentor?.id) return;
      
      try {
        // Fetch fresh mentor data to get current reviews
        const { data: mentorData, error } = await supabase
          .from('mentor_data')
          .select('reviews')
          .eq('id', mentor.id)
          .single();
        
        if (error) {
          console.error("Error fetching reviews:", error);
          setReviews([]);
          return;
        }
        
        if (mentorData?.reviews) {
          let reviewsData;
          
          if (typeof mentorData.reviews === 'string') {
            try {
              reviewsData = JSON.parse(mentorData.reviews);
            } catch (e) {
              reviewsData = [];
            }
          } else if (Array.isArray(mentorData.reviews)) {
            reviewsData = mentorData.reviews;
          } else if (typeof mentorData.reviews === 'object' && mentorData.reviews !== null) {
            reviewsData = [mentorData.reviews];
          } else {
            reviewsData = [];
          }
          
          const validReviews = reviewsData
            .filter(review => review && typeof review === 'object')
            .map(review => ({
              ...review,
              id: review.id || crypto.randomUUID()
            }))
            .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));
          
          setReviews(validReviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
        setReviews([]);
      }
    };
    
    loadReviews();
  }, [mentor?.id]);

  // Get current authenticated user - Fixed to remove non-existent table reference
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch fresh mentee data to ensure we have current name
          const { data: menteeData, error } = await supabase
            .from('mentee_data')
            .select('id, user_id, name')
            .eq('user_id', session.user.id)
            .single();
          
          if (!error && menteeData && menteeData.name) {
            setCurrentUser({
              ...menteeData,
              email: session.user.email
            });
          } else {
            // Fallback to user_metadata if mentee data is incomplete
            setCurrentUser({
              id: session.user.id,
              user_id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.first_name + ' ' + session.user.user_metadata?.last_name || ''
            });
          }
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    
    getCurrentUser();
  }, []);

  // Submit review - Fixed to ensure proper database update
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to leave a review",
        variant: "destructive",
      });
      return;
    }
    
    if (!newReview.comment.trim()) {
      toast({
        title: "Review Required",
        description: "Please enter a review comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentUser.name) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile with name before submitting a review",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // First, fetch the current reviews from database to ensure we have the latest data
      const { data: currentMentorData, error: fetchError } = await supabase
        .from('mentor_data')
        .select('reviews')
        .eq('id', mentor.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Parse current reviews
      let currentReviews = [];
      if (currentMentorData?.reviews) {
        try {
          if (typeof currentMentorData.reviews === 'string') {
            currentReviews = JSON.parse(currentMentorData.reviews);
          } else if (Array.isArray(currentMentorData.reviews)) {
            currentReviews = currentMentorData.reviews;
          } else if (typeof currentMentorData.reviews === 'object' && currentMentorData.reviews !== null) {
            currentReviews = [currentMentorData.reviews];
          }
        } catch (error) {
          currentReviews = [];
        }
      }
      
      // Ensure valid array and entries have IDs
      if (!Array.isArray(currentReviews)) currentReviews = [];
      
      const validReviews = currentReviews
        .filter(review => review && typeof review === 'object')
        .map(review => ({
          ...review,
          id: review.id || crypto.randomUUID()
        }));
      
      // Create the new review object
      const reviewObj = {
        id: crypto.randomUUID(),
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        created_at: new Date().toISOString(),
        reviewer: {
          id: currentUser.id || currentUser.user_id,
          name: currentUser.name,
          // profile_url: currentUser.profile_url || null,
          email: currentUser.email
        }
      };
      
      // Add new review at beginning
      const updatedReviews = [reviewObj, ...validReviews];
      
      // Update in Supabase
      const { error } = await supabase
        .from('mentor_data')
        .update({ reviews: updatedReviews })
        .eq('id', mentor.id);
      
      if (error) throw error;
      
      // Update local state
      setReviews(updatedReviews);
      setNewReview({ rating: 5, comment: "" });
      
      toast({
        title: "Review Submitted!",
        description: "Thank you for sharing your feedback!",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete review - Fixed to ensure proper database update
  const handleDeleteReview = async (reviewId) => {
    if (!currentUser || !reviewId) return;
    
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    try {
      // First, fetch the current reviews from database
      const { data: currentMentorData, error: fetchError } = await supabase
        .from('mentor_data')
        .select('reviews')
        .eq('id', mentor.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Parse current reviews
      let currentReviews = [];
      if (currentMentorData?.reviews) {
        try {
          if (typeof currentMentorData.reviews === 'string') {
            currentReviews = JSON.parse(currentMentorData.reviews);
          } else if (Array.isArray(currentMentorData.reviews)) {
            currentReviews = currentMentorData.reviews;
          } else if (typeof currentMentorData.reviews === 'object' && currentMentorData.reviews !== null) {
            currentReviews = [currentMentorData.reviews];
          }
        } catch (error) {
          currentReviews = [];
        }
      }
      
      // Ensure valid array
      if (!Array.isArray(currentReviews)) currentReviews = [];
      
      // Filter out the review to delete
      const updatedReviews = currentReviews.filter(review => review?.id !== reviewId);
      
      // Update in database
      const { error } = await supabase
        .from('mentor_data')
        .update({ reviews: updatedReviews })
        .eq('id', mentor.id);
      
      if (error) throw error;
      
      // Update local state
      setReviews(updatedReviews);
      
      toast({
        title: "Review Deleted",
        description: "Your review has been successfully removed",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Delete Failed",
        description: "Unable to delete review. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if review belongs to current user
  const isUserReview = (review) => {
    if (!currentUser || !review?.reviewer) return false;
    
    const reviewerId = review.reviewer.id || review.reviewer.user_id;
    const currentUserId = currentUser.id || currentUser.user_id;
    
    if (reviewerId && currentUserId && String(reviewerId) === String(currentUserId)) return true;
    
    const reviewerEmail = review.reviewer.email;
    const currentUserEmail = currentUser.email;
    
    if (reviewerEmail && currentUserEmail && reviewerEmail.toLowerCase() === currentUserEmail.toLowerCase()) return true;
    
    return false;
  };

  // Star rating component
  const StarRating = ({ rating, onChange }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          className={`text-lg ${star <= rating ? "text-amber-400" : "text-gray-300"}`}
          aria-label={`Rate ${star} out of 5 stars`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm flex-1 transition-all duration-200 ${
            activeTab === "about"
              ? "bg-white border-b-2 border-black text-black shadow-sm"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("about")}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <User size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">About</span>
          </div>
        </button>
        <button
          className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm flex-1 transition-all duration-200 ${
            activeTab === "experience"
              ? "bg-white border-b-2 border-black text-black shadow-sm"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("experience")}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <Briefcase size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">Experience</span>
            <span className="xs:hidden sm:hidden">Exp</span>
          </div>
        </button>
        <button
          className={`px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm flex-1 transition-all duration-200 ${
            activeTab === "reviews"
              ? "bg-white border-b-2 border-black text-black shadow-sm"
              : "text-gray-600 hover:text-black hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <Star size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Reviews</span>
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-3 sm:p-4 md:p-6">
        {activeTab === "about" && (
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <User size={18} className="sm:w-5 sm:h-5 text-purple-600" />
              <h2 className="text-lg sm:text-xl font-bold text-black">About Me</h2>
            </div>
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {mentor.bio || "No bio available yet."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "experience" && (
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Briefcase size={18} className="sm:w-5 sm:h-5 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-bold text-black">Experience</h2>
            </div>
            {pastExperiences && pastExperiences.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {pastExperiences.map((exp, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building size={16} className="sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-black mb-1 line-clamp-2">
                          {exp.role || "Role not specified"}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                          <span className="text-blue-600 font-medium text-sm sm:text-base">
                            {exp.company || "Company not specified"}
                          </span>
                          <div className="flex items-center gap-1 text-gray-600 text-xs sm:text-sm">
                            <Calendar size={12} className="sm:w-4 sm:h-4 text-green-600" />
                            <span>{exp.duration || "Duration not specified"}</span>
                          </div>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 text-xs sm:text-sm leading-relaxed line-clamp-3">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Briefcase className="text-gray-400" size={20} />
                </div>
                <p className="text-gray-500 font-medium text-sm sm:text-base">No experience listed yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Star size={18} className="sm:w-5 sm:h-5 text-amber-600" />
              <h2 className="text-lg sm:text-xl font-bold text-black">Reviews</h2>
            </div>
            
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {reviews.map((review, index) => {
                  if (!review || typeof review !== 'object') return null;
                    
                  const reviewId = review.id || `review-${index}`;
                  const reviewerName = review.reviewer?.name || "Anonymous User";
                  const rating = typeof review.rating === 'number' ? review.rating : 5;
                  const comment = review.comment || 'No comment provided';
                  
                  let formattedDate = 'No date';
                  if (review.created_at) {
                    try {
                      formattedDate = new Date(review.created_at).toLocaleDateString();
                    } catch (e) {
                      // Keep default value
                    }
                  }
                  
                  return (
                    <div 
                      key={reviewId} 
                      className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {/* Avatar */}
                          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <span className="font-medium text-xs sm:text-sm">
                              {review.reviewer?.name ? (
                                <>
                                  {review.reviewer.name.split(' ')[0]?.charAt(0)?.toUpperCase() || ''}
                                  {review.reviewer.name.split(' ')[1]?.charAt(0)?.toUpperCase() || ''}
                                </>
                              ) : (
                                'A'
                              )}
                            </span>
                          </div>
                          
                          <div>
                            <div className="font-medium text-black text-sm sm:text-base">
                              {reviewerName}
                            </div>
                            <div className="mt-1">
                              <StarRating rating={rating} />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-100">
                        {comment}
                      </div>
                      
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={10} className="sm:w-3 sm:h-3" />
                        {formattedDate}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-50 border border-amber-200 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Star className="text-amber-400" size={20} />
                </div>
                <p className="text-gray-600 font-medium mb-2 text-sm sm:text-base">No reviews yet</p>
                <p className="text-gray-500 text-xs sm:text-sm px-4">Be the first to leave a review after your mentoring session!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}