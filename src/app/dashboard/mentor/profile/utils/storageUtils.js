import { supabase } from "@/lib/supabase";

/**
 * Upload profile image to Supabase storage
 * @param {File} file - The image file to upload
 * @param {string} userId - User ID for unique file naming
 * @returns {Promise<string>} - Public URL of uploaded image
 */
export const uploadProfileImage = async (file, userId) => {
  try {
    const fileExt = file.name.split('.').pop();
    // Use a simpler filename without special characters
    const fileName = `profile_${Date.now()}.${fileExt}`;
    const filePath = `mentor-profiles/${fileName}`;

    console.log('Uploading file:', { fileName, filePath, fileSize: file.size, fileType: file.type });

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    console.log('Upload successful, public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

/**
 * Delete profile image from Supabase storage
 * @param {string} imageUrl - URL of the image to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteProfileImage = async (imageUrl) => {
  try {
    if (!imageUrl) return true;

    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `mentor-profiles/${fileName}`;
    
    const { error: deleteError } = await supabase.storage
      .from('media')
      .remove([filePath]);
    
    if (deleteError) {
      console.warn("Failed to delete image:", deleteError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting profile image:', error);
    return false;
  }
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} - Validation result with isValid and error message
 */
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: "Please select a JPG, PNG, or GIF image" };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: "Please select an image smaller than 5MB" };
  }

  return { isValid: true, error: null };
};

/**
 * Check if image URL is valid and accessible
 * @param {string} imageUrl - Image URL to check
 * @returns {Promise<boolean>} - Whether the image URL is valid
 */
export const isValidImageUrl = async (imageUrl) => {
  if (!imageUrl) return false;
  
  try {
    // Check if URL contains old UUID format that causes 400 errors
    if (imageUrl.includes('_1758648634604') || imageUrl.includes('1e7d5a18-a8a2-4e45-ab8e-6192a3307fde')) {
      console.warn('Detected old/broken image URL:', imageUrl);
      return false;
    }
    
    // Basic URL format validation
    const url = new URL(imageUrl);
    if (!url.hostname.includes('supabase.co')) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating image URL:', error);
    return false;
  }
};

/**
 * Clean up broken image URLs from database
 * @param {string} userId - User ID to clean up
 */
export const cleanupBrokenImageUrls = async (userId) => {
  try {
    console.log('Cleaning up broken image URLs for user:', userId);
    
    // Check current profile
    const { data: profile, error: fetchError } = await supabase
      .from('mentor_data')
      .select('profile_url')
      .eq('user_id', userId)
      .single();
    
    if (fetchError || !profile) {
      console.log('No profile found or error fetching profile');
      return;
    }
    
    // Check if current URL is broken
    const isValid = await isValidImageUrl(profile.profile_url);
    
    if (!isValid && profile.profile_url) {
      console.log('Removing broken image URL:', profile.profile_url);
      
      // Remove broken URL from database
      const { error: updateError } = await supabase
        .from('mentor_data')
        .update({ profile_url: null })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error('Error removing broken URL:', updateError);
      } else {
        console.log('Successfully removed broken image URL');
      }
    }
  } catch (error) {
    console.error('Error in cleanupBrokenImageUrls:', error);
  }
};
