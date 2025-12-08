import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * PageHeader - Reusable header component for mentor pages
 * This microservice component handles navigation and page title display
 */
export default function PageHeader({ 
  title, 
  showBackButton = true, 
  showShareButton = true,
  onBack,
  onShare,
  className = ""
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share functionality
      if (navigator.share) {
        navigator.share({
          title: title,
          url: window.location.href,
        }).catch(console.error);
      } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
          // You could add a toast notification here
          console.log('URL copied to clipboard');
        }).catch(console.error);
      }
    }
  };

  return (
    <div className={`bg-white border-b border-gray-100 sticky top-0 z-40 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
          )}
          
          <h1 className="text-lg font-semibold text-gray-900 truncate flex-1 mx-2">
            {title}
          </h1>
          
          {showShareButton && (
            <button 
              onClick={handleShare}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Share page"
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}