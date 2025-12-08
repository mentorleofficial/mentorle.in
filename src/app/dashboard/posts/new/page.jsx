"use client";

import { useRouter } from "next/navigation";
import { useUserRole } from "@/lib/userRole";
import { ROLES } from "@/lib/roles";
import { useEffect } from "react";
import PostEditor from "@/components/blogs/PostEditor";

export default function NewPostPage() {
  const router = useRouter();
  const { role, isLoading } = useUserRole();

  useEffect(() => {
    if (!isLoading) {
      if (role !== ROLES.ADMIN && role !== ROLES.MENTOR) {
        router.push("/dashboard");
      }
    }
  }, [role, isLoading, router]);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (role !== ROLES.ADMIN && role !== ROLES.MENTOR) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <PostEditor />
    </div>
  );
}

