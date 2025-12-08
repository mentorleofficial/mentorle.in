"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TagList({ tags, className = "" }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          <Tag className="w-3 h-3 mr-1" />
          {tag}
        </Badge>
      ))}
    </div>
  );
}

