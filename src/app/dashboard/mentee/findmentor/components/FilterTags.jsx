import React from 'react';
import { X } from 'lucide-react';

export default function FilterTags({
  searchTerm,
  setSearchTerm,
  selectedIndustry,
  setSelectedIndustry,
  selectedExpertise,
  setSelectedExpertise,
  experienceRange,
  setExperienceRange,
  selectedLocation,
  setSelectedLocation,
  hasActiveFilters
}) {
  if (!hasActiveFilters) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {searchTerm && (
        <span className="inline-flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-sm">
          Search: {searchTerm}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
        </span>
      )}
      
      {selectedIndustry && (
        <span className="inline-flex items-center gap-1 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
          {selectedIndustry}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedIndustry("")} />
        </span>
      )}
      
      {selectedExpertise && (
        <span className="inline-flex items-center gap-1 bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
          {selectedExpertise}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedExpertise("")} />
        </span>
      )}
      
      {experienceRange && (
        <span className="inline-flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded-full text-sm">
          {experienceRange} years
          <X className="h-3 w-3 cursor-pointer" onClick={() => setExperienceRange("")} />
        </span>
      )}
      
      {selectedLocation && (
        <span className="inline-flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
          {selectedLocation}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLocation("")} />
        </span>
      )}
    </div>
  );
}
