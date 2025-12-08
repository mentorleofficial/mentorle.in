"use client";

import { useState } from 'react';

export default function ShareButton({ mentorName, mentorUrl }) {
  const [copied, setCopied] = useState(false);
  
  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/mentor/${mentorUrl}`;
    
    // Try to use Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${mentorName} - Mentor Profile`,
          text: `Check out ${mentorName.split(' ')[0]}'s profile on Mentorle!`,
          url: shareUrl,
        });
        return;
      } catch (error) {
        // Fall back to clipboard if share fails or is cancelled
        if (error.name !== 'AbortError') {
          console.log('Web Share API failed, falling back to copy');
        } else {
          return; // User cancelled, don't proceed
        }
      }
    }
    
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full shadow-lg transition-all duration-200 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black/20 relative"
      title="Share mentor profile"
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )}
      
      {copied && (
        <div className="absolute -bottom-8 right-0 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
          Link copied!
        </div>
      )}
    </button>
  );
}
