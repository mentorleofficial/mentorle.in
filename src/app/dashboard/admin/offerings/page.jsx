"use client";

import { useEffect, useMemo, useState } from "react";
import RoleProtected from "@/components/RoleProtected";
import { ROLES } from "@/lib/roles";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Pause, Play, EyeOff, Filter, RefreshCw
} from "lucide-react";

function AdminOfferingsContent() {
  const { toast } = useToast();
  const [offerings, setOfferings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOfferings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOfferings = async () => {
    try {
      setIsLoading(true);
      const { supabase } = await import("@/lib/supabase");
      const { data: { session } } = await supabase.auth.getSession();

      const headers = {
        "Content-Type": "application/json",
      };

      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const params = new URLSearchParams({
        status: "all",
        admin: "true",
      });

      const response = await fetch(`/api/offerings?${params.toString()}`, { headers });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load offerings");
      }

      setOfferings(result.data || []);
    } catch (error) {
      console.error("Error fetching offerings:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load offerings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOffering = async (id, updates, successMessage) => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(`/api/offerings/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update offering");
      }

      toast({
        title: "Updated",
        description: successMessage,
      });

      // Refresh list locally
      setOfferings((prev) =>
        prev.map((offering) =>
          offering.id === id ? { ...offering, ...updates } : offering
        )
      );
    } catch (error) {
      console.error("Error updating offering:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update offering",
        variant: "destructive",
      });
    }
  };

  const handleStatusToggle = (offering) => {
    const newStatus =
      offering.status === "active" ? "paused" : "active";
    handleUpdateOffering(
      offering.id,
      { status: newStatus },
      `Offering ${newStatus === "active" ? "activated" : "deactivated"}`
    );
  };

  const handleHideOffering = (offering) => {
    if (!confirm("Hide this offering from all mentee listings?")) return;
    handleUpdateOffering(
      offering.id,
      { status: "archived" },
      "Offering archived and hidden from listings"
    );
  };

  const handleCategoryChange = (offeringId, newCategory) => {
    handleUpdateOffering(
      offeringId,
      { category: newCategory },
      "Category updated"
    );
  };

  const categories = useMemo(() => {
    const set = new Set();
    offerings.forEach((o) => {
      if (o.category) set.add(o.category);
    });
    return Array.from(set);
  }, [offerings]);

  const filteredOfferings = useMemo(() => {
    return offerings.filter((offering) => {
      if (statusFilter !== "all" && offering.status !== statusFilter) {
        return false;
      }
      if (categoryFilter !== "all" && offering.category !== categoryFilter) {
        return false;
      }
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const titleMatch = offering.title?.toLowerCase().includes(term);
        const mentorName = offering.mentor?.name || "";
        const mentorMatch = mentorName.toLowerCase().includes(term);
        return titleMatch || mentorMatch;
      }
      return true;
    });
  }, [offerings, statusFilter, categoryFilter, searchTerm]);

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-800",
      paused: "bg-yellow-100 text-yellow-800",
      archived: "bg-red-100 text-red-800",
    };
    return styles[status] || styles.draft;
  };

  const formatPrice = (offering) => {
    if (!offering) return "-";
    if (!offering.price || Number(offering.price) === 0) return "Free";
    const amount = Number(offering.price).toFixed(2);
    return `${offering.currency || "INR"} ${amount}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mentorship Listings
            </h1>
            <p className="text-gray-600 mt-1">
              View and moderate all mentorship offerings and their performance
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOfferings}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6 p-4">
          <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Search (title or mentor)
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search offerings..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="all">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {filteredOfferings.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {offerings.length}
                </span>{" "}
                offerings
              </div>
            </div>
          </div>
        </Card>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-500">
                Loading mentorship offerings...
              </p>
            </div>
          ) : filteredOfferings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No offerings found for the current filters.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Mentor
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Bookings
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOfferings.map((offering) => (
                  <tr key={offering.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 line-clamp-2">
                        {offering.title}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">
                        {offering.mentor?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={offering.category || ""}
                        onChange={(e) =>
                          handleCategoryChange(offering.id, e.target.value)
                        }
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white"
                      >
                        <option value="">Uncategorized</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {offering.duration_minutes} min
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatPrice(offering)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusBadge(offering.status)}>
                        {offering.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {offering.total_bookings || 0}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleStatusToggle(offering)}
                      >
                        {offering.status === "active" ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleHideOffering(offering)}
                      >
                        <EyeOff className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminOfferingsPage() {
  return (
    <RoleProtected requiredRole={ROLES.ADMIN}>
      <AdminOfferingsContent />
    </RoleProtected>
  );
}


