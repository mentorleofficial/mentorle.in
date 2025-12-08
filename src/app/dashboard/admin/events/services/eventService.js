import { supabase } from "@/lib/supabase";

/**
 * Event Service - Handles all event-related API operations
 * Microservice for events_programs table operations
 */

// Fetch all events
export const fetchAllEvents = async () => {
  try {
    const { data: events, error } = await supabase
      .from("events_programs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch participant counts for all events
    const eventsWithCounts = await Promise.all(
      (events || []).map(async (event) => {
        const { count, error: countError } = await supabase
          .from("event_participants")
          .select("*", { count: "exact", head: true })
          .eq("event_id", event.id);

        return {
          ...event,
          participant_count: countError ? 0 : (count || 0)
        };
      })
    );

    return { data: eventsWithCounts, error: null };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { data: null, error };
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from("events_programs")
      .insert([{
        ...eventData,
        created_by: user?.id
      }])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating event:", error);
    return { data: null, error };
  }
};

// Update an existing event
export const updateEvent = async (eventId, eventData) => {
  try {
    const { data, error } = await supabase
      .from("events_programs")
      .update(eventData)
      .eq("id", eventId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error updating event:", error);
    return { data: null, error };
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const { error } = await supabase
      .from("events_programs")
      .delete()
      .eq("id", eventId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { error };
  }
};

// Upload event banner image
export const uploadEventBanner = async (file, eventId) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${eventId}-${Date.now()}.${fileExt}`;
    const filePath = `events/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("media")
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading banner:", error);
    return { url: null, error };
  }
};

// Delete event banner from storage
export const deleteEventBanner = async (bannerUrl) => {
  try {
    if (!bannerUrl) return { error: null };
    
    const path = bannerUrl.split("/media/")[1];
    if (!path) return { error: null };

    const { error } = await supabase.storage
      .from("media")
      .remove([path]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Error deleting banner:", error);
    return { error };
  }
};
