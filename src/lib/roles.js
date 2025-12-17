/**
 * Role definitions and utilities for the Mentorle application
 * This file centralizes role-related constants and helper functions
 */

// Role definitions
export const ROLES = {
  ADMIN: "admin",
  MENTOR: "mentor",
  MENTEE: "mentee",
  PENDING_MENTOR: "pending_mentor"
};

// Mentor status definitions
export const MENTOR_STATUS = {
  APPROVED: "approved",
  PENDING: "pending",
  REJECTED: "rejected",
  CHANGES_REQUESTED: "changes_requested",
  DELETED: "deleted"
};

// Role hierarchy (higher index = more permissions)
const ROLE_HIERARCHY = [
  ROLES.MENTEE,
  ROLES.PENDING_MENTOR,
  ROLES.MENTOR,
  ROLES.ADMIN
];

// Dashboard routes for each role
export const DASHBOARD_ROUTES = {
  [ROLES.ADMIN]: "/dashboard/admin",
  [ROLES.MENTOR]: "/dashboard/mentor",
  [ROLES.MENTEE]: "/dashboard/mentee",
  [ROLES.PENDING_MENTOR]: "/dashboard/mentor" // Pending mentors now go to mentor dashboard
};

// Public routes accessible by authenticated users regardless of role
export const PUBLIC_AUTHENTICATED_ROUTES = [
  "/dashboard",
  "/dashboard/profile",
  "/apply-mentor",
  "/become-mentee"
];

/**
 * Check if a user has a specific role
 * @param {string} userRole - The user's current role
 * @param {string} requiredRole - The role to check against
 * @returns {boolean} - Whether the user has the required role or higher
 */
export const hasRole = (userRole, requiredRole) => {
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  // If either role is not found in the hierarchy, return false
  if (userRoleIndex === -1 || requiredRoleIndex === -1) return false;
  
  // Return true if user's role is >= the required role in the hierarchy
  return userRoleIndex >= requiredRoleIndex;
};

/**
 * Get route permissions for a specific role
 * @param {string} role - The role to get permissions for
 * @returns {Array<string>} - List of allowed route prefixes
 */
export const getRoutePermissions = (role) => {
  const routePermissions = {
    [ROLES.ADMIN]: [
      "/dashboard/admin",
      "/dashboard/mentor",
      "/dashboard/mentee"
    ],
    [ROLES.MENTOR]: [
      "/dashboard/mentor",
      "/dashboard/mentor/profile",
      "/dashboard/mentee"  // Mentors can also access mentee routes
    ],
    [ROLES.MENTEE]: [
      "/dashboard/mentee"
    ],
    [ROLES.PENDING_MENTOR]: [
      "/dashboard/mentor", // Pending mentors can access mentor dashboard
      "/dashboard/mentor/profile",
      "/mentor" // Pending mentors can explore other mentors
    ]
  };

  return routePermissions[role] || [];
};

/**
 * Get role display name for UI presentation
 * @param {string} role - Role identifier
 * @returns {string} - Human-readable role name
 */
export const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.ADMIN]: "Administrator",
    [ROLES.MENTOR]: "Mentor",
    [ROLES.MENTEE]: "Mentee",
    [ROLES.PENDING_MENTOR]: "Pending Mentor",
  };
  
  return displayNames[role] || "User";
};

/**
 * Check if a path is accessible for a role
 * @param {string} role - The user role
 * @param {string} path - The path to check
 * @returns {boolean} - Whether the path is accessible
 */
export const isPathAccessible = (role, path) => {
  // Check public routes first
  if (PUBLIC_AUTHENTICATED_ROUTES.some(route => 
    path === route || path === route + "/" || path.startsWith(route + "?"))) {
    return true;
  }
  
  // Get permissions for this role
  const permissions = getRoutePermissions(role);
  
  // Check if any permission allows this path
  return permissions.some(permissionPath => 
    path.startsWith(permissionPath));
};

/**
 * Get the home dashboard URL for a role
 * @param {string} role - The user role
 * @returns {string} - The dashboard home route
 */
export const getDashboardHomeRoute = (role) => {
  return DASHBOARD_ROUTES[role] || "/dashboard";
};
