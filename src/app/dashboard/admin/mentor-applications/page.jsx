"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RoleProtected from "@/components/RoleProtected";
import { ROLES, MENTOR_STATUS } from "@/lib/roles";
import Link from "next/link";
import MentorApplicationDialog from "@/components/MentorApplicationDialog";

function MentorApplicationsContent() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Fetch pending mentor applications
        const { data, error } = await supabase
          .from("mentor_data")
          .select(`*`)
          .eq("status", MENTOR_STATUS.PENDING);

        if (error) throw error;

        setApplications(data || []);
        setIsLoading(false);
      } catch (error) {
        
        toast({
          title: "Error",
          description: "Failed to load mentor applications.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);
  
  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setIsApplicationDialogOpen(true);
  };

  const handleApplicationProcessed = (applicationId) => {
    // Update local state by removing the processed application
    setApplications(applications.filter(app => app.id !== applicationId));
  };

  const handleCloseDialog = () => {
    setIsApplicationDialogOpen(false);
    setSelectedApplication(null);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white border border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-black flex items-center justify-center animate-pulse">
              <div className="w-6 h-6 bg-white rounded-full"></div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-black text-black uppercase tracking-wider">
                Loading Applications
              </h2>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 bg-white">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Page Header */}
        <div className="bg-white border border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-black uppercase tracking-wider">Mentor Applications</h1>
                <p className="text-sm font-bold text-black/70 uppercase tracking-wide">Review and manage pending applications</p>
              </div>
            </div>
            <Link href="/dashboard/admin">
              <Button className="
                border border-black rounded-none font-black uppercase tracking-wider text-xs px-4 py-2 h-auto mt-3 md:mt-0
                bg-white text-black hover:bg-black hover:text-white
                transition-all duration-200
                shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
              ">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Applications List */}
        {applications.length > 0 ? (
          <div className="bg-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {/* Stats Header */}
            <div className="border-b border-black p-3 bg-black/5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-black uppercase tracking-wider">
                  Applications List
                </h2>
                <div className="bg-black text-white px-2 py-1 text-xs font-black uppercase tracking-wider">
                  {applications.length} Pending
                </div>
              </div>
            </div>

            <div className="divide-y divide-black/20">
              {applications.map((application, index) => (
                <div key={application.id} className="p-3 hover:bg-black/5 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    {/* Application Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                        <div className="font-black text-black text-sm uppercase tracking-wide">
                          {application.first_name} {application.last_name}
                        </div>
                        <div className="text-xs font-bold text-black/70 uppercase tracking-wide">
                          {application.email}
                        </div>
                        <div className="text-xs font-bold text-black/50 uppercase tracking-wide">
                          {new Date(application.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                      onClick={() => handleViewApplication(application)}
                      className="
                        border border-black rounded-none font-black uppercase tracking-wider text-xs px-3 py-1 h-auto
                        bg-white text-black hover:bg-black hover:text-white
                        transition-all duration-200
                        shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]
                      "
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-black p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-black flex items-center justify-center">
                <div className="text-2xl text-white">🎉</div>
              </div>
              <div>
                <h2 className="text-xl font-black text-black uppercase tracking-wider mb-2">No Pending Applications</h2>
                <p className="text-sm font-bold text-black/70 uppercase tracking-wide">
                  All applications processed. Check back later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Application Details Dialog */}
        <MentorApplicationDialog
          application={selectedApplication}
          isOpen={isApplicationDialogOpen}
          onClose={handleCloseDialog}
          onApplicationProcessed={handleApplicationProcessed}
        />
      </div>
    </div>
  );
}

// Main exported component with role protection
export default function MentorApplications() {
  return (
    <RoleProtected requiredRole={ROLES.ADMIN}>
      <MentorApplicationsContent />
    </RoleProtected>
  );
}