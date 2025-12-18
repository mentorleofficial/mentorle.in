"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import PostCard from "@/components/blogs/PostCard";
import { Button } from "@/components/ui/button";

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("published");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page, filterStatus]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: filterStatus,
        page: page.toString(),
        limit: "12",
      });

      const response = await fetch(`/api/posts?${params}`);
      if (!response.ok) throw new Error("Failed to fetch posts");

      const { data, pagination } = await response.json();
      setPosts(data || []);
      setTotalPages(pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 md:w-10 md:h-10" />
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-white/80" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
              Blogs & Articles
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Explore our collection of insights, stories, and knowledge from expert mentors
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
            <Input
              placeholder="Search articles, topics, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg border-2 border-black rounded-none focus:ring-2 focus:ring-black focus:ring-offset-2 bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="animate-pulse space-y-4">
                <div className="h-8 w-48 bg-black mx-auto"></div>
                <div className="h-4 w-32 bg-gray-400 mx-auto"></div>
              </div>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 border-4 border-black rounded-full mx-auto mb-6 flex items-center justify-center">
                <Search className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">No articles found</h3>
              <p className="text-gray-600">
                {searchTerm ? `Try a different search term` : `Check back soon for new content`}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-8 border-t-2 border-black">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-2 border-black rounded-none px-6 py-2 font-bold hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                <span className="flex items-center px-6 text-lg font-bold text-black">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="border-2 border-black rounded-none px-6 py-2 font-bold hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

