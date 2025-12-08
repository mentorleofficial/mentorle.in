import { Clock, Star, Video, BookOpen } from "lucide-react";
import Link from "next/link";
import { FormattingService } from "../utils/serviceUtils";

/**
 * ServiceCard - Reusable component for displaying individual service
 * This microservice component handles service display with consistent formatting
 */
export default function ServiceCard({ service }) {
  if (!service) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="w-16 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded mb-3"></div>
          <div className="flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const isCallService = service.title.toLowerCase().includes("call");
  const serviceType = isCallService ? "Call" : "Resource";
  const serviceIcon = isCallService ? Video : BookOpen;
  const IconComponent = serviceIcon;

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <IconComponent className="h-5 w-5 text-purple-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
              {service.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {FormattingService.formatDuration(service.duration_minutes)}
              </div>
              <span className="font-medium text-gray-900">
                {FormattingService.formatPrice(service.price, service.currency)}
              </span>
            </div>
          </div>
        </div>
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium flex-shrink-0">
          {serviceType}
        </span>
      </div>

      {service.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {service.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star className="h-3 w-3 text-yellow-400 fill-current" />
          <span>4.9</span>
          <span>({FormattingService.generateRandomReviewCount()} reviews)</span>
        </div>
        <div className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed opacity-75 text-sm font-medium text-center">
          Coming Soon
        </div>
      </div>
    </div>
  );
}