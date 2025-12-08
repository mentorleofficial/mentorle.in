import { supabase } from './supabase';
import { ROLES } from './roles';

/**
 * Create an admin user using the new normalized role system
 * @param {string} userId - The user ID to make admin
 * @param {string} email - Admin email
 * @param {string} name - Admin name
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function createAdminUser(userId, email, name) {
  try {
    if (!userId || !email) {
      return { success: false, error: 'User ID and email are required' };
    }

    // Check if user already has admin role
    const { data: existingRoles, error: checkError } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', userId);

    if (checkError) {
      console.error('Error checking existing roles:', checkError);
      return { success: false, error: checkError.message };
    }

    const userRoles = existingRoles?.map(r => r.roles.name) || [];
    if (userRoles.includes('admin')) {
      return { success: false, error: 'User is already an admin' };
    }

    // Get admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();

    if (roleError || !adminRole) {
      console.error('Admin role not found:', roleError);
      return { success: false, error: 'Admin role not found in database' };
    }

    // Add admin role to user_roles table
    const { data: userRoleData, error: userRoleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: adminRole.id
      })
      .select();

    if (userRoleError) {
      console.error('Error adding admin role:', userRoleError);
      return { success: false, error: userRoleError.message };
    }

    // Create admin_data entry for profile information
    const { data: adminData, error: adminDataError } = await supabase
      .from('admin_data')
      .insert({
        user_id: userId,
        email: email,
        name: name || 'Admin User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (adminDataError) {
      console.error('Error creating admin data:', adminDataError);
      // Rollback user_roles entry
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', adminRole.id);
      return { success: false, error: adminDataError.message };
    }

    console.log('✅ Admin user created successfully:', { userRoleData, adminData });
    return { success: true, data: { userRoleData, adminData } };
  } catch (error) {
    console.error('Error in createAdminUser:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if a user is an admin using the new normalized role system
 * @param {string} userId - The user ID to check
 * @returns {Promise<{success: boolean, isAdmin: boolean, error?: string}>}
 */
export async function checkAdminStatus(userId) {
  try {
    if (!userId) {
      return { success: false, isAdmin: false, error: 'User ID is required' };
    }

    // Check user_roles table for admin role
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', userId);

    if (rolesError) {
      console.error('Error checking admin status:', rolesError);
      return { success: false, isAdmin: false, error: rolesError.message };
    }

    const userRoles = rolesData?.map(r => r.roles.name) || [];
    const isAdmin = userRoles.includes('admin');

    // Also get admin_data for profile information
    const { data: adminData, error: adminDataError } = await supabase
      .from('admin_data')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return { 
      success: true, 
      isAdmin, 
      data: adminData,
      roles: userRoles
    };
  } catch (error) {
    console.error('Error in checkAdminStatus:', error);
    return { success: false, isAdmin: false, error: error.message };
  }
}

/**
 * Get all admin users
 * @returns {Promise<{success: boolean, admins?: Array, error?: string}>}
 */
export async function getAllAdmins() {
  try {
    const { data, error } = await supabase
      .from('admin_data')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admins:', error);
      return { success: false, error: error.message };
    }

    return { success: true, admins: data };
  } catch (error) {
    console.error('Error in getAllAdmins:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove admin privileges from a user using the new normalized role system
 * @param {string} userId - The user ID to remove admin from
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function removeAdminUser(userId) {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    // Get admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();

    if (roleError || !adminRole) {
      console.error('Admin role not found:', roleError);
      return { success: false, error: 'Admin role not found in database' };
    }

    // Remove admin role from user_roles table
    const { error: userRoleError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', adminRole.id);

    if (userRoleError) {
      console.error('Error removing admin role:', userRoleError);
      return { success: false, error: userRoleError.message };
    }

    // Remove admin_data entry
    const { error: adminDataError } = await supabase
      .from('admin_data')
      .delete()
      .eq('user_id', userId);

    if (adminDataError) {
      console.error('Error removing admin data:', adminDataError);
      return { success: false, error: adminDataError.message };
    }

    console.log('✅ Admin privileges removed for user:', userId);
    return { success: true };
  } catch (error) {
    console.error('Error in removeAdminUser:', error);
    return { success: false, error: error.message };
  }
}
