import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-8 h-8 border-4 border-black border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-b-black animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.75s' }}></div>
          </div>
          <div>
            <p className="text-black font-bold uppercase tracking-wider text-sm">Loading Resources</p>
            <div className="flex gap-1 mt-1">
              <div className="w-1 h-1 bg-black rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-black rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
