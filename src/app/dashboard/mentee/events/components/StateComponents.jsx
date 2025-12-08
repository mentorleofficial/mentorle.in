import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LoadingState = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-32 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
            <div className="bg-gray-200 h-8 rounded w-full"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ErrorState = ({ error }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="bg-red-50 rounded-full p-4 mb-6">
      <AlertCircle className="h-12 w-12 text-red-500" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Events</h3>
    <p className="text-gray-600 text-center mb-6 max-w-md">
      {error || "Something went wrong while loading events. Please try again."}
    </p>
    <Button 
      onClick={() => window.location.reload()} 
      className="flex items-center gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Try Again
    </Button>
  </div>
);
