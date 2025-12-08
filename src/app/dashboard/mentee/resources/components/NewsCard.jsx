"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Newspaper } from "lucide-react";

export default function NewsCard({ news }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNewsClick = () => {
    if (news.url) {
      window.open(news.url, '_blank');
    }
  };

  const getDomainFromUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return news.source || 'News Source';
    }
  };

  const getDisplayDate = () => {
    // Use publishedAt if available (from News API), otherwise use created_at
    const dateToUse = news.publishedAt || news.created_at;
    return formatDate(dateToUse);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200 cursor-pointer group"
      onClick={handleNewsClick}
    >
      {/* Thumbnail Section */}
      <div className="relative overflow-hidden">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Newspaper className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          </div>
        )}
        
        {/* Fallback div for failed images */}
        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 hidden items-center justify-center">
          <div className="text-center">
            <Newspaper className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <span className="text-gray-500 text-sm">No Image</span>
          </div>
        </div>

        {/* Source Badge */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm">
          {news.source || getDomainFromUrl(news.url)}
        </div>

        {/* New Badge for recent articles */}
        {news.publishedAt && isRecentNews(news.publishedAt) && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            New
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Domain Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              {(news.source || getDomainFromUrl(news.url))?.charAt(0).toUpperCase() || 'N'}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
              {news.title}
            </h3>

            {/* Description */}
            {news.description && (
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {news.description}
              </p>
            )}

            {/* Source and Date */}
            <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
              <span className="truncate">{news.source || getDomainFromUrl(news.url)}</span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="h-3 w-3" />
                <span>{getDisplayDate()}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to check if news is recent (within last 3 days)
function isRecentNews(publishedAt) {
  const publishedDate = new Date(publishedAt);
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  return publishedDate > threeDaysAgo;
}
