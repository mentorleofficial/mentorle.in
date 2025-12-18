"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, Tag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function PostCard({ post }) {
  const publishedDate = post.published_at 
    ? format(new Date(post.published_at), "MMM d, yyyy")
    : null;

  return (
    <Link href={`/blogs/${post.slug}`}>
      <Card className="h-full border-2 border-black rounded-none hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer group bg-white overflow-hidden">
        {/* Cover Image */}
        {post.cover_url ? (
          <div className="relative w-full h-56 overflow-hidden bg-black">
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        ) : (
          <div className="relative w-full h-56 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
            <div className="text-white text-6xl font-black opacity-20">
              {post.title.charAt(0).toUpperCase()}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          </div>
        )}

        <CardHeader className="p-6">
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-black mb-4">
            {post.author?.email && (
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wide">{post.author.email.split("@")[0]}</span>
              </div>
            )}
            {publishedDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wide">{publishedDate}</span>
              </div>
            )}
            {post.reading_time_minutes && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wide">{post.reading_time_minutes} min</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-black text-black mb-3 group-hover:underline transition-all line-clamp-2 leading-tight">
            {post.title}
          </h3>

          {/* Summary */}
          {post.summary && (
            <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
              {post.summary}
            </p>
          )}
        </CardHeader>

        <CardContent className="p-6 pt-0">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-black text-black rounded-none px-2 py-1 font-bold uppercase tracking-wide"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-black text-black rounded-none px-2 py-1 font-bold"
                >
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-black font-bold text-sm group-hover:gap-3 transition-all">
            <span className="uppercase tracking-wider">Read Article</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

