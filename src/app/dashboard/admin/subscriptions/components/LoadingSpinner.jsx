export default function LoadingSpinner() {
  return (
    <div className="grid grid-cols-1 gap-3">
      {[...Array(3)].map((_, index) => (
        <div 
          key={index}
          className="border border-black bg-white p-3 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] animate-pulse"
        >
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black/20 rounded-full"></div>
              <div className="w-8 h-3 bg-black/20"></div>
              <div className="w-12 h-4 bg-black/20"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-black/20 rounded-full"></div>
              <div className="w-16 h-3 bg-black/20"></div>
            </div>
          </div>

          {/* Content grid skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mb-3">
            {[...Array(3)].map((_, cellIndex) => (
              <div key={cellIndex}>
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-3 h-3 bg-black/20 rounded-full"></div>
                  <div className="w-12 h-3 bg-black/20"></div>
                </div>
                <div className="p-2 bg-black/5 border border-black/20">
                  <div className="w-full h-3 bg-black/20 mb-1"></div>
                  <div className="w-3/4 h-2 bg-black/20"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center gap-2 pt-2 border-t border-black/10">
            <div className="w-16 h-6 bg-black/20 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div>
            <div className="w-16 h-6 bg-black/20 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
