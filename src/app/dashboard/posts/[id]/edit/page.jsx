"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUserRole } from "@/lib/userRole";
import { ROLES } from "@/lib/roles";
import PostEditor from "@/components/blogs/PostEditor";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { role, isLoading } = useUserRole();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (role !== ROLES.ADMIN && role !== ROLES.MENTOR) {
        router.push("/dashboard");
        return;
      }
      fetchPost();
    }
  }, [role, isLoading, params.id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/dashboard/posts");
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

  if (isLoading || loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (role !== ROLES.ADMIN && role !== ROLES.MENTOR) {
    return null;
  }

  if (!post) {
    return <div className="p-8">Post not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostEditor post={post} />
    </div>
  );
}

