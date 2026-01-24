export default function BlogCardSkeleton() {
  return (
    <div className="h-full border border-slate-200 rounded-2xl bg-white overflow-hidden">
      {/* Cover Image Skeleton */}
      <div className="relative w-full h-52 bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-300/50 via-transparent to-transparent"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Meta Information Skeleton */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-6 w-24 bg-slate-100 rounded-full animate-pulse"></div>
          <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse"></div>
          <div className="h-6 w-20 bg-purple-100 rounded-full animate-pulse"></div>
        </div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-slate-200 rounded-lg w-full animate-pulse"></div>
          <div className="h-5 bg-slate-200 rounded-lg w-3/4 animate-pulse"></div>
        </div>

        {/* Summary Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-slate-100 rounded w-2/3 animate-pulse"></div>
        </div>

        {/* Tags Skeleton */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-16 bg-purple-50 border border-purple-100 rounded-full animate-pulse"></div>
          <div className="h-6 w-20 bg-purple-50 border border-purple-100 rounded-full animate-pulse"></div>
          <div className="h-6 w-14 bg-purple-50 border border-purple-100 rounded-full animate-pulse"></div>
        </div>

        {/* Read More Skeleton */}
        <div className="h-4 w-28 bg-purple-100 rounded animate-pulse"></div>
      </div>
    </div>
  );
}
