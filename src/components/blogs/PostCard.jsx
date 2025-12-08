"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, Tag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function PostCard({ post }) {
  const publishedDate = post.published_at 
    ? format(new Date(post.published_at), "MMM d, yyyy")
    : null;

  return (
    <Link href={`/blogs/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        {post.cover_url && (
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <Image
              src={post.cover_url}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            {post.author?.email && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author.email.split("@")[0]}</span>
              </div>
            )}
            {publishedDate && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{publishedDate}</span>
                </div>
              </>
            )}
            {post.reading_time_minutes && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.reading_time_minutes} min read</span>
                </div>
              </>
            )}
          </div>
          <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent>
          {post.summary && (
            <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

