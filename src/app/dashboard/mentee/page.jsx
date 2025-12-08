  "use client";

  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
  import { supabase } from "@/lib/supabase";
  import { useToast } from "@/hooks/use-toast";
  import RoleProtected from "@/components/RoleProtected";
  import { ROLES } from "@/lib/roles";
  import { User, Search, Calendar, BookOpen, MessageSquare, Settings } from "lucide-react";

  function MenteeDashboardContent() {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (!session) {
            router.push("/login");
            return;
          }

          const { data, error } = await supabase
            .from("mentee_data")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            toast({
              title: "Error",
              description: "Failed to load profile data.",
              variant: "destructive",
            });
          } else {
            setProfile(data || { user_id: session.user.id });
          }
        } catch (error) {
          console.error("Error in fetchProfile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }, [router, toast]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="h-7 w-7 text-blue-600" />
                  Mentee Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, {profile?.first_name || 'there'}! Manage your learning journey
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Area - Ready for New Components */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                🚧 Mentee Dashboard Components
              </div>
              <p className="text-gray-400 mb-6">
                Ready for new component development
              </p>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Find Mentors</h3>
                  <p className="text-sm text-gray-500">Discover and connect with mentors</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                  <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">My Sessions</h3>
                  <p className="text-sm text-gray-500">Manage your mentorship sessions</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                  <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Resources</h3>
                  <p className="text-sm text-gray-500">Access learning materials</p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                  <MessageSquare className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Messages</h3>
                  <p className="text-sm text-gray-500">Communicate with mentors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main exported component with role protection
  export default function MenteeDashboard() {
    return (
      <RoleProtected requiredRole={ROLES.MENTEE}>
        <MenteeDashboardContent />
      </RoleProtected>
    );
  }