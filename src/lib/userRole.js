"use client";

import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { ROLES, MENTOR_STATUS } from "./roles";

/**
 * Custom hook to get the current user's role and profile data
 * @returns {Object} User data with role information
 */
export function useUserRole() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAndRole = async () => {
      try {
        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          setError("No authenticated session");
          setIsLoading(false);
          return;
        }

        const userId = session.user.id;
        setUser(session.user);

        // Get user roles from the new user_roles table
        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("roles(name)")
          .eq("user_id", userId);

        let userRole = null;
        let profileData = null;

        if (!rolesError && rolesData?.length) {
          const userRoles = rolesData.map(r => r.roles.name);

          // Determine primary role based on hierarchy
          if (userRoles.includes("admin")) {
            userRole = ROLES.ADMIN;
            // Get admin profile data
            const { data: adminData, error: adminError } = await supabase
              .from("admin_data")
              .select("*")
              .eq("user_id", userId)
              .maybeSingle();
            
            if (!adminError && adminData) {
              profileData = adminData;
            }
          } else if (userRoles.includes("mentor")) {
            // Get mentor profile data
            const { data: mentorData, error: mentorError } = await supabase
              .from("mentor_data")
              .select("*")
              .eq("user_id", userId)
              .maybeSingle();

            if (!mentorError && mentorData) {
              profileData = mentorData;
              if (mentorData.status === MENTOR_STATUS.APPROVED) {
                userRole = ROLES.MENTOR;
              } else if (mentorData.status === MENTOR_STATUS.PENDING) {
                userRole = ROLES.PENDING_MENTOR;
              }
            }
          } else if (userRoles.includes("mentee")) {
            // Get mentee profile data
            const { data: menteeData, error: menteeError } = await supabase
              .from("mentee_data")
              .select("*")
              .eq("user_id", userId)
              .maybeSingle();

            if (!menteeError && menteeData) {
              userRole = ROLES.MENTEE;
              profileData = menteeData;
            }
          }
        }

        setRole(userRole);
        setProfile(profileData);
        setIsLoading(false);
      } catch (err) {
        
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUserAndRole();
  }, []);

  return {
    user,
    role,
    profile,
    isLoading,
    error,
    isAuthenticated: !!user,
    isMentor: role === ROLES.MENTOR,
    isMentee: role === ROLES.MENTEE,
    isPendingMentor: role === ROLES.PENDING_MENTOR,
    isAdmin: role === ROLES.ADMIN,
  };
}

/**
 * Check if current client-side user has a specific role
 * @param {string} requiredRole The role to check for
 * @returns {Promise<boolean>} Whether the user has the role
 */
export async function checkUserHasRoleClient(requiredRole) {
  try {
    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return false;
    }

    const userId = session.user.id;
    let userRole = null;

    // Get user roles from the new user_roles table
    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("roles(name)")
      .eq("user_id", userId);

    if (!rolesError && rolesData?.length) {
      const userRoles = rolesData.map(r => r.roles.name);

      // Determine primary role based on hierarchy
      if (userRoles.includes("admin")) {
        userRole = ROLES.ADMIN;
      } else if (userRoles.includes("mentor")) {
        // Check mentor status
        const { data: mentorData, error: mentorError } = await supabase
          .from("mentor_data")
          .select("status")
          .eq("user_id", userId)
          .maybeSingle();

        if (!mentorError && mentorData) {
          if (mentorData.status === MENTOR_STATUS.APPROVED) {
            userRole = ROLES.MENTOR;
          } else if (mentorData.status === MENTOR_STATUS.PENDING) {
            userRole = ROLES.PENDING_MENTOR;
          }
        }
      } else if (userRoles.includes("mentee")) {
        userRole = ROLES.MENTEE;
      }
    }

    return userRole === requiredRole;
  } catch (error) {
    
    return false;
  }
}
