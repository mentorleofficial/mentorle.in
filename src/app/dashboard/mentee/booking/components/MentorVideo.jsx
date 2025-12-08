"use client";

import { useState, useEffect } from "react";
import { Play } from "lucide-react";

export default function MentorVideo({ youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }) {
  const [videoId, setVideoId] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [isChannelUrl, setIsChannelUrl] = useState(false);
  const [channelId, setChannelId] = useState(null);
  const [channelName, setChannelName] = useState(null);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
             (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
    };
    setIsMobile(checkMobile());
  }, []);

  useEffect(() => {
    if (!youtubeUrl) return;

    try {
      // Reset states
      setVideoId(null);
      setChannelId(null);
      setChannelName(null);
      setIsChannelUrl(false);
      setVideoError(false);

      // Check for video URL first
      const videoRegExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const videoMatch = youtubeUrl.match(videoRegExp);
      
      if (videoMatch && videoMatch[1]) {
        // It's a video URL
        const id = videoMatch[1];
        setVideoId(id);
        setThumbnailUrl(`https://img.youtube.com/vi/${id}/maxresdefault.jpg`);
        setIsChannelUrl(false);
        return;
      }

      // Check for channel URLs
      const channelRegExps = [
        // youtube.com/channel/CHANNEL_ID
        /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
        // youtube.com/c/CHANNEL_NAME or youtube.com/user/USERNAME
        /youtube\.com\/(?:c|user)\/([a-zA-Z0-9_-]+)/,
        // youtube.com/@HANDLE
        /youtube\.com\/@([a-zA-Z0-9_.-]+)/,
        // youtube.com/CUSTOM_URL
        /youtube\.com\/([a-zA-Z0-9_-]+)(?:\/.*)?$/
      ];

      for (const regExp of channelRegExps) {
        const match = youtubeUrl.match(regExp);
        if (match && match[1]) {
          setChannelId(match[1]);
          setChannelName(match[1]);
          setIsChannelUrl(true);
          // For channels, we'll use a generic YouTube thumbnail
          setThumbnailUrl("https://www.youtube.com/img/desktop/yt_1200.png");
          return;
        }
      }

      // If no pattern matches, it's an error
      console.error("Invalid YouTube URL format");
      setVideoError(true);
      
    } catch (error) {
      console.error("Error parsing YouTube URL:", error);
      setVideoError(true);
    }
  }, [youtubeUrl]);

  const handlePlayClick = () => {
    if (isChannelUrl) {
      // Open channel directly in new tab
      window.open(youtubeUrl, '_blank');
      return;
    }

    // For video URLs - existing logic
    if (isMobile) {
      const shouldOpenDirectly = window.confirm(
        "Would you like to open this video in the YouTube app for the best experience?"
      );
      if (shouldOpenDirectly) {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
        return;
      }
    }
    setShowVideo(true);
  };

  if (!youtubeUrl) return null;

  if (videoError) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="text-center text-gray-500">
          <div className="h-10 w-10 mx-auto mb-2 text-gray-400 flex items-center justify-center bg-gray-100 rounded">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <p>Unable to load introduction video.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold flex items-center">
          <div className="h-5 w-5 mr-2 text-red-600 flex items-center justify-center bg-red-100 rounded">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          {isChannelUrl ? "YouTube Channel" : "Introduction Video"}
        </h3>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:underline focus:outline-none"
        >
          {isExpanded ? "Hide details" : (isChannelUrl ? "Why visit this?" : "Why watch this?")}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
          {isChannelUrl ? (
            <>
              <p>Visiting this YouTube channel will help you:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                <li>Explore the mentor's content library and teaching style</li>
                <li>See their expertise areas through their video topics</li>
                <li>Get familiar with their communication approach</li>
                <li>Find additional learning resources they've created</li>
              </ul>
            </>
          ) : (
            <>
              <p>Watching this introduction video will help you:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                <li>Get a better sense of the mentor's personality and communication style</li>
                <li>Understand their teaching approach before booking a session</li>
                <li>Make a more informed decision about whether they're the right mentor for you</li>
              </ul>
            </>
          )}
        </div>
      )}
      
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 relative">
        {isChannelUrl ? (
          // Show channel preview
          <div className="relative w-full h-full cursor-pointer bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center" onClick={handlePlayClick}>
            <div className="text-center text-white p-6">
              <div className="mb-4">
                <svg className="h-16 w-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2">YouTube Channel</h4>
              <p className="text-sm opacity-90 mb-4">@{channelName}</p>
              <div className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-full font-semibold text-sm hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 relative overflow-hidden">
                {/* Top curve */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-20 rounded-t-full"></div>
                {/* Bottom curve */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black opacity-20 rounded-b-full"></div>
                {/* Subscribe icon */}
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                SUBSCRIBE
              </div>
            </div>
          </div>
        ) : videoId && !showVideo ? (
          // Show thumbnail with play button for better mobile compatibility
          <div className="relative w-full h-full cursor-pointer" onClick={handlePlayClick}>
            <img
              src={thumbnailUrl}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default thumbnail if maxresdefault fails
                e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-40 transition-all">
              <div className="bg-red-600 rounded-full p-3 hover:bg-red-700 transition-colors shadow-lg">
                <Play className="h-8 w-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        ) : videoId && showVideo && !embedError ? (
          // Show actual iframe after user interaction
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
            title="Mentor Introduction"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            onError={() => setEmbedError(true)}
          ></iframe>
        ) : embedError ? (
          // Show fallback when embed fails
          <div className="relative w-full h-full flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center p-6">
              <div className="mb-4">
                <svg className="h-12 w-12 mx-auto text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <p className="text-sm mb-4">Video embed not available on this device</p>
              <a 
                href={`https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch on YouTube
              </a>
            </div>
          </div>
        ) : (
          // Loading state
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex space-x-4 w-full p-4">
              <div className="rounded-full bg-gray-200 h-10 w-10 flex-shrink-0"></div>
              <div className="flex-1 space-y-6">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                    <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500">
          {isChannelUrl 
            ? "Tap to subscribe to YouTube channel" 
            : showVideo 
              ? "Playing introduction video" 
              : "Tap to play introduction video"
          }
        </p>
        {(videoId || isChannelUrl) && (
          <a 
            href={isChannelUrl ? youtubeUrl : `https://www.youtube.com/watch?v=${videoId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-red-600 hover:underline flex items-center"
          >
            <div className="h-3 w-3 mr-1 flex items-center justify-center">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            {isChannelUrl ? "Subscribe to channel" : "Watch on YouTube"}
          </a>
        )}
      </div>
    </div>
  );
}