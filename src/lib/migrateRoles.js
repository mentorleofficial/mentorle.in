import { supabase } from './supabase';
import { ROLES, MENTOR_STATUS } from './roles';

/**
 * Migrate existing role data to the new normalized system
 * This function should be run once to migrate existing data
 */
export async function migrateExistingRoles() {
  try {
    console.log('🚀 Starting role migration...');

    // 1. Ensure roles exist in the roles table
    const roles = ['admin', 'mentor', 'mentee'];
    for (const roleName of roles) {
      const { data: existingRole, error: checkError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', roleName)
        .maybeSingle();

      if (checkError) {
        console.error(`Error checking role ${roleName}:`, checkError);
        continue;
      }

      if (!existingRole) {
        const { error: insertError } = await supabase
          .from('roles')
          .insert({ name: roleName });

        if (insertError) {
          console.error(`Error creating role ${roleName}:`, insertError);
        } else {
          console.log(`✅ Created role: ${roleName}`);
        }
      } else {
        console.log(`✅ Role already exists: ${roleName}`);
      }
    }

    // 2. Get all role IDs
    const { data: allRoles, error: rolesError } = await supabase
      .from('roles')
      .select('id, name');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return { success: false, error: rolesError.message };
    }

    const roleMap = {};
    allRoles.forEach(role => {
      roleMap[role.name] = role.id;
    });

    // 3. Migrate admin users
    console.log('📋 Migrating admin users...');
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_data')
      .select('user_id');

    if (!adminError && adminUsers) {
      for (const admin of adminUsers) {
        // Check if user already has admin role
        const { data: existingUserRole } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', admin.user_id)
          .eq('role_id', roleMap.admin)
          .maybeSingle();

        if (!existingUserRole) {
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: admin.user_id,
              role_id: roleMap.admin
            });

          if (insertError) {
            console.error(`Error adding admin role for user ${admin.user_id}:`, insertError);
          } else {
            console.log(`✅ Added admin role for user: ${admin.user_id}`);
          }
        }
      }
    }

    // 4. Migrate mentor users
    console.log('📋 Migrating mentor users...');
    const { data: mentorUsers, error: mentorError } = await supabase
      .from('mentor_data')
      .select('user_id');

    if (!mentorError && mentorUsers) {
      for (const mentor of mentorUsers) {
        // Check if user already has mentor role
        const { data: existingUserRole } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', mentor.user_id)
          .eq('role_id', roleMap.mentor)
          .maybeSingle();

        if (!existingUserRole) {
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: mentor.user_id,
              role_id: roleMap.mentor
            });

          if (insertError) {
            console.error(`Error adding mentor role for user ${mentor.user_id}:`, insertError);
          } else {
            console.log(`✅ Added mentor role for user: ${mentor.user_id}`);
          }
        }
      }
    }

    // 5. Migrate mentee users
    console.log('📋 Migrating mentee users...');
    const { data: menteeUsers, error: menteeError } = await supabase
      .from('mentee_data')
      .select('user_id');

    if (!menteeError && menteeUsers) {
      for (const mentee of menteeUsers) {
        // Check if user already has mentee role
        const { data: existingUserRole } = await supabase
          .from('user_roles')
          .select('id')
          .eq('user_id', mentee.user_id)
          .eq('role_id', roleMap.mentee)
          .maybeSingle();

        if (!existingUserRole) {
          const { error: insertError } = await supabase
            .from('user_roles')
            .insert({
              user_id: mentee.user_id,
              role_id: roleMap.mentee
            });

          if (insertError) {
            console.error(`Error adding mentee role for user ${mentee.user_id}:`, insertError);
          } else {
            console.log(`✅ Added mentee role for user: ${mentee.user_id}`);
          }
        }
      }
    }

    console.log('✅ Role migration completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Error in migrateExistingRoles:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify migration results
 */
export async function verifyMigration() {
  try {
    console.log('🔍 Verifying migration results...');

    // Check total users with roles
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select('user_id, roles(name)');

    if (userRolesError) {
      console.error('Error fetching user roles:', userRolesError);
      return { success: false, error: userRolesError.message };
    }

    const roleCounts = {};
    userRoles.forEach(ur => {
      const roleName = ur.roles.name;
      roleCounts[roleName] = (roleCounts[roleName] || 0) + 1;
    });

    console.log('📊 Migration Results:');
    console.log(`Total users with roles: ${userRoles.length}`);
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`  ${role}: ${count} users`);
    });

    return { success: true, data: { userRoles, roleCounts } };
  } catch (error) {
    console.error('Error in verifyMigration:', error);
    return { success: false, error: error.message };
  }
}
