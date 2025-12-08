import { useState, useMemo } from "react";
import { BookOpen } from "lucide-react";
import ServiceCard from "./ServiceCard";
import { FilterService } from "../utils/serviceUtils";

/**
 * ServicesGrid - Component for displaying services with filtering
 * This microservice component handles service filtering and grid display
 */
export default function ServicesGrid({ services = [], loading = false }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Memoized filtered services to optimize performance
  const filteredServices = useMemo(() => {
    return FilterService.filterServicesByCategory(services, selectedCategory);
  }, [services, selectedCategory]);

  // Memoized available categories
  const availableCategories = useMemo(() => {
    return FilterService.getAvailableCategories(services);
  }, [services]);

  // Category display names
  const categoryDisplayNames = {
    all: "All",
    calls: "1:1 Call",
    resources: "Resources"
  };

  if (loading) {
    return (
      <div className="lg:col-span-2">
        <div className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <ServiceCard key={index} service={null} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Mentor's Offerings</h2>
      </div>

      {/* Filter Tabs - Only show if there are multiple categories */}
      {availableCategories.length > 1 && (
        <div className="flex gap-2 mb-4">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label={`Filter by ${categoryDisplayNames[category]}`}
            >
              {categoryDisplayNames[category]}
            </button>
          ))}
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <EmptyState selectedCategory={selectedCategory} />
      ) : (
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * EmptyState - Component for when no services are found
 */
function EmptyState({ selectedCategory }) {
  return (
    <div className="text-center py-8">
      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <h3 className="text-sm font-semibold text-gray-700 mb-1">No Services Found</h3>
      <p className="text-xs text-gray-500">
        {selectedCategory !== "all"
          ? "Try adjusting your filters"
          : "No services available yet"}
      </p>
    </div>
  );
}