"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import LikeButton from "./LikeButton";
import { format } from "date-fns";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    fetchCurrentUser();
  }, [postId]);

  const fetchCurrentUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setCurrentUser(session?.user || null);
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      
      const { data } = await response.json();
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to post comment");
      }

      setNewComment("");
      fetchComments();
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmitReply = async (parentId) => {
    if (!replyContent.trim() || !currentUser) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: replyContent,
          parent_id: parentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to post reply");
      }

      setReplyContent("");
      setReplyingTo(null);
      fetchComments();
      toast({
        title: "Success",
        description: "Reply posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const CommentItem = ({ comment, depth = 0 }) => {
    const isOwnComment = currentUser && comment.user_id === currentUser.id;
    const commentDate = format(new Date(comment.created_at), "MMM d, yyyy 'at' h:mm a");

    return (
      <div className={depth > 0 ? "ml-8 mt-4 border-l-2 border-purple-100 pl-4" : ""}>
        <Card className="border border-slate-200 rounded-2xl hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white text-sm font-medium">
                  {(comment.user?.email?.[0] || "A").toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-sm text-slate-800">
                    {comment.user?.email?.split("@")[0] || "Anonymous"}
                  </span>
                  <span className="text-xs text-slate-500 ml-2">{commentDate}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700 mb-4 leading-relaxed">{comment.content}</p>
            <div className="flex items-center gap-3">
              <LikeButton
                commentId={comment.id}
                initialCount={0} // You may want to fetch actual like count
                initialLiked={false} // You may want to fetch actual liked status
              />
              {currentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="gap-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                >
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </Button>
              )}
            </div>
            {replyingTo === comment.id && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl space-y-3">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                  className="border-slate-200 rounded-xl focus:ring-purple-500"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim()}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Reply
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                    className="hover:bg-slate-200 rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 text-slate-600">
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">Comments ({comments.length})</h3>
      </div>

      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="space-y-3 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Textarea
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="border-slate-200 rounded-xl focus:ring-purple-500 resize-none"
          />
          <Button 
            type="submit" 
            disabled={!newComment.trim()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl px-6 shadow-md disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-2" />
            Post Comment
          </Button>
        </form>
      ) : (
        <Card className="border border-slate-200 rounded-2xl">
          <CardContent className="py-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">Please log in to post a comment</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <Card className="border border-slate-200 rounded-2xl">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-slate-600 font-medium">No comments yet</p>
              <p className="text-slate-500 text-sm mt-1">Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}

