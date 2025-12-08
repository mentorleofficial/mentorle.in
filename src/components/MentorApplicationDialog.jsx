"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ROLES, MENTOR_STATUS } from "@/lib/roles";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

export default function MentorApplicationDialog({ 
  application, 
  isOpen, 
  onClose, 
  onApplicationProcessed 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleApproveApplication = async () => {
    try {
      setIsLoading(true);
      
      // Update the mentor status to approved and role to mentor
      const { error: mentorError } = await supabase
        .from("mentor_data")
        .update({ 
          status: MENTOR_STATUS.APPROVED,
          role: ROLES.MENTOR
        })
        .eq("id", application.id);
      
      if (mentorError) throw mentorError;
      
      toast({
        title: "Application Approved",
        description: "The mentor application has been approved."
      });
      
      // Notify parent component
      onApplicationProcessed(application.id);
      onClose();
      
    } catch (error) {
      console.error("Error approving application:", error);
      toast({
        title: "Error",
        description: "Failed to approve application.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectApplication = async () => {
    try {
      setIsLoading(true);
      
      // Update the mentor status to rejected
      const { error } = await supabase
        .from("mentor_data")
        .update({ status: MENTOR_STATUS.REJECTED })
        .eq("id", application.id);
      
      if (error) throw error;
      
      toast({
        title: "Application Rejected",
        description: "The mentor application has been rejected."
      });
      
      // Notify parent component
      onApplicationProcessed(application.id);
      onClose();
      
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast({
        title: "Error",
        description: "Failed to reject application.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Mentor Application</DialogTitle>
          <DialogDescription className="text-sm">
            {application.first_name} {application.last_name}
          </DialogDescription>
        </DialogHeader>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-3">
            {/* Basic Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Email</h4>
                <p className="text-gray-900 break-words">{application.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Applied</h4>
                <p className="text-gray-900">{new Date(application.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Experience & Expertise */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Experience</h4>
                <p className="text-gray-900">{application.experience_years ? `${application.experience_years} years` : "Not specified"}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Expertise</h4>
                <p className="text-gray-900">{application.expertise || "Not specified"}</p>
              </div>
            </div>
            
            {/* Links */}
            {(application.linkedin_url || application.portfolio_url) && (
              <div className="space-y-2 text-sm">
                {application.linkedin_url && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">LinkedIn</h4>
                    <a 
                      href={application.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-all text-xs"
                    >
                      {application.linkedin_url}
                    </a>
                  </div>
                )}
                {application.portfolio_url && (
                  <div>
                    <h4 className="font-medium text-gray-700 mb-1">Portfolio</h4>
                    <a 
                      href={application.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 break-all text-xs"
                    >
                      {application.portfolio_url}
                    </a>
                  </div>
                )}
              </div>
            )}
            
            {/* Bio */}
            {application.bio && (
              <div className="text-sm">
                <h4 className="font-medium text-gray-700 mb-2">Bio</h4>
                <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                  <p className="text-gray-900 text-sm whitespace-pre-line leading-relaxed">
                    {application.bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Fixed Footer */}
        <DialogFooter className="pt-4 border-t border-gray-200">
          <div className="flex justify-between w-full gap-2">
            <Button 
              variant="destructive"
              size="sm"
              onClick={handleRejectApplication}
              disabled={isLoading}
              className="flex-1"
            >
              Reject
            </Button>
            <div className="flex gap-2 flex-1">
              <DialogClose asChild>
                <Button variant="outline" size="sm" disabled={isLoading} className="flex-1">
                  Close
                </Button>
              </DialogClose>
              <Button 
                size="sm"
                onClick={handleApproveApplication}
                disabled={isLoading}
                className="flex-1"
              >
                Approve
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
