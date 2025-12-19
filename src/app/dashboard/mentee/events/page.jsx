"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Calendar, TrendingUp, SortAsc } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import components
import EventsList from "./components/EventsList";
import EventsFilter from "./components/EventsFilter";
import EventStats from "./components/EventStats";
import { LoadingState, ErrorState } from "./components/StateComponents";
import EmptyState from "./components/EmptyState";

export default function MenteeEventsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, []);
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("events_programs")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;
      
      // Debug: Log the fetched data
      console.log('Fetched events data:', data);
      console.log('First event banner_image_url:', data?.[0]?.banner_image_url);
      
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  // Smart sorting function for better event representation
  const getSortedEvents = (eventsToSort) => {
    const now = new Date();
    
    return eventsToSort.sort((a, b) => {
      // Skip events without dates
      if (!a.start_date && !b.start_date) return 0;
      if (!a.start_date) return 1;
      if (!b.start_date) return -1;
      
      const aStartDate = new Date(a.start_date);
      const bStartDate = new Date(b.start_date);
      const aEndDate = a.end_date ? new Date(a.end_date) : null;
      const bEndDate = b.end_date ? new Date(b.end_date) : null;
      
      // Get event status for sorting priority
      const getStatus = (startDate, endDate) => {
        if (startDate > now) return 'upcoming';
        if (startDate <= now && (!endDate || endDate >= now)) return 'ongoing';
        return 'completed';
      };
      
      const aStatus = getStatus(aStartDate, aEndDate);
      const bStatus = getStatus(bStartDate, bEndDate);
      
      // For "All Events" view, prioritize featured events within each status
      if (filterType === 'all') {
        // Featured events come first within same status
        if (aStatus === bStatus) {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
        }
      }
      
      // Priority order: ongoing > upcoming > completed
      const statusPriority = { ongoing: 3, upcoming: 2, completed: 1 };
      
      // First, sort by status priority
      if (statusPriority[aStatus] !== statusPriority[bStatus]) {
        return statusPriority[bStatus] - statusPriority[aStatus];
      }
      
      // Within same status, sort by:
      if (aStatus === 'ongoing') {
        // Ongoing: Sort by end date (ending soon first), then by start date
        if (aEndDate && bEndDate) {
          return aEndDate - bEndDate;
        }
        return aStartDate - bStartDate;
      } else if (aStatus === 'upcoming') {
        // Upcoming: Sort by start date (sooner first)
        return aStartDate - bStartDate;
      } else {
        // Completed: Sort by end date (recently ended first)
        if (aEndDate && bEndDate) {
          return bEndDate - aEndDate;
        }
        return bStartDate - aStartDate;
      }
    });
  };// Filter and sort events based on date logic
  const getFilteredAndSortedEvents = () => {
    const now = new Date();
    
    let filtered = events.filter(event => {
      if (filterType === "all") return true;
      
      // Skip events without start_date
      if (!event.start_date) return false;
      
      const startDate = new Date(event.start_date);
      const endDate = event.end_date ? new Date(event.end_date) : null;
      
      // Skip invalid dates
      if (isNaN(startDate.getTime())) return false;
      if (endDate && isNaN(endDate.getTime())) return false;
      
      switch (filterType) {
        case "upcoming":
          return startDate > now;
        case "ongoing":
          return startDate <= now && (!endDate || endDate >= now);
        case "completed":
          return endDate ? endDate < now : startDate < now;
        default:
          return false;
      }
    });

    // Apply smart sorting
    return getSortedEvents(filtered);
  };

  const filteredEvents = getFilteredAndSortedEvents();

  // Get event statistics based on date logic
  const getEventStats = () => {
    const total = events.length;
    const now = new Date();
    
    let upcoming = 0;
    let ongoing = 0;
    let completed = 0;
    
    events.forEach(event => {
      // Skip events without start_date
      if (!event.start_date) return;
      
      const startDate = new Date(event.start_date);
      const endDate = event.end_date ? new Date(event.end_date) : null;
      
      // Skip invalid dates
      if (isNaN(startDate.getTime())) return;
      if (endDate && isNaN(endDate.getTime())) return;
      
      if (startDate > now) {
        upcoming++;
      } else if (startDate <= now && (!endDate || endDate >= now)) {
        ongoing++;
      } else if (endDate ? endDate < now : startDate < now) {
        completed++;
      }
    });

    return { total, upcoming, ongoing, completed };
  };

  const stats = getEventStats();
  return (
    <div className="max-w-8xl min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30">
      <div className="container max-w-8xl mt-6 sm:mt-8 md:mt-10 mx-auto px-3 sm:px-4 py-3 sm:py-4">        
        {/* Header Section with Stats */}
        <div className="mb-3 sm:mb-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4 lg:gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-black to-black bg-clip-text text-transparent mb-2">
                Events & Programs
              </h1>
              <p className="text-gray-600 flex items-center text-sm sm:text-base">
                <Calendar className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                <span>Discover upcoming bootcamps, workshops, and events</span>
              </p>
            </div>

            {/* Compact Stats */}
            {events.length > 0 && (
              <div className="lg:flex-shrink-0 lg:w-auto w-full">
                <EventStats 
                  stats={stats} 
                  onFilterChange={setFilterType}
                  currentFilter={filterType}
                />
              </div>
            )}
          </div>
        </div>
        {/* Enhanced Filter Section */}
        {/* <EventsFilter 
          filterType={filterType}
          setFilterType={setFilterType}
          events={events}
        />         */}        {/* Sorting Information */}
        {/* {filteredEvents.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 rounded-lg p-3 border">
            <div className="flex items-center gap-2 text-sm text-gray-700 min-w-0">
              <SortAsc className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="font-medium truncate">
                {filterType === 'all' ? 'Smart sort: Live → Upcoming → Completed (Featured first)' : 
                 filterType === 'upcoming' ? 'Sorted by: Earliest events first' : 
                 filterType === 'ongoing' ? 'Sorted by: Ending soon first' : 
                 'Sorted by: Recently ended first'}
              </span>
            </div>
            <div className="text-sm text-gray-500 font-medium flex-shrink-0">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </div>
          </div>
        )} */}

        {/* Loading, Error, and Empty States */}
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} />
        ) : filteredEvents.length === 0 ? (
          <EmptyState filterType={filterType} router={router} />
        ) : (
          <EventsList 
            events={filteredEvents} 
            loading={isLoading} 
          />
        )}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
