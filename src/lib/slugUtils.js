/**
 * Utility functions for converting names to URL-friendly slugs
 */

/**
 * Convert a name to a URL-friendly slug
 * @param {string} name - The name to convert
 * @returns {string} - URL-friendly slug
 */
export function nameToSlug(name) {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^a-z0-9-]/g, '')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique slug by appending a number if needed
 * @param {string} baseSlug - The base slug
 * @param {number} existingCount - Number of existing similar slugs
 * @returns {string} - Unique slug
 */
export function generateUniqueSlug(baseSlug, existingCount = 0) {
  if (existingCount === 0) return baseSlug;
  return `${baseSlug}-${existingCount + 1}`;
}

/**
 * Extract name from a slug (reverse operation)
 * @param {string} slug - The slug to convert back
 * @returns {string} - Human-readable name
 */
export function slugToName(slug) {
  if (!slug) return '';
  
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
