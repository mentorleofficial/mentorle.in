"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star } from "lucide-react";

const FeedbackDialog = ({
  open,
  onOpenChange,
  feedbackText,
  setFeedbackText,
  feedbackRating,
  setFeedbackRating,  onSubmitFeedback,
  isSubmittingFeedback
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Your feedback helps mentors improve and helps other mentees find great mentors.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid gap-4 py-4">
            {/* Star Rating */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Your Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedbackRating(star)}
                    className={`p-1 rounded-full transition-colors ${
                      star <= feedbackRating 
                        ? 'text-yellow-400 hover:text-yellow-500' 
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {feedbackRating}/5
                </span>
              </div>
            </div>
            
            {/* Feedback Text */}
            <div className="flex flex-col gap-2">
              <label htmlFor="feedback" className="text-sm font-medium text-gray-700">
                Your Feedback
              </label>
              <Textarea
                id="feedback"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your experience with this mentor"
                rows={5}
              />
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>          <Button 
            onClick={onSubmitFeedback}
            disabled={isSubmittingFeedback || !feedbackText.trim()}
          >
            {isSubmittingFeedback ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Submitting...
              </>
            ) : (
              <>Submit Feedback</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
