"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowRight,
  Star,
  ExternalLink,
  CalendarDays
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FeaturedEvent({ showOnlyUpcoming = false }) {
  const router = useRouter();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      // Featured events come first within same status
      if (aStatus === bStatus) {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
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
        // Upcoming: Sort by start date (sooner first), then by start time
        if (aStartDate.getTime() === bStartDate.getTime()) {
          // Same date, sort by start time
          const aTime = a.start_time || '00:00';
          const bTime = b.start_time || '00:00';
          return aTime.localeCompare(bTime);
        }
        return aStartDate - bStartDate;
      } else {
        // Completed: Sort by end date (recently ended first)
        if (aEndDate && bEndDate) {
          return bEndDate - aEndDate;
        }
        return bStartDate - aStartDate;
      }
    });
  };

  // Get filtered and sorted events - limit to top 6 for dashboard
  const getFeaturedEvents = () => {
    let eventsToProcess = [...events];
    
    // Filter for upcoming events only if requested
    if (showOnlyUpcoming) {
      eventsToProcess = eventsToProcess.filter(event => {
        // Check if status is specifically "upcoming"
        return event.status && event.status.toLowerCase() === 'upcoming';
      });
    }
    
    const sortedEvents = getSortedEvents(eventsToProcess);
    return sortedEvents.slice(0, 6); // Show only top 6 events on dashboard
  };

  const featuredEvents = getFeaturedEvents();

  // Get event status
  const getEventStatus = (event) => {
    if (!event.start_date) return 'unknown';
    
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = event.end_date ? new Date(event.end_date) : null;
    
    if (startDate > now) return 'upcoming';
    if (startDate <= now && (!endDate || endDate >= now)) return 'ongoing';
    return 'completed';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format time string (HH:MM format) for display
  const formatTimeString = (timeString) => {
    if (!timeString) return '';
    
    try {
      // Handle both timestamp and HH:MM formats
      let timeToFormat;
      if (timeString.includes('T') || timeString.includes(' ')) {
        // It's a timestamp, extract time
        timeToFormat = new Date(timeString).toTimeString().slice(0, 5);
      } else {
        // It's already in HH:MM format
        timeToFormat = timeString;
      }
      
      const [hours, minutes] = timeToFormat.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      console.warn("Could not format time:", timeString);
      return '';
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ongoing':
        return 'bg-white text-black group-hover:bg-black group-hover:text-white';
      case 'upcoming':
        return 'bg-white text-black group-hover:bg-black group-hover:text-white';
      case 'completed':
        return 'bg-white text-black group-hover:bg-black group-hover:text-white';
      default:
        return 'bg-white text-black group-hover:bg-black group-hover:text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-black p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-xl animate-pulse"></div>
            <div>
              <div className="w-40 h-6 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="w-56 h-4 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-24 h-9 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="bg-white rounded-xl p-5 border border-black animate-pulse">
              <div className="w-full h-36 bg-gray-300 rounded-lg mb-4"></div>
              <div className="w-3/4 h-5 bg-gray-300 rounded mb-3"></div>
              <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
              <div className="w-2/3 h-4 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
                <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-black p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-black mb-2">Failed to Load Events</h3>
          <p className="text-gray-800 mb-6">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black transition-colors font-medium shadow-sm border border-black"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (featuredEvents.length === 0) {
    // If showing only upcoming events and there are none, don't render anything
    if (showOnlyUpcoming) {
      return null;
    }
    
    // Otherwise show the "No Events Available" message
    return (
      <div className="bg-white rounded-xl shadow-sm border border-black p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">
                Upcoming Events
              </h2>
              <p className="text-sm text-gray-800">Discover upcoming programs and workshops</p>
            </div>
          </div>
        </div>
        
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-black mb-2">No Events Available</h3>
          <p className="text-gray-800 mb-6">Check back later for upcoming events and programs.</p>
          <button
            onClick={() => router.push('/dashboard/mentee/events')}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black transition-colors font-medium shadow-sm border border-black"
          >
            Explore Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-black p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-black">
              Featured Events
            </h2>
            <p className="text-sm text-gray-800">Discover upcoming programs and workshops</p>
          </div>
        </div>
        
        <button
          onClick={() => router.push('/dashboard/mentee/events')}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-white hover:text-black rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:-translate-y-0.5 border border-black"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredEvents.map((event) => {
          const status = getEventStatus(event);
          const statusBadge = getStatusBadge(status);
          
          return (
            <div
              key={event.id}
              className="bg-white rounded-xl p-5 border border-black hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1 hover:bg-black hover:text-white"
              onClick={() => router.push(`/dashboard/mentee/events`)}
            >
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {event.is_featured && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-black text-white group-hover:bg-white group-hover:text-black rounded-full text-xs font-medium border border-black">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </div>
                  )}
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border border-black ${statusBadge}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-800 group-hover:text-white transition-colors" />
              </div>

              {/* Event Title */}
              <h3 className="font-bold text-black group-hover:text-white mb-3 line-clamp-2 transition-colors text-lg">
                {event.title || 'Untitled Event'}
              </h3>

              {/* Event Description */}
              {event.description && (
                <p className="text-sm text-gray-700 group-hover:text-gray-200 mb-4 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>
              )}

              {/* Event Details */}
              <div className="space-y-2 text-sm text-gray-700 group-hover:text-gray-200">
                {event.start_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-black group-hover:text-white" />
                    <span>
                      {formatDate(event.start_date)}
                      {event.start_time && ` at ${formatTimeString(event.start_time)}`}
                    </span>
                  </div>
                )}
                
                {event.end_date && event.end_date !== event.start_date && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-black group-hover:text-white" />
                    <span>Ends {formatDate(event.end_date)}</span>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-black group-hover:text-white" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}

                {event.max_participants && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-black group-hover:text-white" />
                    <span>Max {event.max_participants} participants</span>
                  </div>
                )}
              </div>

              {/* Join Session Button */}
              {event.meeting_link && (
                <div className="mt-4 pt-4 border-t border-gray-200 group-hover:border-gray-600">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      window.open(event.meeting_link, '_blank');
                    }}
                    className="w-full px-4 py-2 bg-black text-white group-hover:bg-white group-hover:text-black rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md border border-black flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Join Session
                  </button>
                </div>
              )}

              {/* Event Type/Category */}
              {event.event_type && (
                <div className="mt-4 pt-4 border-t border-gray-200 group-hover:border-gray-600">
                  <span className="inline-block px-3 py-1 text-xs bg-white text-black group-hover:bg-black group-hover:text-white rounded-full font-medium border border-black">
                    {event.event_type}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* View All Footer */}
      {events.length > 6 && (
        <div className="mt-8 pt-6 border-t border-black text-center">
          <button
            onClick={() => router.push('/dashboard/mentee/events')}
            className="text-black hover:text-white hover:bg-black font-semibold text-sm flex items-center justify-center gap-2 mx-auto hover:underline transition-all duration-200 px-4 py-2 rounded-lg border border-black"
          >
            View {events.length - 6} more events
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
