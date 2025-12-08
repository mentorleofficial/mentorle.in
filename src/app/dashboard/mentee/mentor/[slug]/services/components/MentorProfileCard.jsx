import { useState } from "react";
import { Star, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { FormattingService } from "../utils/serviceUtils";

/**
 * MentorProfileCard - Reusable component for displaying mentor profile
 * This microservice component handles mentor profile display with image fallback
 */
export default function MentorProfileCard({ mentor, imageUrl }) {
  const [imageError, setImageError] = useState(false);

  if (!mentor) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg p-4 sticky top-20">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 sticky top-20">
      {/* Profile Picture */}
      <div className="text-center mb-4">
        {imageError || !imageUrl ? (
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-purple-600 font-bold text-lg">
              {FormattingService.getInitials(mentor.name)}
            </span>
          </div>
        ) : (
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Image
              src={imageUrl}
              alt={mentor.name}
              fill
              className="rounded-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        
        <div className="flex items-center justify-center gap-1 mb-2">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span className="text-sm lg:text-base font-medium text-gray-900">4.9</span>
        </div>
      </div>

      {/* Mentor Information */}
      <div className="space-y-3 text-sm">
        {mentor.bio && (
          <div>
            <h3 className="font-medium text-gray-900 mb-1 text:sm  lg:text-lg">About</h3>
            <p className="text-gray-600 text-xs lg:text-sm leading-relaxed line-clamp-3">
              {mentor.bio}
            </p>
          </div>
        )}

        {mentor.experience_years && (
          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{mentor.experience_years} years exp</span>
          </div>
        )}

        {mentor.location && (
          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{mentor.location}</span>
          </div>
        )}
      </div>
    </div>
  );
}