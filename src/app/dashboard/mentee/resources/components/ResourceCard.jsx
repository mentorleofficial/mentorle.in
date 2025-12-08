"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Calendar } from "lucide-react";

export default function ResourceCard({ resource }) {
  const handleResourceClick = () => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    const now = new Date();
    
    // Ensure we're comparing dates in the same timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateInUserTz = new Date(date.toLocaleString("en-US", {timeZone: userTimezone}));
    const nowInUserTz = new Date(now.toLocaleString("en-US", {timeZone: userTimezone}));
    
    const diffTime = Math.abs(nowInUserTz - dateInUserTz);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Show relative time for recent updates
    if (diffDays === 0) {
      return 'Updated today';
    } else if (diffDays === 1) {
      return 'Updated yesterday';
    } else if (diffDays <= 7) {
      return `Updated ${diffDays} days ago`;
    } else {
      return `Updated ${date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: userTimezone
      })}`;
    }
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">
              {resource.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Description preview if different from title */}
          {resource.description && resource.description !== resource.title && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {resource.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(resource.created_at)}</span>
            </div>
            <Button
              onClick={handleResourceClick}
              disabled={!resource.url}
              className="bg-black hover:bg-gray-800 text-white"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
