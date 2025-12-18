"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, Search, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/lib/userRole";
import { ROLES } from "@/lib/roles";
import { format } from "date-fns";

export default function PostsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { role, isLoading: roleLoading } = useUserRole();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!roleLoading) {
      if (role !== ROLES.ADMIN && role !== ROLES.MENTOR) {
        router.push("/dashboard");
        return;
      }
      fetchPosts();
    }
  }, [role, roleLoading]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Get access token
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      const params = new URLSearchParams({
        status: statusFilter,
        page: "1",
        limit: "50",
      });

      const headers = {
        "Content-Type": "application/json",
      };
      
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`/api/posts?${params}`, { headers });
      if (!response.ok) throw new Error("Failed to fetch posts");

      const { data } = await response.json();
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      // Get access token
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers = {
        "Content-Type": "application/json",
      };
      
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete post");
      }

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      fetchPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (roleLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (role !== ROLES.ADMIN && role !== ROLES.MENTOR) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Posts Management</h1>
          <p className="text-gray-600">Manage your blog posts and articles</p>
        </div>
        <Button onClick={() => router.push("/dashboard/posts/new")}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setTimeout(fetchPosts, 100);
          }}
          className="rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
          <option value="pending">Pending</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-gray-500">Loading posts...</div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No posts found</p>
            <Button onClick={() => router.push("/dashboard/posts/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Post
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Cover Image */}
              {post.cover_url ? (
                <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={post.cover_url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Status Badge Overlay */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge
                      variant={
                        post.status === "published"
                          ? "default"
                          : post.status === "scheduled"
                          ? "default"
                          : post.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        post.status === "scheduled" 
                          ? "bg-blue-600 text-white" 
                          : post.status === "published"
                          ? "bg-green-600 text-white"
                          : ""
                      }
                    >
                      {post.status}
                    </Badge>
                    {post.featured && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                  <div className="text-white text-4xl font-bold opacity-20">
                    {post.title.charAt(0).toUpperCase()}
                  </div>
                  {/* Status Badge Overlay */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge
                      variant={
                        post.status === "published"
                          ? "default"
                          : post.status === "scheduled"
                          ? "default"
                          : post.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        post.status === "scheduled" 
                          ? "bg-blue-600 text-white" 
                          : post.status === "published"
                          ? "bg-green-600 text-white"
                          : ""
                      }
                    >
                      {post.status}
                    </Badge>
                    {post.featured && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <CardHeader className="flex-1">
                <CardTitle className="mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </CardTitle>
                
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                  {post.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {post.status === "scheduled" && post.published_at
                          ? format(new Date(post.published_at), "MMM d, h:mm a")
                          : format(new Date(post.published_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  {post.reading_time_minutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.reading_time_minutes} min</span>
                    </div>
                  )}
                  {post.view_count > 0 && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.view_count}</span>
                    </div>
                  )}
                </div>

                {/* Summary */}
                {post.summary && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {post.summary}
                  </p>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-gray-100 text-gray-700"
                      >
                        <Tag className="w-2.5 h-2.5 mr-1" />
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
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {post.status === "published" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/blogs/${post.slug}`)}
                      className="flex-1 min-w-[100px]"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/posts/${post.id}/edit`)}
                    className="flex-1 min-w-[100px]"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

