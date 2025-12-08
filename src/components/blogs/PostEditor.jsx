"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { createSlug } from "@/lib/slugify";
import RichTextEditor from "./RichTextEditor";
import ImageUpload from "./ImageUpload";
import TagsInput from "./TagsInput";

export default function PostEditor({ post = null, onSave }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    summary: post?.summary || "",
    content: post?.content || "",
    tags: post?.tags || [],
    status: post?.status || "draft",
    featured: post?.featured || false,
    cover_url: post?.cover_url || "",
  });

  useEffect(() => {
    if (formData.title && !post) {
      const autoSlug = createSlug(formData.title);
      setFormData((prev) => ({ ...prev, slug: autoSlug }));
    }
  }, [formData.title, post]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        summary: formData.summary || null,
        content: formData.content,
        tags: formData.tags.length > 0 ? formData.tags : null,
        status: formData.status,
        featured: formData.featured,
        cover_url: formData.cover_url || null,
      };

      const url = post ? `/api/posts/${post.id}` : "/api/posts";
      const method = post ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in request
        body: JSON.stringify(payload),
      });

      // Check if response has content before parsing
      const contentType = response.headers.get("content-type");
      let data = {};
      
      if (contentType && contentType.includes("application/json")) {
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : {};
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          data = { error: "Failed to parse server response" };
        }
      } else {
        const text = await response.text();
        data = { error: text || "Server error occurred" };
      }

      if (!response.ok) {
        const errorMessage = data.error || data.details || `Failed to save post (Status: ${response.status})`;
        console.error('Post save error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          data: data,
          userRole: data.userRole,
          requiredRoles: data.requiredRoles
        });
        throw new Error(errorMessage);
      }

      toast({
        title: "Success",
        description: post ? "Post updated successfully" : "Post created successfully",
      });

      if (onSave) {
        onSave(data.data);
      } else {
        router.push(`/dashboard/posts`);
      }
    } catch (error) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          placeholder="url-friendly-slug"
        />
        <p className="text-xs text-gray-500">
          Auto-generated from title. You can customize it.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder="Brief summary of the post"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <RichTextEditor
          value={formData.content}
          onChange={(value) => handleChange("content", value)}
          placeholder="Write your post content here (markdown supported)"
        />
      </div>

      <TagsInput
        value={formData.tags}
        onChange={(tags) => handleChange("tags", tags)}
        label="Tags"
      />

      <ImageUpload
        value={formData.cover_url}
        onChange={(url) => handleChange("cover_url", url)}
        label="Cover Image"
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => handleChange("featured", checked)}
          />
          <Label htmlFor="featured">Featured Post</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="pending">Pending</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

