"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LikeButton({ 
  postId, 
  commentId, 
  initialLiked = false, 
  initialCount = 0,
  onLikeChange 
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    const optimisticLiked = !liked;
    const optimisticCount = optimisticLiked ? count + 1 : count - 1;
    
    setLiked(optimisticLiked);
    setCount(optimisticCount);

    try {
      const url = postId 
        ? `/api/posts/${postId}/like`
        : `/api/comments/${commentId}/like`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to toggle like");
      }

      setLiked(data.liked);
      setCount(data.count);
      
      if (onLikeChange) {
        onLikeChange(data.liked, data.count);
      }
    } catch (error) {
      // Revert optimistic update
      setLiked(!optimisticLiked);
      setCount(count);
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className="gap-2"
    >
      <Heart
        className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
      />
      <span>{count}</span>
    </Button>
  );
}

