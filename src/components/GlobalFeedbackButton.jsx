"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Send,
  AlertCircle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Star
} from "lucide-react";

export default function GlobalFeedbackButton() {
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
  const [feedbackType, setFeedbackType] = useState('feedback');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const { toast } = useToast();

  // Check if user is authenticated and get their info
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        
        // Get user role from mentee_data or mentor_data tables
        const { data: menteeData } = await supabase
          .from("mentee_data")
          .select("first_name, last_name")
          .eq("user_id", session.user.id)
          .single();
        
        if (menteeData) {
          setUserRole({ type: 'mentee', name: `${menteeData.first_name} ${menteeData.last_name}` });
        } else {
          const { data: mentorData } = await supabase
            .from("mentor_data")
            .select("first_name, last_name")
            .eq("user_id", session.user.id)
            .single();
          
          if (mentorData) {
            setUserRole({ type: 'mentor', name: `${mentorData.first_name} ${mentorData.last_name}` });
          } else {
            // Check if admin (you can customize this logic)
            setUserRole({ type: 'admin', name: session.user.email });
          }
        }
      }
    };

    checkUser();
  }, []);

  // Fetch user's previous feedbacks
  const fetchUserFeedbacks = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("user_feedback")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setUserFeedbacks(data);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  // Load feedback when panel opens
  useEffect(() => {
    if (showFeedbackPanel && user) {
      fetchUserFeedbacks();
    }
  }, [showFeedbackPanel, user]);

  // Auto-show feedback popup on every page reload for authenticated users
//   useEffect(() => {
//     if (user) {
//       // Show popup after a short delay to ensure page is loaded
//       const timer = setTimeout(() => {
//         setShowFeedbackPanel(true);
//       }, 2000); // 2 second delay

//       return () => clearTimeout(timer);
//     }
//   }, [user]); // Trigger when user state changes (i.e., when authenticated)

  // Feedback submission function
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback message.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !userRole) {
      toast({
        title: "Error",
        description: "Please log in to submit feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const { error } = await supabase.from("user_feedback").insert({
        user_id: user.id,
        user_name: userRole.name,
        role: userRole.type,
        type: feedbackType,
        message: feedbackMessage.trim(),
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll review it soon.",
      });

      setFeedbackMessage('');
      setFeedbackType('feedback');
      fetchUserFeedbacks(); // Refresh the feedback list
      
      // Auto-close panel after successful submission
      setTimeout(() => {
        setShowFeedbackPanel(false);
      }, 1500);
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Don't show if user is not authenticated
  if (!user || !userRole) {
    return null;
  }

  return (
    <>
      {/* Feedback Slide-out Panel */}
      {showFeedbackPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl">
            {/* Panel Header */}
            <div className="bg-black text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center">
                    <MessageCircle className="h-6 w-6 mr-2" />
                    Share Your Feedback
                  </h2>
                  <p className="text-gray-300 mt-1">Help us improve the platform</p>
                </div>
                <Button
                  onClick={() => setShowFeedbackPanel(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              {/* {userFeedbacks.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Your Feedback History</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-700">
                      {userFeedbacks.length} submitted
                    </span>
                    <span className="text-gray-700">
                      {userFeedbacks.filter(f => f.status === 'resolved').length} resolved
                    </span>
                  </div>
                </div>
              )} */}

              {/* Feedback Form */}
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                {/* Feedback Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What would you like to share?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'feedback', label: 'Feedback', icon: MessageCircle },
                      { id: 'concern', label: 'Concern', icon: AlertCircle },
                      { id: 'suggestion', label: 'Suggestion', icon: Lightbulb },
                      { id: 'review', label: 'Review', icon: Star }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFeedbackType(type.id)}
                        className={`flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
                          feedbackType === type.id
                            ? 'border-black bg-black text-white shadow-lg'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-black hover:bg-gray-50'
                        }`}
                      >
                        <type.icon className={`h-4 w-4 mr-2 ${
                          feedbackType === type.id ? 'text-white' : 'text-gray-500'
                        }`} />
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder={`Tell us your ${feedbackType}... Your input helps us improve the platform for everyone!`}
                    className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-black resize-none"
                    rows={6}
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {feedbackMessage.length}/1000 characters
                    </span>
                    {feedbackMessage.length > 950 && (
                      <span className="text-xs text-gray-700 font-medium">
                        {1000 - feedbackMessage.length} left
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmittingFeedback || !feedbackMessage.trim()}
                  className="w-full bg-black hover:bg-white text-white hover:text-black border-2 border-black font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingFeedback ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <Send className="h-4 w-4 mr-2" />
                      Submit {feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)}
                    </div>
                  )}
                </Button>
              </form>

              {/* Previous Feedbacks */}
              {/* {userFeedbacks.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-gray-600" />
                    Recent Feedback
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {userFeedbacks.slice(0, 5).map((feedback) => (
                      <div
                        key={feedback.id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-black transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                            {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            feedback.status === 'new' ? 'bg-gray-800 text-white' :
                            feedback.status === 'in_review' ? 'bg-gray-600 text-white' :
                            'bg-black text-white'
                          }`}>
                            {feedback.status === 'new' ? 'New' :
                             feedback.status === 'in_review' ? 'In Review' : 'Resolved'}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {feedback.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(feedback.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}

      {/* Floating Feedback Button */}
      {!showFeedbackPanel && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setShowFeedbackPanel(true)}
            className="bg-black hover:bg-white text-white hover:text-black border-2 border-black shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 rounded-full px-6 py-4"
            size="lg"
            title="Give Feedback"
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Feedback</span>
            </div>
          </Button>
        </div>
      )}
    </>
  );
}
