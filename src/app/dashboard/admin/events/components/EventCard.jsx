import { Calendar, MapPin, School, Edit, Trash2, Tag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatIndianDateTime } from "../utils/timezone";

export default function EventCard({ event, onEdit, onDelete, onViewParticipants }) {
  const getStatusColor = (status) => {
    const colors = {
      upcoming: "bg-blue-100 text-blue-800",
      ongoing: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type) => {
    const colors = {
      bootcamp: "bg-purple-100 text-purple-800",
      workshop: "bg-indigo-100 text-indigo-800",
      guest_session: "bg-pink-100 text-pink-800",
      event: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Banner Image */}
      {event.banner_image_url && (
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={event.banner_image_url}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Status and Type Badges */}
        <div className="flex gap-2 mb-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(event.status)}`}>
            {event.status?.toUpperCase()}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(event.event_type)}`}>
            {event.event_type?.replace("_", " ").toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <School className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{event.college_name}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-red-600" />
              <span>{event.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-green-600" />
            <span>{formatIndianDateTime(event.start_date)}</span>
          </div>

          {/* Participant Count */}
          {event.participant_count !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="font-medium">{event.participant_count} Registered</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(event)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              onClick={() => onDelete(event)}
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
          <Button
            onClick={() => onViewParticipants(event)}
            variant="outline"
            size="sm"
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <Users className="h-4 w-4 mr-1" />
            View Participants ({event.participant_count || 0})
          </Button>
        </div>
      </div>
    </Card>
  );
}
