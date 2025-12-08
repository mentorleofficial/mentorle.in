"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  AlertCircle,
  Lightbulb,
  Star,
  Calendar,
  User,
  Filter,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MessageSquare,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Users,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function FeedbackManagementContent() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    in_review: 0,
    resolved: 0,
    byType: {},
    byRole: {},
  });

  const router = useRouter();
  const { toast } = useToast();

  // Fetch all feedback data
  const fetchFeedbacks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setFeedbacks(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast({
        title: "Error",
        description: "Failed to fetch feedback data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      new: data.filter((f) => f.status === "new").length,
      in_review: data.filter((f) => f.status === "in_review").length,
      resolved: data.filter((f) => f.status === "resolved").length,
      byType: {},
      byRole: {},
    };

    // Calculate by type
    data.forEach((feedback) => {
      stats.byType[feedback.type] = (stats.byType[feedback.type] || 0) + 1;
      stats.byRole[feedback.role] = (stats.byRole[feedback.role] || 0) + 1;
    });

    setStats(stats);
  };

  // Filter feedbacks based on search and filters
  useEffect(() => {
    let filtered = [...feedbacks];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (feedback) =>
          feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feedback.user_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((feedback) => feedback.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((feedback) => feedback.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((feedback) => feedback.role === roleFilter);
    }

    setFilteredFeedbacks(filtered);
  }, [feedbacks, searchTerm, typeFilter, statusFilter, roleFilter]);

  // Update feedback status
  const updateFeedbackStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("user_feedback")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setFeedbacks((prev) =>
        prev.map((feedback) =>
          feedback.id === id 
            ? { ...feedback, status: newStatus, updated_at: new Date().toISOString() }
            : feedback
        )
      );

      toast({
        title: "Status Updated",
        description: `Feedback status changed to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update feedback status.",
        variant: "destructive",
      });
    }
  };

  // Delete feedback
  const deleteFeedback = async (id) => {
    if (!confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("user_feedback")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setFeedbacks((prev) => prev.filter((feedback) => feedback.id !== id));

      toast({
        title: "Feedback Deleted",
        description: "The feedback has been permanently deleted.",
      });

      if (selectedFeedback?.id === id) {
        setShowModal(false);
        setSelectedFeedback(null);
      }
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to delete feedback.",
        variant: "destructive",
      });
    }
  };

  // Get icon for feedback type
  const getTypeIcon = (type) => {
    switch (type) {
      case "feedback":
        return MessageCircle;
      case "concern":
        return AlertTriangle;
      case "suggestion":
        return Lightbulb;
      case "review":
        return Star;
      default:
        return MessageSquare;
    }
  };

  // Get color for feedback type
  const getTypeColor = (type) => {
    switch (type) {
      case "feedback":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "concern":
        return "bg-red-100 text-red-800 border-red-200";
      case "suggestion":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "review":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "in_review":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="animate-pulse text-xl">Loading feedback data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
                Feedback Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage user feedback, concerns, suggestions, and reviews
              </p>
            </div>
            <Button
              onClick={fetchFeedbacks}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Eye className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.in_review}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search feedback or user name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="feedback">Feedback</option>
                <option value="concern">Concern</option>
                <option value="suggestion">Suggestion</option>
                <option value="review">Review</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in_review">In Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="mentor">Mentor</option>
                <option value="mentee">Mentee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Feedback List ({filteredFeedbacks.length})
            </h2>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Feedback Found</h3>
              <p className="text-gray-600">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all" || roleFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "No feedback has been submitted yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFeedbacks.map((feedback) => {
                const TypeIcon = getTypeIcon(feedback.type);
                return (
                  <div
                    key={feedback.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <TypeIcon className="h-5 w-5 text-gray-600" />
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(feedback.type)}`}>
                              {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(feedback.status)}`}>
                            {feedback.status === "new" ? "New" :
                             feedback.status === "in_review" ? "In Review" : "Resolved"}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                            {feedback.role.charAt(0).toUpperCase() + feedback.role.slice(1)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-1" />
                            {feedback.user_name}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(feedback.created_at).toLocaleDateString()} at{" "}
                            {new Date(feedback.created_at).toLocaleTimeString()}
                          </div>
                        </div>

                        <p className="text-gray-700 line-clamp-2 mb-3">
                          {feedback.message}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedFeedback(feedback);
                            setShowModal(true);
                          }}
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>

                        {feedback.status === "new" && (
                          <Button
                            size="sm"
                            onClick={() => updateFeedbackStatus(feedback.id, "in_review")}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            Review
                          </Button>
                        )}

                        {feedback.status === "in_review" && (
                          <Button
                            size="sm"
                            onClick={() => updateFeedbackStatus(feedback.id, "resolved")}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Resolve
                          </Button>
                        )}

                        {feedback.status === "resolved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateFeedbackStatus(feedback.id, "in_review")}
                            className="text-orange-600 border-orange-300 hover:bg-orange-50"
                          >
                            Reopen
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteFeedback(feedback.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Feedback Detail Modal */}
        {showModal && selectedFeedback && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Feedback Details</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowModal(false)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Feedback Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(selectedFeedback.type)}`}>
                      {selectedFeedback.type.charAt(0).toUpperCase() + selectedFeedback.type.slice(1)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedFeedback.status)}`}>
                      {selectedFeedback.status === "new" ? "New" :
                       selectedFeedback.status === "in_review" ? "In Review" : "Resolved"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                    <p className="text-gray-900">{selectedFeedback.user_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <p className="text-gray-900 capitalize">{selectedFeedback.role}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                    <p className="text-gray-900">
                      {new Date(selectedFeedback.created_at).toLocaleDateString()} at{" "}
                      {new Date(selectedFeedback.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  {selectedFeedback.updated_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Updated</label>
                      <p className="text-gray-900">
                        {new Date(selectedFeedback.updated_at).toLocaleDateString()} at{" "}
                        {new Date(selectedFeedback.updated_at).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.message}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    {selectedFeedback.status === "new" && (
                      <Button
                        onClick={() => {
                          updateFeedbackStatus(selectedFeedback.id, "in_review");
                          setSelectedFeedback({ ...selectedFeedback, status: "in_review" });
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Mark as In Review
                      </Button>
                    )}

                    {selectedFeedback.status === "in_review" && (
                      <Button
                        onClick={() => {
                          updateFeedbackStatus(selectedFeedback.id, "resolved");
                          setSelectedFeedback({ ...selectedFeedback, status: "resolved" });
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Mark as Resolved
                      </Button>
                    )}

                    {selectedFeedback.status === "resolved" && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          updateFeedbackStatus(selectedFeedback.id, "in_review");
                          setSelectedFeedback({ ...selectedFeedback, status: "in_review" });
                        }}
                        className="text-orange-600 border-orange-300 hover:bg-orange-50"
                      >
                        Reopen
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => {
                      deleteFeedback(selectedFeedback.id);
                    }}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeedbackManagement() {
  return (
    <RoleProtected requiredRole={ROLES.ADMIN}>
      <FeedbackManagementContent />
    </RoleProtected>
  );
}
