/**
 * Authentication and user role management utilities for the Mentorle application
 */

import { createClient } from "@supabase/supabase-js";
import { ROLES, MENTOR_STATUS } from "./roles";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Get the current user session
 * @returns {Promise<Object|null>} User session or null if not authenticated
 */
export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    return null;
  }

  return data.session;
};

/**
 * Get the current authenticated user
 * @returns {Promise<Object|null>} User object or null if not authenticated
 */
export const getCurrentUser = async () => {
  const session = await getCurrentSession();
  if (!session) return null;

  return session.user;
};

/**
 * Determine the user's role based on the new normalized role system
 * @param {string} userId - The user ID to check
 * @param {Object} [supabaseClient] - Optional Supabase client (for server-side usage)
 * @returns {Promise<string>} - The user's role
 */
export const getUserRole = async (userId, supabaseClient = null) => {
  if (!userId) {
    console.log('❌ getUserRole: No userId provided');
    return null;
  }

  // Use provided client or default client
  const client = supabaseClient || supabase;

  // Get user roles from the new user_roles table
  const { data: rolesData, error: rolesError } = await client
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", userId);

  if (rolesError) {
    console.error('❌ Error fetching user roles:', rolesError);
    return null;
  }

  if (!rolesData?.length) {
    console.log('❌ No roles found for user:', userId);
    return null;
  }

  const userRoles = rolesData.map(r => r.roles?.name || r.roles).filter(Boolean);
  console.log('📋 User roles from database:', userRoles);
  
  let role = null;

  // Determine primary role based on hierarchy
  if (userRoles.includes("admin")) {
    role = ROLES.ADMIN;
    console.log('✅ Role resolved: ADMIN');
  } else if (userRoles.includes("mentor")) {
    // Check mentor status for approved/pending
    const { data: mentorData, error: mentorError } = await client
      .from("mentor_data")
      .select("status")
      .eq("user_id", userId)
      .maybeSingle();

    if (mentorError) {
      console.error('❌ Error fetching mentor data:', mentorError);
    }

    if (!mentorError && mentorData) {
      console.log('📊 Mentor status:', mentorData.status);
      if (mentorData.status === MENTOR_STATUS.APPROVED) {
        role = ROLES.MENTOR;
        console.log('✅ Role resolved: MENTOR (approved)');
      } else if (mentorData.status === MENTOR_STATUS.PENDING) {
        role = ROLES.PENDING_MENTOR;
        console.log('✅ Role resolved: PENDING_MENTOR');
      } else {
        console.log('⚠️ Mentor status not approved/pending:', mentorData.status);
      }
    } else {
      console.log('⚠️ No mentor_data found for user:', userId);
    }
  } else if (userRoles.includes("mentee")) {
    role = ROLES.MENTEE;
    console.log('✅ Role resolved: MENTEE');
  }

  if (!role) {
    console.log('❌ No valid role resolved for user:', userId, 'Available roles:', userRoles);
  }

  return role;
};

/**
 * Get the current user with their role and profile data
 * @returns {Promise<Object|null>} User object with role or null if not authenticated
 */
export const getCurrentUserWithRole = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const role = await getUserRole(user.id);

  // Return user data with role
  return {
    ...user,
    role,
  };
};

/**
 * Check if current user has a specific role
 * @param {string} requiredRole - The role to check for
 * @returns {Promise<boolean>} Whether the user has the required role
 */
export const checkUserHasRole = async (requiredRole) => {
  const userWithRole = await getCurrentUserWithRole();
  if (!userWithRole || !userWithRole.role) return false;

  return userWithRole.role === requiredRole;
};

/**
 * Update user role using the new normalized role system
 * @param {string} userId - The user ID to update
 * @param {string} newRole - The new role to set
 * @param {string} [status] - Optional status for mentors (approved/pending)
 * @returns {Promise<boolean>} Whether the update was successful
 */
export const updateUserRole = async (userId, newRole, status) => {
  if (!userId || !newRole) return false;

  try {
    // First, get the role ID for the new role
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", newRole)
      .single();

    if (roleError || !roleData) {
      console.error("Role not found:", newRole);
      return false;
    }

    // Remove all existing roles for this user
    await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId);

    // Add the new role
    await supabase
      .from("user_roles")
      .insert({
        user_id: userId,
        role_id: roleData.id
      });

    // Update mentor_data table if needed
    if (newRole === ROLES.MENTOR || newRole === ROLES.PENDING_MENTOR) {
      const mentorStatus =
        status ||
        (newRole === ROLES.PENDING_MENTOR
          ? MENTOR_STATUS.PENDING
          : MENTOR_STATUS.APPROVED);

      // Check if mentor record exists
      const { data: existingMentor } = await supabase
        .from("mentor_data")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingMentor) {
        // Update existing record
        await supabase
          .from("mentor_data")
          .update({
            status: mentorStatus
          })
          .eq("user_id", userId);
      } else {
        // Create new record
        await supabase.from("mentor_data").insert({
          user_id: userId,
          status: mentorStatus
        });
      }
    } else {
      // Remove from mentor_data if not a mentor
      await supabase
        .from("mentor_data")
        .delete()
        .eq("user_id", userId);
    }

    // Update mentee_data table if needed
    if (newRole === ROLES.MENTEE) {
      // Check if mentee record exists
      const { data: existingMentee } = await supabase
        .from("mentee_data")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (!existingMentee) {
        // Create new mentee record
        await supabase.from("mentee_data").insert({
          user_id: userId
        });
      }
    } else {
      // Remove from mentee_data if not a mentee
      await supabase
        .from("mentee_data")
        .delete()
        .eq("user_id", userId);
    }

    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    return false;
  }
};

/**
 * Handle mentor application approval
 * @param {string} mentorId - The mentor's user ID
 * @param {boolean} approved - Whether to approve or reject the application
 * @returns {Promise<boolean>} Whether the operation was successful
 */
export const handleMentorApproval = async (mentorId, approved) => {
  if (!mentorId) return false;

  try {
    if (approved) {
      // Approve the mentor - update status
      const { error: mentorError } = await supabase
        .from("mentor_data")
        .update({
          status: MENTOR_STATUS.APPROVED,
        })
        .eq("user_id", mentorId);
      
      if (mentorError) throw mentorError;

      // Update user role from pending_mentor to mentor
      const { assignRoleToUser } = await import("@/lib/roleUtils");
      const roleResult = await assignRoleToUser(mentorId, ROLES.MENTOR, MENTOR_STATUS.APPROVED);
      
      if (!roleResult.success) {
        throw new Error(roleResult.error || "Failed to assign mentor role");
      }
    } else {
      // Reject the mentor
      const { error } = await supabase
        .from("mentor_data")
        .update({
          status: MENTOR_STATUS.REJECTED,
        })
        .eq("user_id", mentorId);
      
      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error("Error handling mentor approval:", error);
    return false;
  }
};
