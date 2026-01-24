"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, BookOpen, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import PostCard from "@/components/blogs/PostCard";
import BlogCardSkeleton from "@/components/blogs/BlogCardSkeleton";
import { Button } from "@/components/ui/button";
import { fetchBlogPosts, prefetchBlogPosts } from "@/lib/blogCache";

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("published");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPosts();
  }, [page, filterStatus]);

  // Prefetch next page on hover
  useEffect(() => {
    if (page < totalPages) {
      prefetchBlogPosts(page + 1, 12);
    }
  }, [page, totalPages]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data, pagination } = await fetchBlogPosts({
        page,
        limit: 12,
        status: filterStatus,
        useCache: true
      });
      
      setPosts(data || []);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Memoize filtered posts to avoid unnecessary recalculations
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    
    const lowerSearch = searchTerm.toLowerCase();
    return posts.filter((post) =>
      post.title?.toLowerCase().includes(lowerSearch) ||
      post.summary?.toLowerCase().includes(lowerSearch) ||
      post.tags?.some((tag) => tag.toLowerCase().includes(lowerSearch))
    );
  }, [posts, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 text-white py-20 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container relative mx-auto px-4 max-w-7xl">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wide">Knowledge Hub</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Discover Insights &
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Expert Knowledge
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Explore curated articles and insights from industry experts and mentors
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-1 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-7xl">
        {/* Search Bar */}
        <div className="mb-12 md:mb-16">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <Input
              placeholder="Search articles, topics, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-6 h-14 text-base border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200 placeholder:text-slate-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(12)].map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Search className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No articles found</h3>
              <p className="text-slate-600">
                {searchTerm ? `Try adjusting your search terms` : `Check back soon for new content`}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'article' : 'articles'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-full sm:w-auto border border-slate-300 rounded-xl px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  ← Previous
                </Button>
                
                <div className="flex items-center gap-2">
                  {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (page <= 3) {
                      pageNum = idx + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = page - 2 + idx;
                    }
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-full sm:w-auto border border-slate-300 rounded-xl px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  Next →
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Subtle Footer Gradient */}
      <div className="h-32 bg-gradient-to-t from-slate-100/50 to-transparent"></div>
    </div>
  );
}

