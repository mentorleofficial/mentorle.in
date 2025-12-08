/**
 * Filter mentors based on applied filters
 * 
 * @param {Array} mentors - The full list of mentors to filter
 * @param {Object} filters - The filter criteria to apply
 * @returns {Array} - Filtered mentors list
 */
export function filterMentors(mentors, filters) {
  const {
    searchTerm,
    selectedIndustry,
    selectedExpertise,
    experienceRange,
    selectedLocation
  } = filters;
  
  let filtered = [...mentors];

  // Search term filter
  if (searchTerm) {
    filtered = filtered.filter(mentor => 
      mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.Industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(mentor.expertise_area) 
        ? mentor.expertise_area.some(area => area.toLowerCase().includes(searchTerm.toLowerCase()))
        : mentor.expertise_area?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  // Industry filter
  if (selectedIndustry) {
    filtered = filtered.filter(mentor => mentor.Industry === selectedIndustry);
  }

  // Expertise filter
  if (selectedExpertise) {
    filtered = filtered.filter(mentor => {
      if (Array.isArray(mentor.expertise_area)) {
        return mentor.expertise_area.includes(selectedExpertise);
      }
      return mentor.expertise_area === selectedExpertise;
    });
  }

  // Experience range filter
  if (experienceRange) {
    filtered = filtered.filter(mentor => {
      const years = mentor.experience_years;
      if (!years) return false;
      
      switch (experienceRange) {
        case "0-2": return years >= 0 && years <= 2;
        case "3-5": return years >= 3 && years <= 5;
        case "6-10": return years >= 6 && years <= 10;
        case "10+": return years > 10;
        default: return true;
      }
    });
  }

  // Location filter
  if (selectedLocation) {
    filtered = filtered.filter(mentor => mentor.location === selectedLocation);
  }

  return filtered;
}

/**
 * Extract unique filter options from mentor data
 * 
 * @param {Array} mentorData - The mentor data to extract options from
 * @returns {Object} - Object containing arrays of filter options
 */
export function extractFilterOptions(mentorData) {
  // Extract unique industries
  const industries = [...new Set(mentorData.map(m => m.Industry).filter(Boolean))];

  // Extract unique expertise areas
  const allExpertiseAreas = mentorData.flatMap(mentor => {
    if (Array.isArray(mentor.expertise_area)) {
      return mentor.expertise_area;
    } else if (mentor.expertise_area) {
      return [mentor.expertise_area];
    }
    return [];
  });
  const expertiseAreas = [...new Set(allExpertiseAreas)];

  // Extract unique locations
  const locations = [...new Set(mentorData.map(m => m.location).filter(Boolean))];

  return {
    industries,
    expertiseAreas,
    locations
  };
}
