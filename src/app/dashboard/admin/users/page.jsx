"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import RoleProtected from "@/components/RoleProtected";
import { ROLES, MENTOR_STATUS } from "@/lib/roles";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

function UserManagementContent() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userRoles, setUserRoles] = useState({});
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch all users from all role-specific tables
        const { data: mentorData, error: mentorError } = await supabase
          .from("mentor_data")
          .select("*");

        if (mentorError) {
          throw mentorError;
        }

        const { data: menteeData, error: menteeError } = await supabase
          .from("mentee_data")
          .select("*");

        if (menteeError) {
          throw menteeError;
        }

        const { data: adminData, error: adminError } = await supabase
          .from("admin_data")
          .select("*");

        if (adminError) {
          throw adminError;
        }

        // Combine users from all tables and add role information
        const allUsers = [
          ...adminData.map(user => ({
            ...user,
            role: ROLES.ADMIN,
            status: null,
            badge: null
          })),
          ...mentorData.map(user => ({
            ...user,
            role: user.status === MENTOR_STATUS.PENDING ? ROLES.PENDING_MENTOR : ROLES.MENTOR,
            status: user.status,
            badge: user.badge || null
          })),
          ...menteeData.map(user => ({
            ...user,
            role: ROLES.MENTEE,
            status: null,
            badge: null
          }))
        ];

        // De-duplicate users if a user appears in multiple tables
        // Using user_id as the unique identifier
        const uniqueUsers = Array.from(
          new Map(allUsers.map(user => [user.user_id, user])).values()
        );

        setUsers(uniqueUsers);
        setFilteredUsers(uniqueUsers);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Filter users when search term or role filter changes
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.first_name?.toLowerCase().includes(term) ||
        user.last_name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    }
    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserRoles({
      role: user.role,
      status: user.status || "",
      badge: user.badge || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (!selectedUser || !userRoles.role) return;

      const currentRole = selectedUser.role;
      const newRole = userRoles.role;
      const userId = selectedUser.user_id;

      // Step 1: Remove user from their current role table if role is changing
      if (currentRole !== newRole) {
        if (currentRole === ROLES.ADMIN || currentRole === "No Role") {
          const { error } = await supabase
            .from("admin_data")
            .delete()
            .eq("user_id", userId);
          if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
            throw error;
          }
        } else if (currentRole === ROLES.MENTOR || currentRole === ROLES.PENDING_MENTOR) {
          const { error } = await supabase
            .from("mentor_data")
            .delete()
            .eq("user_id", userId);
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
        } else if (currentRole === ROLES.MENTEE) {
          const { error } = await supabase
            .from("mentee_data")
            .delete()
            .eq("user_id", userId);
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
        }
      }

      // Step 2: Add user to new role table
      if (newRole === ROLES.ADMIN) {
        // Always insert for admin (since we deleted above if role changed)
        const { error } = await supabase
          .from("admin_data")
          .insert({
            user_id: userId,
            role: "admin",
            first_name: selectedUser.first_name || "",
            last_name: selectedUser.last_name || "",
            email: selectedUser.email || "",
          });
        if (error && error.code !== '23505') { // 23505 = unique constraint violation
          throw error;
        }
      } else if (newRole === ROLES.MENTOR || newRole === ROLES.PENDING_MENTOR) {
        const status = newRole === ROLES.PENDING_MENTOR ?
          MENTOR_STATUS.PENDING : (userRoles.status || MENTOR_STATUS.APPROVED);

        if (currentRole === newRole) {
          // Same role, just update status and badge if it's a mentor role
          const updateData = { status: status };
          // Handle badge assignment/removal
          if (userRoles.badge && userRoles.badge !== "") {
            updateData.badge = userRoles.badge;
          } else {
            updateData.badge = null; // Remove badge if empty
          }
          const { error } = await supabase
            .from("mentor_data")
            .update(updateData)
            .eq("user_id", userId);
          if (error) throw error;
        } else {
          // Different role, insert new record
          const insertData = {
            user_id: userId,
            status: status,
            role: "mentor",
            first_name: selectedUser.first_name || "",
            last_name: selectedUser.last_name || "",
            email: selectedUser.email || "",
          };
          if (userRoles.badge && userRoles.badge !== "") {
            insertData.badge = userRoles.badge;
          }
          const { error } = await supabase
            .from("mentor_data")
            .insert(insertData);
          if (error && error.code !== '23505') {
            throw error;
          }
        }
      } else if (newRole === ROLES.MENTEE) {
        // Always insert for mentee (since we deleted above if role changed)
        const { error } = await supabase
          .from("mentee_data")
          .insert({
            user_id: userId,
            first_name: selectedUser.first_name || "",
            last_name: selectedUser.last_name || "",
            email: selectedUser.email || "",
            role: "mentee",
          });
        if (error && error.code !== '23505') {
          throw error;
        }
      }

      toast({
        title: "Success",
        description: "User role updated successfully."
      });

      // Refresh the user list
      router.refresh();
      setIsEditDialogOpen(false);

      // Update the local user list
      setUsers(users.map(u =>
        u.user_id === userId
          ? { ...u, role: newRole, status: userRoles.status, badge: userRoles.badge }
          : u
      ));

    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      return;
    }

    try {
      // Delete user data from the appropriate table based on their role
      if (user.role === ROLES.ADMIN) {
        await supabase
          .from("admin_data")
          .delete()
          .eq("user_id", user.user_id);
      } else if (user.role === ROLES.MENTOR || user.role === ROLES.PENDING_MENTOR) {
        await supabase
          .from("mentor_data")
          .delete()
          .eq("user_id", user.user_id);
      } else if (user.role === ROLES.MENTEE) {
        await supabase
          .from("mentee_data")
          .delete()
          .eq("user_id", user.user_id);
      }

      // Note: In production, you might want to also delete the user from auth

      toast({
        title: "Success",
        description: "User deleted successfully."
      });

      // Update local state
      setUsers(users.filter(u => u.user_id !== user.user_id));
      setFilteredUsers(filteredUsers.filter(u => u.user_id !== user.user_id));

    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="animate-pulse text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-500 mt-1">Manage all users and their roles</p>
        </div>
        <Link href="/dashboard/admin">
          <Button variant="outline" className="mt-4 md:mt-0">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="search" className="text-sm font-medium">Search Users</Label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <Input
                id="search"
                className="pl-10"
                placeholder="Search by name, email, or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Search across name, email, and user ID fields</p>
          </div>
          <div>
            <Label htmlFor="roleFilter" className="text-sm font-medium">Filter by Role</Label>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                <SelectItem value={ROLES.MENTOR}>Mentor</SelectItem>
                <SelectItem value={ROLES.PENDING_MENTOR}>Pending Mentor</SelectItem>
                <SelectItem value={ROLES.MENTEE}>Mentee</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-4 flex gap-2">
              {roleFilter !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRoleFilter("all")}
                  className="text-xs"
                >
                  Clear Filter
                </Button>
              )}
              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="text-xs"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
          </p>
          <Button
            size="sm"
            onClick={() => window.location.reload()}
            className="text-xs"
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Badge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status && <StatusBadge status={user.status} />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.badge && <MentorBadge badge={user.badge} />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Role</DialogTitle>
              <DialogDescription>
                Update the role for {selectedUser.first_name} {selectedUser.last_name}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="userRole">Role</Label>
                <Select
                  value={userRoles.role}
                  onValueChange={(value) => setUserRoles({ ...userRoles, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ROLES.ADMIN}>Admin</SelectItem>
                    <SelectItem value={ROLES.MENTOR}>Mentor</SelectItem>
                    <SelectItem value={ROLES.PENDING_MENTOR}>Pending Mentor</SelectItem>
                    <SelectItem value={ROLES.MENTEE}>Mentee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(userRoles.role === ROLES.MENTOR || userRoles.role === ROLES.PENDING_MENTOR) && (
                <>
                  <div>
                    <Label htmlFor="mentorStatus">Mentor Status</Label>
                    <Select
                      value={userRoles.status || ""}
                      onValueChange={(value) => setUserRoles({ ...userRoles, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MENTOR_STATUS.APPROVED}>Approved</SelectItem>
                        <SelectItem value={MENTOR_STATUS.PENDING}>Pending</SelectItem>
                        <SelectItem value={MENTOR_STATUS.REJECTED}>Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="mentorBadge">Mentor Badge</Label>
                    <Select
                      value={userRoles.badge || ""}
                      onValueChange={(value) => setUserRoles({ ...userRoles, badge: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select badge (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Badge</SelectItem>
                        <SelectItem value="Instructor">Instructor</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Badge helps distinguish between different types of mentors
                    </p>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Role Badge Component
function RoleBadge({ role }) {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let icon = null;

  switch (role) {
    case ROLES.ADMIN:
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      );
      break;
    case ROLES.MENTOR:
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      );
      break;
    case ROLES.PENDING_MENTOR:
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
      break;
    case ROLES.MENTEE:
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      );
      break;
    default:
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} transition-all hover:shadow-sm`}>
      {icon}
      {role}
    </span>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let borderColor = "border-gray-300";
  let icon = null;

  switch (status) {
    case MENTOR_STATUS.APPROVED:
      bgColor = "bg-green-50";
      textColor = "text-green-700";
      borderColor = "border-green-300";
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
      break;
    case MENTOR_STATUS.PENDING:
      bgColor = "bg-yellow-50";
      textColor = "text-yellow-700";
      borderColor = "border-yellow-300";
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
      break;
    case MENTOR_STATUS.REJECTED:
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      borderColor = "border-red-300";
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      );
      break;
    default:
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${bgColor} ${textColor} ${borderColor}`}>
      {icon}
      {status}
    </span>
  );
}

// Mentor Badge Component
function MentorBadge({ badge }) {
  if (!badge) return null;

  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";
  let icon = null;

  switch (badge.toLowerCase()) {
    case 'Instructor':
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      );
      break;
    case 'mentor':
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      );
      break;
    default:
      icon = (
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
        </svg>
      );
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} transition-all hover:shadow-sm`}>
      {icon}
      {badge.charAt(0).toUpperCase() + badge.slice(1)}
    </span>
  );
}

// Main exported component with role protection
export default function UserManagement() {
  return (
    <RoleProtected requiredRole={ROLES.ADMIN}>
      <UserManagementContent />
    </RoleProtected>
  );
}