import { supabase } from './supabase';
import { ROLES, MENTOR_STATUS } from './roles';

/**
 * Assign a role to a user using the new normalized role system
 * @param {string} userId - The user ID to assign role to
 * @param {string} roleName - The role name to assign (admin, mentor, mentee)
 * @param {string} [status] - Optional status for mentors (approved/pending)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function assignRoleToUser(userId, roleName, status) {
  try {
    if (!userId || !roleName) {
      return { success: false, error: 'User ID and role name are required' };
    }

    // Validate role name
    const validRoles = ['admin', 'mentor', 'mentee'];
    if (!validRoles.includes(roleName)) {
      return { success: false, error: 'Invalid role name. Must be admin, mentor, or mentee' };
    }

    // Get role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', roleName)
      .single();

    if (roleError || !roleData) {
      console.error('Role not found:', roleName, roleError);
      return { success: false, error: `Role '${roleName}' not found in database` };
    }

    // Remove all existing roles for this user
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    // Add the new role
    const { data: userRoleData, error: userRoleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleData.id
      })
      .select();

    if (userRoleError) {
      console.error('Error assigning role:', userRoleError);
      return { success: false, error: userRoleError.message };
    }

    // Handle role-specific data tables
    if (roleName === 'mentor') {
      const mentorStatus = status || MENTOR_STATUS.PENDING;
      
      // Check if mentor record exists
      const { data: existingMentor } = await supabase
        .from('mentor_data')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingMentor) {
        // Update existing record
        await supabase
          .from('mentor_data')
          .update({ status: mentorStatus })
          .eq('user_id', userId);
      } else {
        // Create new record
        await supabase
          .from('mentor_data')
          .insert({
            user_id: userId,
            status: mentorStatus
          });
      }
    } else if (roleName === 'mentee') {
      // Check if mentee record exists
      const { data: existingMentee } = await supabase
        .from('mentee_data')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingMentee) {
        // Create new mentee record
        await supabase
          .from('mentee_data')
          .insert({ user_id: userId });
      }
    } else if (roleName === 'admin') {
      // Check if admin record exists
      const { data: existingAdmin } = await supabase
        .from('admin_data')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingAdmin) {
        // Create new admin record
        await supabase
          .from('admin_data')
          .insert({
            user_id: userId,
            email: '', // Will be updated by admin creation process
            name: 'Admin User'
          });
      }
    }

    console.log(`✅ Role '${roleName}' assigned to user ${userId}`);
    return { success: true, data: userRoleData };
  } catch (error) {
    console.error('Error in assignRoleToUser:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all roles for a user
 * @param {string} userId - The user ID to get roles for
 * @returns {Promise<{success: boolean, roles?: Array, error?: string}>}
 */
export async function getUserRoles(userId) {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error getting user roles:', error);
      return { success: false, error: error.message };
    }

    const roles = data?.map(r => r.roles.name) || [];
    return { success: true, roles };
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove all roles from a user
 * @param {string} userId - The user ID to remove roles from
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function removeAllUserRoles(userId) {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    // Remove from user_roles table
    const { error: userRoleError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    if (userRoleError) {
      console.error('Error removing user roles:', userRoleError);
      return { success: false, error: userRoleError.message };
    }

    // Remove from all data tables
    await Promise.all([
      supabase.from('admin_data').delete().eq('user_id', userId),
      supabase.from('mentor_data').delete().eq('user_id', userId),
      supabase.from('mentee_data').delete().eq('user_id', userId)
    ]);

    console.log(`✅ All roles removed from user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error('Error in removeAllUserRoles:', error);
    return { success: false, error: error.message };
  }
}
