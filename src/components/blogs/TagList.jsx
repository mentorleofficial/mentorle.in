"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TagList({ tags, className = "" }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <Badge 
          key={index} 
          className="bg-purple-50 border border-purple-200 text-purple-700 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-purple-100 transition-colors"
        >
          <Tag className="w-3 h-3 mr-1" />
          {tag}
        </Badge>
      ))}
    </div>
  );
}

