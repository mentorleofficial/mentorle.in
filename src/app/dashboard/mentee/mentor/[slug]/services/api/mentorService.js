import { supabase } from "@/lib/supabase";
import { slugToName } from "@/lib/slugUtils";

/**
 * MentorService - Handles all mentor-related API operations
 * This microservice encapsulates mentor data fetching with multiple fallback strategies
 */
export class MentorService {
  /**
   * Fetch mentor by slug with multiple fallback strategies
   * @param {string} slug - The mentor slug from URL
   * @returns {Promise<{data: Object|null, error: Error|null}>}
   */
  static async fetchMentorBySlug(slug) {
    try {
      const mentorName = slugToName(slug);
      console.log("Looking for mentor with name:", mentorName);
      
      // Strategy 1: Exact match
      const exactResult = await supabase
        .from("mentor_data")
        .select("*")
        .eq("name", mentorName)
        .single();

      if (!exactResult.error && exactResult.data) {
        return { data: exactResult.data, error: null };
      }

      // Strategy 2: Case-insensitive match
      console.log("Exact match failed, trying case-insensitive match");
      const caseInsensitiveResult = await supabase
        .from("mentor_data")
        .select("*")
        .ilike("name", mentorName)
        .single();

      if (!caseInsensitiveResult.error && caseInsensitiveResult.data) {
        return { data: caseInsensitiveResult.data, error: null };
      }

      // Strategy 3: Partial match
      console.log("Case-insensitive match failed, trying partial match");
      const partialResult = await supabase
        .from("mentor_data")
        .select("*")
        .ilike("name", `%${mentorName}%`)
        .limit(1);

      if (!partialResult.error && partialResult.data && partialResult.data.length > 0) {
        return { data: partialResult.data[0], error: null };
      }

      return { 
        data: null, 
        error: new Error("Mentor not found with any matching strategy") 
      };
    } catch (error) {
      console.error("Error in fetchMentorBySlug:", error);
      return { data: null, error };
    }
  }

  /**
   * Fetch mentor services by user ID
   * @param {string} mentorUserId - The mentor's user ID
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  static async fetchMentorServices(mentorUserId) {
    try {
      const { data, error } = await supabase
        .from("mentor_services")
        .select("*")
        .eq("mentor_user_id", mentorUserId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching mentor services:", error);
        return { data: [], error };
      }

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error in fetchMentorServices:", error);
      return { data: [], error };
    }
  }

  /**
   * Get mentor profile image URL
   * @param {string} profileUrl - The profile URL from mentor data
   * @returns {Promise<string>} - Returns the processed image URL
   */
  static async getProfileImageUrl(profileUrl) {
    try {
      if (!profileUrl) {
        return "";
      }

      if (profileUrl.startsWith("http")) {
        return profileUrl;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(profileUrl);
      return data?.publicUrl || "";
    } catch (error) {
      console.error("Error getting profile image URL:", error);
      return "";
    }
  }

  /**
   * Fetch complete mentor data with services and profile image
   * @param {string} slug - The mentor slug from URL
   * @returns {Promise<{mentor: Object|null, services: Array, imageUrl: string, error: Error|null}>}
   */
  static async fetchMentorComplete(slug) {
    try {
      // Fetch mentor data
      const { data: mentor, error: mentorError } = await this.fetchMentorBySlug(slug);
      
      if (mentorError || !mentor) {
        return { 
          mentor: null, 
          services: [], 
          imageUrl: "", 
          error: mentorError || new Error("Mentor not found") 
        };
      }

      // Fetch services and image URL in parallel
      const [servicesResult, imageUrl] = await Promise.all([
        this.fetchMentorServices(mentor.user_id),
        this.getProfileImageUrl(mentor.profile_url)
      ]);

      return {
        mentor,
        services: servicesResult.data,
        imageUrl,
        error: servicesResult.error
      };
    } catch (error) {
      console.error("Error in fetchMentorComplete:", error);
      return { 
        mentor: null, 
        services: [], 
        imageUrl: "", 
        error 
      };
    }
  }
}

export default MentorService;