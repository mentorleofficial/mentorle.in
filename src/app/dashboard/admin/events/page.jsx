"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Microservices
import {
  fetchAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventBanner,
  deleteEventBanner
} from "./services/eventService";

// Components
import EventFilters from "./components/EventFilters";
import EventCard from "./components/EventCard";
import EventForm from "./components/EventForm";
import DeleteDialog from "./components/DeleteDialog";
import ParticipantsDialog from "./components/ParticipantsDialog";

// Utils
import { toUTC } from "./utils/timezone";

function AdminEventsContent() {
  const { toast } = useToast();

  // State Management
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Events
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setIsLoading(true);
    const { data, error } = await fetchAllEvents();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive"
      });
    } else {
      console.log("Events with participant counts:", data);
      setEvents(data || []);
    }

    setIsLoading(false);
  };

  // Filter Events
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.college_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || event.event_type === filterType;
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle Create Event
  const handleCreateEvent = async (formData, imageFile) => {
    setIsSubmitting(true);

    try {
      // Prepare event data with IST to UTC conversion
      const eventData = {
        title: formData.title,
        description: formData.description,
        event_type: formData.event_type,
        college_name: formData.college_name,
        location: formData.location || null,
        start_date: toUTC(formData.start_date, formData.start_time),
        end_date: toUTC(formData.end_date, formData.end_time),
        registration_deadline: formData.registration_deadline 
          ? toUTC(formData.registration_deadline, "23:59") 
          : null,
        prerequisites: formData.prerequisites || null,
        learning_outcomes: formData.learning_outcomes || null,
        meeting_link: formData.meeting_link || null,
        status: formData.status,
        // Keep a simple cancellation flag in sync with status for mentee views
        is_cancelled: formData.status === "cancelled",
        banner_image_url: null
      };

      // Create event first
      const { data: newEvent, error: createError } = await createEvent(eventData);

      if (createError) throw createError;

      // Upload banner image if provided
      if (imageFile && newEvent) {
        const { url, error: uploadError } = await uploadEventBanner(imageFile, newEvent.id);

        if (uploadError) {
          console.error("Banner upload failed:", uploadError);
        } else if (url) {
          // Update event with banner URL
          await updateEvent(newEvent.id, { banner_image_url: url });
          newEvent.banner_image_url = url;
        }
      }

      // Update local state
      setEvents([newEvent, ...events]);
      
      toast({
        title: "Success",
        description: "Event created successfully!",
      });

      setIsFormOpen(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Update Event
  const handleUpdateEvent = async (formData, imageFile) => {
    setIsSubmitting(true);

    try {
      // Prepare event data with IST to UTC conversion
      const eventData = {
        title: formData.title,
        description: formData.description,
        event_type: formData.event_type,
        college_name: formData.college_name,
        location: formData.location || null,
        start_date: toUTC(formData.start_date, formData.start_time),
        end_date: toUTC(formData.end_date, formData.end_time),
        registration_deadline: formData.registration_deadline 
          ? toUTC(formData.registration_deadline, "23:59") 
          : null,
        prerequisites: formData.prerequisites || null,
        learning_outcomes: formData.learning_outcomes || null,
        meeting_link: formData.meeting_link || null,
        status: formData.status,
        is_cancelled: formData.status === "cancelled"
      };

      // Handle banner image
      if (imageFile) {
        // Delete old banner if exists
        if (currentEvent.banner_image_url) {
          await deleteEventBanner(currentEvent.banner_image_url);
        }

        // Upload new banner
        const { url, error: uploadError } = await uploadEventBanner(imageFile, currentEvent.id);

        if (uploadError) {
          console.error("Banner upload failed:", uploadError);
        } else if (url) {
          eventData.banner_image_url = url;
        }
      }

      // Update event
      const { data: updatedEvent, error: updateError } = await updateEvent(currentEvent.id, eventData);

      if (updateError) throw updateError;

      // Update local state
      setEvents(events.map(e => e.id === currentEvent.id ? updatedEvent : e));
      
      toast({
        title: "Success",
        description: "Event updated successfully!",
      });

      setIsFormOpen(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Event
  const handleDeleteEvent = async () => {
    setIsDeleting(true);

    try {
      // Delete banner image if exists
      if (currentEvent.banner_image_url) {
        await deleteEventBanner(currentEvent.banner_image_url);
      }

      // Delete event
      const { error } = await deleteEvent(currentEvent.id);

      if (error) throw error;

      // Update local state
      setEvents(events.filter(e => e.id !== currentEvent.id));
      
      toast({
        title: "Success",
        description: "Event deleted successfully!",
      });

      setIsDeleteDialogOpen(false);
      setCurrentEvent(null);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Dialog Handlers
  const openCreateDialog = () => {
    setCurrentEvent(null);
    setIsFormOpen(true);
  };

  const openEditDialog = (event) => {
    setCurrentEvent(event);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (event) => {
    setCurrentEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const openParticipantsDialog = (event) => {
    setCurrentEvent(event);
    setIsParticipantsDialogOpen(true);
  };

  const handleFormSubmit = (formData, imageFile) => {
    if (currentEvent) {
      handleUpdateEvent(formData, imageFile);
    } else {
      handleCreateEvent(formData, imageFile);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
              <p className="text-gray-600 mt-2">
                Manage bootcamps, workshops, guest sessions, and events
              </p>
            </div>
            <Button onClick={openCreateDialog} className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Filters */}
        <EventFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* Events Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No events found</p>
            <Button onClick={openCreateDialog} variant="outline" className="mt-4">
              Create First Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onViewParticipants={openParticipantsDialog}
              />
            ))}
          </div>
        )}

        {/* Event Form Dialog */}
        <EventForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setCurrentEvent(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={currentEvent}
          isSubmitting={isSubmitting}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setCurrentEvent(null);
          }}
          onConfirm={handleDeleteEvent}
          eventTitle={currentEvent?.title}
          isDeleting={isDeleting}
        />

        {/* Participants Dialog */}
        <ParticipantsDialog
          isOpen={isParticipantsDialogOpen}
          onClose={() => {
            setIsParticipantsDialogOpen(false);
            setCurrentEvent(null);
          }}
          event={currentEvent}
        />
      </div>
    </div>
  );
}

export default function AdminEventsPage() {
  return (
    <RoleProtected requiredRole={ROLES.ADMIN}>
      <AdminEventsContent />
    </RoleProtected>
  );
}
