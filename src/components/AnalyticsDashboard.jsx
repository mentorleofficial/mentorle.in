"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { LineChart, BarChart as RechartsBarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Enhanced bar chart component with hover effects
function BarChart({ data, height = 200, color = "#4F46E5" }) {
  const maxValue = Math.max(...data.map(item => item.value)) || 1;
  
  return (
    <div className="mt-2">
      <div className="flex ite
      ms-end h-[200px] gap-2">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100 || 0;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="relative w-full">
                <div
                  className="w-full bg-blue-500 rounded-t transition-all duration-300 group-hover:bg-blue-600"
                  style={{ 
                    height: `${Math.max(barHeight, 1)}%`,
                    backgroundColor: color
                  }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.value}
                  </div>
                </div>
              </div>
              <div className="text-xs mt-1 font-medium text-center w-full truncate">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userGrowth, setUserGrowth] = useState([]);
  const [mentorGrowth, setMentorGrowth] = useState([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [mentorTiers, setMentorTiers] = useState([]);
  const [domainStats, setDomainStats] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMentors, setTotalMentors] = useState(0);
  const [totalMentees, setTotalMentees] = useState(0);
  const [activeUserRate, setActiveUserRate] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        
        // Get user signups by date (last 7 days)
        const now = new Date();
        const lastWeekDates = [];
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Generate array of last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          lastWeekDates.push({
            date: date.toISOString().split('T')[0], // YYYY-MM-DD
            label: dayLabels[date.getDay()],
            value: 0, // Initial count
            mentorSignups: 0 // Initial mentor count
          });
        }
        
        // Fetch total user counts
        const { count: userCount, error: userCountError } = await supabase
          .from('user_data')
          .select('*', { count: 'exact' });
          
        if (userCountError) throw userCountError;
        setTotalUsers(userCount || 0);
        
        // Fetch mentees count
        const { count: menteeCount, error: menteeCountError } = await supabase
          .from('mentee_data')
          .select('*', { count: 'exact' });
          
        if (menteeCountError) throw menteeCountError;
        setTotalMentees(menteeCount || 0);
        
        // Fetch total mentor count
        const { count: mentorCount, error: mentorCountError } = await supabase
          .from('mentor_data')
          .select('*', { count: 'exact' });
        
        if (mentorCountError) throw mentorCountError;
        setTotalMentors(mentorCount || 0);
        
        // Fetch users created in the last 7 days
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { data: recentUsers, error: usersError } = await supabase
          .from('user_data')
          .select('created_at')
          .gte('created_at', sevenDaysAgo.toISOString());
          
        if (usersError) throw usersError;
        
        // Count users by day
        recentUsers.forEach(user => {
          const createdDate = new Date(user.created_at).toISOString().split('T')[0];
          const dayData = lastWeekDates.find(d => d.date === createdDate);
          if (dayData) {
            dayData.value += 1;
          }
        });
        
        // Fetch mentors registered in the last 7 days
        const { data: recentMentors, error: mentorsRecentError } = await supabase
          .from('mentor_data')
          .select('created_at')
          .gte('created_at', sevenDaysAgo.toISOString());
          
        if (!mentorsRecentError && recentMentors) {
          // Count mentors by day
          recentMentors.forEach(mentor => {
            const createdDate = new Date(mentor.created_at).toISOString().split('T')[0];
            const dayData = lastWeekDates.find(d => d.date === createdDate);
            if (dayData) {
              dayData.mentorSignups += 1;
            }
          });
        }
        
        // Format for chart display
        const userGrowthData = lastWeekDates.map(({ label, value }) => ({ label, value }));
        const mentorGrowthData = lastWeekDates.map(({ label, mentorSignups }) => ({ 
          label, 
          value: mentorSignups 
        }));
        
        // Fetch mentor data to analyze by experience level/tier
        const { data: mentorsData, error: mentorsError } = await supabase
          .from('mentor_data')
          .select('experience_years, expertise, domain');
          
        if (mentorsError) throw mentorsError;
        
        // Categorize mentors by experience tier
        const juniorMentors = mentorsData.filter(m => (m.experience_years || 0) < 3).length;
        const midLevelMentors = mentorsData.filter(m => (m.experience_years || 0) >= 3 && (m.experience_years || 0) < 7).length;
        const seniorMentors = mentorsData.filter(m => (m.experience_years || 0) >= 7 && (m.experience_years || 0) < 12).length;
        const expertMentors = mentorsData.filter(m => (m.experience_years || 0) >= 12).length;
        
        const mentorTiersData = [
          { label: "Junior (0-2 yrs)", value: juniorMentors },
          { label: "Mid (3-6 yrs)", value: midLevelMentors },
          { label: "Senior (7-11 yrs)", value: seniorMentors },
          { label: "Expert (12+ yrs)", value: expertMentors }
        ];
        
        // Analyze domain distribution
        const domains = {};
        mentorsData.forEach(mentor => {
          if (mentor.domain) {
            const domain = mentor.domain.trim();
            domains[domain] = (domains[domain] || 0) + 1;
          } else if (mentor.expertise) {
            // Fallback to expertise if domain not available
            const expertise = mentor.expertise.trim();
            domains[expertise] = (domains[expertise] || 0) + 1;
          }
        });
        
        const domainData = Object.entries(domains)
          .map(([domain, count]) => ({ label: domain, value: count }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // Top 5 domains
        
        // Count total mentoring sessions
        let sessionCount = 0;
        try {
          const { count, error: sessionsError } = await supabase
            .from('mentoring_sessions') // Replace with your actual sessions table name
            .select('*', { count: 'exact' });
            
          if (!sessionsError) {
            sessionCount = count || 0;
          }
        } catch (e) {
          
          // Estimate sessions based on user data if no session table
          sessionCount = Math.round(totalUsers * 0.3); // Assuming 30% of users had sessions
        }
        
        // Calculate active user rate (users who had at least one session)
        // This is an estimate if we don't have actual session data
        const activeUserRate = totalUsers > 0 ? 
          Math.round((sessionCount / totalUsers) * 100) : 
          0;
        
        // Set state with all the data
        setUserGrowth(userGrowthData);
        setMentorGrowth(mentorGrowthData);
        setMentorTiers(mentorTiersData);
        setDomainStats(domainData);
        setSessionCount(sessionCount);
        setActiveUserRate(activeUserRate);
        setIsLoading(false);
        
      } catch (error) {
        
        toast({
          title: "Error",
          description: "Failed to load analytics data.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-pulse text-xl">Loading analytics...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Platform Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">User Growth (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={userGrowth} color="#4F46E5" />
          </CardContent>
        </Card>
        
        {/* Mentor Distribution Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Mentor Distribution by Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={mentorTiers} color="#10B981" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mentor Expertise Domains */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Top Mentor Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={domainStats} color="#8B5CF6" />
          </CardContent>
        </Card>
        
        {/* Mentor Signups */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">New Mentor Signups (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={mentorGrowth} color="#F59E0B" />
          </CardContent>
        </Card>
      </div>
      
      {/* Platform Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Platform Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Total Users</div>
              <div className="text-2xl font-bold mt-1">{totalUsers}</div>
              <div className="text-xs text-blue-500 mt-1">
                {userGrowth.reduce((acc, day) => acc + day.value, 0)} new this week
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Mentor-Mentee Ratio</div>
              <div className="text-2xl font-bold mt-1">
                {totalMentors > 0 && totalMentees > 0 ? 
                  `1:${Math.round(totalMentees / totalMentors)}` : 
                  'N/A'}
              </div>
              <div className="text-xs text-green-500 mt-1">
                {totalMentors} mentors / {totalMentees} mentees
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Session Engagement</div>
              <div className="text-2xl font-bold mt-1">
                {sessionCount} sessions
              </div>
              <div className="text-xs text-purple-500 mt-1">
                {activeUserRate}% active user rate
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
