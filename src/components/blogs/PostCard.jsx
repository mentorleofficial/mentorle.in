"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { memo } from "react";

const PostCard = memo(function PostCard({ post }) {
  const publishedDate = post.published_at 
    ? format(new Date(post.published_at), "MMM d, yyyy")
    : null;

  return (
    <Link href={`/blogs/${post.slug}`} prefetch={false}>
      <Card className="h-full border border-slate-200 rounded-2xl hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer group bg-white overflow-hidden">
        {/* Cover Image */}
        {post.cover_url ? (
          <div className="relative w-full h-52 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              quality={75}
              unoptimized={post.cover_url.startsWith('http')}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
          </div>
        ) : (
          <div className="relative w-full h-52 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center">
            <div className="text-white text-6xl font-bold opacity-30">
              {post.title.charAt(0).toUpperCase()}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          </div>
        )}

        <CardHeader className="p-6 space-y-4">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
            {(post.author?.email || post.author_name) && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {post.author_name || post.author?.email?.split("@")[0] || 'Anonymous'}
                </span>
              </div>
            )}
            {publishedDate && (
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{publishedDate}</span>
              </div>
            )}
            {post.reading_time_minutes && (
              <div className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-full text-purple-700">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.reading_time_minutes} min read</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>

          {/* Summary */}
          {post.summary && (
            <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
              {post.summary}
            </p>
          )}
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-purple-200 bg-purple-50 text-purple-700 rounded-full px-3 py-1 font-medium hover:bg-purple-100 transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-slate-200 bg-slate-50 text-slate-600 rounded-full px-3 py-1 font-medium"
                >
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm group-hover:gap-3 transition-all">
            <span>Read Article</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

export default PostCard;

