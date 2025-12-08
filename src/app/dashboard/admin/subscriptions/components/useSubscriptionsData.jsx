import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function useSubscriptionsData() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    filterSubscriptions();
  }, [subscriptions, searchTerm, statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSubscriptions(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const active = data?.filter(sub => sub.status === 'active')?.length || 0;
      const pending = data?.filter(sub => sub.status === 'pending')?.length || 0;
      const expired = data?.filter(sub => {
        const isExpired = new Date(sub.expires_at) < new Date();
        return sub.status === 'active' && isExpired;
      })?.length || 0;

      setStats({ total, active, pending, expired });

    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load subscriptions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterSubscriptions = () => {
    let filtered = subscriptions;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.user_email?.toLowerCase().includes(term) ||
        sub.domain?.toLowerCase().includes(term) ||
        sub.transaction_id?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "expired") {
        filtered = filtered.filter(sub => {
          const isExpired = new Date(sub.expires_at) < new Date();
          return sub.status === 'active' && isExpired;
        });
      } else {
        filtered = filtered.filter(sub => sub.status === statusFilter);
      }
    }

    setFilteredSubscriptions(filtered);
  };

  const handleStatusUpdate = async (subscriptionId, newStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: true }));

      const updateData = { status: newStatus, updated_at: new Date().toISOString() };
      
      // If activating, set expires_at to 1 month from now (activation date)
      if (newStatus === 'active') {
        const activationDate = new Date();
        const expiryDate = new Date(activationDate);
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        updateData.expires_at = expiryDate.toISOString();
        updateData.updated_at = activationDate.toISOString(); // Track when it was activated
      }

      const { error } = await supabase
        .from("user_subscriptions")
        .update(updateData)
        .eq("id", subscriptionId);

      if (error) throw error;

      // Update local state
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, ...updateData }
            : sub
        )
      );

      toast({
        title: "Success",
        description: `Subscription ${newStatus === 'active' ? 'activated' : newStatus === 'rejected' ? 'rejected' : 'updated'} successfully.`
      });

    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription status.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  const handleExtendSubscription = async (subscriptionId) => {
    try {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: true }));

      const subscription = subscriptions.find(sub => sub.id === subscriptionId);
      const currentExpiry = new Date(subscription.expires_at);
      const newExpiry = new Date(currentExpiry);
      newExpiry.setMonth(newExpiry.getMonth() + 1);

      const { error } = await supabase
        .from("user_subscriptions")
        .update({ 
          expires_at: newExpiry.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", subscriptionId);

      if (error) throw error;

      // Update local state
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, expires_at: newExpiry.toISOString() }
            : sub
        )
      );

      toast({
        title: "Success",
        description: "Subscription extended by 1 month."
      });

    } catch (error) {
      console.error("Error extending subscription:", error);
      toast({
        title: "Error",
        description: "Failed to extend subscription.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(prev => ({ ...prev, [subscriptionId]: false }));
    }
  };

  return {
    subscriptions,
    filteredSubscriptions,
    stats,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    actionLoading,
    handleStatusUpdate,
    handleExtendSubscription
  };
}
