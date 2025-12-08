/**
 * FormattingService - Handles all formatting operations
 * This microservice provides consistent formatting across the application
 */
export class FormattingService {
  /**
   * Format price with currency symbol
   * @param {number} price - The price value
   * @param {string} currency - The currency code (INR, USD, EUR, GBP)
   * @returns {string} - Formatted price string
   */
  static formatPrice(price, currency) {
    const currencySymbols = {
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£'
    };
    return `${currencySymbols[currency] || currency} ${price}`;
  }

  /**
   * Format duration from minutes to human readable format
   * @param {number} minutes - Duration in minutes
   * @returns {string} - Formatted duration string
   */
  static formatDuration(minutes) {
    if (minutes < 60) {
      return `${minutes} Min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  /**
   * Generate initials from a full name
   * @param {string} name - Full name
   * @returns {string} - Initials in uppercase
   */
  static getInitials(name) {
    if (!name) return "";
    
    const parts = name.split(" ");
    return parts.map(part => part.charAt(0)).join("").toUpperCase();
  }

  /**
   * Generate random review count for display
   * @param {number} min - Minimum review count
   * @param {number} max - Maximum review count
   * @returns {number} - Random review count
   */
  static generateRandomReviewCount(min = 5, max = 50) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

/**
 * FilterService - Handles filtering operations for services
 */
export class FilterService {
  /**
   * Filter services based on category
   * @param {Array} services - Array of services
   * @param {string} category - Category filter ('all', 'calls', 'resources')
   * @returns {Array} - Filtered services array
   */
  static filterServicesByCategory(services, category) {
    if (!Array.isArray(services)) return [];
    
    return services.filter(service => {
      const matchesCategory = category === "all" || 
                             (category === "calls" && service.title.toLowerCase().includes("call")) ||
                             (category === "resources" && service.title.toLowerCase().includes("resource"));
      
      return matchesCategory;
    });
  }

  /**
   * Get available categories from services array
   * @param {Array} services - Array of services
   * @returns {Array} - Array of available categories
   */
  static getAvailableCategories(services) {
    if (!Array.isArray(services)) return ["all"];
    
    const categories = new Set(["all"]);
    
    services.forEach(service => {
      if (service.title.toLowerCase().includes("call")) {
        categories.add("calls");
      }
      if (service.title.toLowerCase().includes("resource")) {
        categories.add("resources");
      }
    });
    
    return Array.from(categories);
  }
}

export default { FormattingService, FilterService };