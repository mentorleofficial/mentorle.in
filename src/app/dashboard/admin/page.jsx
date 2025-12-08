"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";
import Link from "next/link";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMentors: 0,
    totalMentees: 0,
    pendingMentors: 0,
    pendingSubscriptions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const { count: totalUsers, error: usersError } = await supabase
          .from("mentee_data")
          .select("*", { count: "exact" });

        // Fetch approved mentors
        const { count: totalMentors, error: mentorsError } = await supabase
          .from("mentor_data")
          .select("*", { count: "exact" })
          .eq("status", "approved");

        // Fetch mentees
        const { count: totalMentees, error: menteesError } = await supabase
          .from("mentee_data")
          .select("*", { count: "exact" });

        // Fetch pending mentor applications
        const { count: pendingMentors, error: pendingError } = await supabase
          .from("mentor_data")
          .select("*", { count: "exact" })
          .eq("status", "pending");

        // Fetch pending subscriptions
        const { count: pendingSubscriptions, error: subscriptionsError } = await supabase
          .from("user_subscriptions")
          .select("*", { count: "exact" })
          .eq("status", "pending");

        // Fetch recent activity
        // const { data: recentData, error: recentError } = await supabase
        //   .from("user_data")
        //   .select("*")
        //   .order("created_at", { ascending: false })
        //   .limit(5);

        // if (usersError || mentorsError || menteesError || pendingError || recentError) {
        //   throw new Error("Error fetching dashboard data");
        // }

        setStats({
          totalUsers: totalUsers || 0,
          totalMentors: totalMentors || 0,
          totalMentees: totalMentees || 0,
          pendingMentors: pendingMentors || 0,
          pendingSubscriptions: pendingSubscriptions || 0
        });

        // setRecentActivity(recentData || []);
        setIsLoading(false);
      } 
      
      catch (error) {
        
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="animate-pulse text-xl">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="bg-blue-50"
        />
        <StatsCard
          title="Active Mentors"
          value={stats.totalMentors}
          icon="👨‍🏫"
          color="bg-green-50"
        />
        <StatsCard
          title="Total Mentees"
          value={stats.totalMentees}
          icon="👨‍🎓"
          color="bg-purple-50"
        />
        <StatsCard
          title="Pending Applications"
          value={stats.pendingMentors}
          icon="⏳"
          color="bg-orange-50"
          alert={stats.pendingMentors > 0}
        />
        <StatsCard
          title="Pending Subscriptions"
          value={stats.pendingSubscriptions}
          icon="💳"
          color="bg-pink-50"
          alert={stats.pendingSubscriptions > 0}
        />
      </div>

      {/* Quick Access */}
      <h2 className="text-2xl font-semibold mb-4">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <QuickAccessCard
          title="Mentor Applications"
          description="Review and manage pending mentor applications"
          icon="📝"
          linkPath="/dashboard/admin/mentor-applications"
          buttonText="Review Applications"
          alert={stats.pendingMentors > 0}
        />
        <QuickAccessCard
          title="User Management"
          description="Manage all users, update roles and permissions"
          icon="👤"
          linkPath="/dashboard/admin/users"
          buttonText="Manage Users"
        />
        <QuickAccessCard
          title="User Subscriptions"
          description="Activate, manage and monitor user subscriptions"
          icon="💳"
          linkPath="/dashboard/admin/subscriptions"
          buttonText="Manage Subscriptions"
          alert={stats.pendingSubscriptions > 0}
        />
        <QuickAccessCard
          title="Feedback Management"
          description="Review user feedback, concerns, and suggestions"
          icon="💬"
          linkPath="/dashboard/admin/feedback"
          buttonText="Manage Feedback"
        />
        <QuickAccessCard
          title="News Automation"
          description="Manage automated news fetching and content"
          icon="📰"
          linkPath="/dashboard/admin/news-automation"
          buttonText="Manage News"
        />
        <QuickAccessCard
          title="Add Resources"
          description="Add new learning resources and materials"
          icon="📚"
          linkPath="/dashboard/admin/addresources"
          buttonText="Add Resources"
        />
      </div>      
      
      {/* Analytics Dashboard */}
      {/* <div className="mb-12 bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Platform Analytics Dashboard</h2>
        <p className="text-gray-600 mb-6">
          Track user growth, mentor distribution, and platform engagement with real-time analytics.
        </p>
        <AnalyticsDashboard />
      </div> */}

      {/* Recent Activity */}
      {/* <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
      <div className="bg-white rounded-lg shadow p-6">
        {recentActivity.length > 0 ? (
          <ul className="divide-y">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="py-3 flex justify-between items-center hover:bg-gray-50 rounded-md px-2">
                <div>
                  <p className="font-medium">{activity.first_name} {activity.last_name}</p>
                  <p className="text-sm text-gray-500">{activity.email}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-sm text-gray-500">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(activity.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 py-4">No recent activity</p>
        )}
      </div> */}
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon, color, alert = false }) {
  return (
    <div className={`${color} rounded-lg shadow p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]`}>
      {alert && (
        <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 m-2 animate-pulse"></div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-4xl opacity-50 transition-transform duration-300 hover:scale-110">{icon}</div>
      </div>
      <div className="absolute -bottom-6 -right-6 opacity-5 text-6xl">
        {icon}
      </div>
    </div>
  );
}

// Quick Access Card Component
function QuickAccessCard({ title, description, icon, linkPath, buttonText, alert = false }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 relative transition-all duration-300 hover:shadow-lg hover:border-l-4 hover:border-blue-500">
      {alert && (
        <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 m-2 animate-ping"></div>
      )}
      <div className="flex items-center mb-4">
        <div className="text-3xl mr-3 p-2 bg-gray-100 rounded-full">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6 min-h-[3rem]">{description}</p>
      <Link href={linkPath} className="block">
        <Button className="w-full group">
          <span>{buttonText}</span>
          <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Button>
      </Link>
    </div>
  );
}

// Main exported component with role protection
export default function AdminDashboard() {
  return (
    <RoleProtected requiredRole={ROLES.ADMIN}>
      <AdminDashboardContent />
    </RoleProtected>
  );
}
