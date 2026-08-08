"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Calendar, Clock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import CommentSection from "@/components/blogs/CommentSection";
import LikeButton from "@/components/blogs/LikeButton";
import TagList from "@/components/blogs/TagList";
import RichTextRenderer from "@/components/blogs/RichTextRenderer";
import { supabase } from "@/lib/supabase";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchPost();
    fetchCurrentUser();
  }, [slug]);

  useEffect(() => {
    if (post && currentUser) {
      checkLikeStatus();
    }
  }, [post, currentUser]);

  const fetchCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setCurrentUser(session?.user || null);
  };

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          setPost(null);
          return;
        }
        throw new Error("Failed to fetch post");
      }

      const { data } = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkLikeStatus = async () => {
    if (!currentUser || !post) return;

    try {
      const { data, error } = await supabase
        .from("post_likes")
        .select("*")
        .eq("post_id", post.id)
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (!error && data) {
        setLiked(true);
      }

      // Get like count
      const { count } = await supabase
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id);

      setLikeCount(count || 0);
    } catch (error) {
      console.error("Error checking like status:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-lg border border-slate-200">
              <div className="w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-600 font-medium">Loading article...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/blogs">
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const publishedDate = post.published_at
    ? format(new Date(post.published_at), "MMMM d, yyyy")
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-5xl">
          <Link href="/blogs">
            <Button variant="ghost" className="text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-6xl w-full">
        <article className="w-full">
          {/* Modern Hero Header - Image + Content Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-8">
            {/* Left Column - Featured Image */}
            {post.cover_url && (
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={post.cover_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Blog cover image failed to load:', post.cover_url);
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                
                {/* Category Badge Overlay */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    News!
                  </span>
                </div>
              </div>
            )}

            {/* Right Column - Content */}
            <div className="flex flex-col justify-start">
              {/* Reading Time Badge */}
              <div className="flex items-center gap-2 mb-6">
                {post.reading_time_minutes && (
                  <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    {post.reading_time_minutes} mins read
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 break-words text-slate-900 leading-tight">
                {post.title}
              </h1>

              {/* Summary */}
              {post.summary && (
                <p className="text-base sm:text-lg text-slate-600 mb-8 break-words leading-relaxed line-clamp-4">
                  {post.summary}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
                {post.author?.email && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full text-slate-600">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="font-medium">{post.author.email.split("@")[0]}</span>
                  </div>
                )}
                {publishedDate && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>{publishedDate}</span>
                  </div>
                )}
              </div>

              {/* Tags and Like Button */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-slate-200">
                <TagList tags={post.tags} />
                {currentUser && (
                  <LikeButton
                    postId={post.id}
                    initialLiked={liked}
                    initialCount={likeCount}
                    onLikeChange={(newLiked, newCount) => {
                      setLiked(newLiked);
                      setLikeCount(newCount);
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Article Content - Rich Text */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-slate-200 mb-8">
            {post.content_json ? (
              // Render rich text JSON
              <div className="max-w-none">
                <RichTextRenderer content={post.content_json} />
              </div>
            ) : (
              // Fallback to plain text with formatting
              <div className="whitespace-pre-wrap break-words text-slate-700 text-base sm:text-lg leading-relaxed space-y-4">
                {post.content}
              </div>
            )}
          </div>

          {/* Footer Sections */}
          <footer className="space-y-6 w-full">
            {/* Comments Section */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200">
              <CommentSection postId={post.id} />
            </div>
          </footer>
        </article>
      </div>

      {/* Decorative Footer Gradient */}
      <div className="h-32 bg-gradient-to-t from-slate-100/50 to-transparent"></div>
    </div>
  );
}

