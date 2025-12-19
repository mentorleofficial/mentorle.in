"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUserRole } from "@/lib/userRole";
import Image from "next/image";
import { cleanupBrokenImageUrls } from "@/app/dashboard/mentor/profile/utils/storageUtils";

function DashboardHeader() {
  const router = useRouter();
  const { user, role, isLoading } = useUserRole();
  const [notificationCount, setNotificationCount] = useState(0);
  const [profileUrl, setProfileUrl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Get user name from user data or mentor profile
  const displayName = userProfile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const userRole = role?.replace('_', ' ') || 'User';

  // Debug logging
  console.log('DashboardHeader render:', { 
    profileUrl, 
    displayName, 
    userRole, 
    userProfile, 
    hasUser: !!user,
    userEmail: user?.email,
    userId: user?.id
  });

  // Handle profile click
  const handleProfileClick = () => {
    // Navigate to profile page based on role
    switch (role) {
      case 'admin':
        router.push('/dashboard/admin/settings');
        break;
      case 'mentor':
      case 'pending_mentor':
        router.push('/dashboard/mentor/profile');
        break;
      case 'mentee':
        router.push('/dashboard/mentee/profile');
        break;
      default:
        router.push('/dashboard/settings');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user || !role) {
        console.log('No user or role available:', { user: !!user, role });
        return;
      }

      console.log('Loading user profile for:', { userId: user.id, role });

      try {
        // For mentors, fetch from mentor_data table
        if (role === 'mentor' || role === 'pending_mentor') {
          console.log('Fetching mentor data...');
          const { data: mentorData, error } = await supabase
            .from('mentor_data')
            .select('name, profile_url')
            .eq('user_id', user.id)
            .single();

          console.log('Mentor data result:', { mentorData, error });

          if (!error && mentorData) {
            setUserProfile(mentorData);
            console.log('Setting profile URL:', mentorData.profile_url);
            if (mentorData.profile_url) {
              setProfileUrl(mentorData.profile_url);
              // Clean up broken URLs
              cleanupBrokenImageUrls(user.id);
            }
          } else if (error) {
            console.error('Error fetching mentor data:', error);
          }
        } 
        // For mentees, fetch from mentee_data table
        else if (role === 'mentee') {
          console.log('Fetching mentee data...');
          const { data: menteeData, error } = await supabase
            .from('mentee_data')
            .select('name')
            .eq('user_id', user.id)
            .single();

          console.log('Mentee data result:', { menteeData, error });

          if (!error && menteeData) {
            setUserProfile(menteeData);
            console.log('Setting mentee profile data:', menteeData);
          } else if (error) {
            console.error('Error fetching mentee data:', error);
          }
        } 
        else if (user?.user_metadata?.avatar_url) {
          console.log('Using auth metadata avatar:', user.user_metadata.avatar_url);
          setProfileUrl(user.user_metadata.avatar_url);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, [user, role]);

  // Test function to manually check user data
  useEffect(() => {
    const testUserData = async () => {
      if (user) {
        if (role === 'mentor' || role === 'pending_mentor') {
          console.log('Testing mentor data fetch...');
          const { data, error } = await supabase
            .from('mentor_data')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          console.log('Direct mentor data test:', { data, error });
        } else if (role === 'mentee') {
          console.log('Testing mentee data fetch...');
          const { data, error } = await supabase
            .from('mentee_data')
            .select('name, email, bio, current_status')
            .eq('user_id', user.id)
            .single();
          
          console.log('Direct mentee data test:', { data, error });
        }
      }
    };

    testUserData();
  }, [user, role]);

  // Simulate notification count (you can replace this with real data)
  useEffect(() => {
    // This is a placeholder - replace with actual notification logic
    setNotificationCount(3);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-1 md:p-2 flex items-center gap-1 md:gap-2 animate-pulse">
          <div className="h-8 w-8 md:h-10 md:w-10 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-8 md:h-10 md:w-10 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-8 md:h-10 md:w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-1.5 md:p-2 flex items-center gap-1.5 md:gap-2">
        {/* Notification Button */}
        {/* <Button
          variant="ghost"
          size="sm"
          className="relative rounded-full h-8 w-8 md:h-10 md:w-10 p-0 hover:bg-gray-100"
        >
          <Bell className="h-4 w-4 md:h-5 md:w-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </Button> */}

        {/* Profile Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleProfileClick}
          className="rounded-full h-10 w-10 md:h-10 md:w-10 p-0 hover:bg-gray-100 min-h-[44px] min-w-[44px]"
        >
          <div className="h-8 w-8 md:h-8 md:w-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden relative">
            {profileUrl ? (
              <>
                <img
                  src={profileUrl}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                  onLoad={() => console.log('Image loaded successfully:', profileUrl)}
                  onError={(e) => {
                    console.error('Header image load error:', profileUrl);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="h-6 w-6 md:h-8 md:w-8 bg-gray-300 rounded-full flex items-center justify-center hidden">
                  <User className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
                </div>
              </>
            ) : (
              <div className="h-6 w-6 md:h-8 md:w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
              </div>
            )}
          </div>
        </Button>

        {/* User Info */}
        <div className="px-2 md:px-3 py-1 hidden sm:block">
          <div className="text-xs md:text-sm font-medium text-gray-900">
            {displayName}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {userRole}
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="rounded-full h-10 w-10 md:h-10 md:w-10 p-0 hover:bg-gray-100 min-h-[44px] min-w-[44px]"
        >
          <LogOut className="h-4 w-4 md:h-4 md:w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}

export default DashboardHeader;
