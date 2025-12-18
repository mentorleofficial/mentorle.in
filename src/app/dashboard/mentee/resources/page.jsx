"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Newspaper, 
  Lock, 
  ExternalLink, 
  Download,
  Star,
  Calendar,
  Tag,
  Filter,
  Search,
  CreditCard,
  Users,
  TrendingUp,
  FileText,
  Link as LinkIcon,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResourceCard from "./components/ResourceCard";
import NewsCard from "./components/NewsCard";
import SubscriptionCard from "./components/SubscriptionCard";
import SubscriptionDialog from "./components/SubscriptionDialog";
import PaymentDialog from "./components/PaymentDialog";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [news, setNews] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [selectedDomainForSubscription, setSelectedDomainForSubscription] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [availableDomains, setAvailableDomains] = useState([]);
  const [subscriptionProcessing, setSubscriptionProcessing] = useState(false);
  const { toast } = useToast();

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: userTimezone
    });
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchAvailableDomains();
    fetchUserSubscriptions();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      fetchDomainContent();
    }
  }, [selectedDomain, currentUser]);

  // Cleanup function to reset processing state when component unmounts
  useEffect(() => {
    return () => {
      setSubscriptionProcessing(false);
    };
  }, []);

  const fetchAvailableDomains = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("domain, display_name")
        .order("domain");

      if (error) throw error;

      // Get unique domains with their admin-defined display names
      const uniqueDomainsMap = new Map();
      
      (data || []).forEach(item => {
        if (!uniqueDomainsMap.has(item.domain)) {
          uniqueDomainsMap.set(item.domain, {
            id: item.domain,
            name: item.display_name || item.domain.charAt(0).toUpperCase() + item.domain.slice(1).replace(/_/g, ' ')
          });
        }
      });

      const domainsArray = Array.from(uniqueDomainsMap.values());
      setAvailableDomains(domainsArray);
    } catch (error) {
      console.error("Error fetching available domains:", error);
      
      // Fail silently for missing permissions or table, so mentee UX isn't broken
      const message = (error.message || "").toLowerCase();
      const isPermissionIssue = message.includes("permission denied");
      const isMissingTable = message.includes("does not exist") || message.includes("relation") && message.includes("resources");

      if (!isPermissionIssue && !isMissingTable) {
        toast({
          title: "Error",
          description: "Failed to load available domains",
          variant: "destructive"
        });
      }
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: menteeData } = await supabase
          .from("mentee_data")
          .select("*")
          .eq("email", user.email)
          .single();
        
        setCurrentUser(menteeData);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscriptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_email", user.email)
        .eq("status", "active")
        .gte("expires_at", new Date().toISOString());

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load your subscriptions",
        variant: "destructive"
      });
    }
  };

  const fetchDomainContent = async () => {
    if (!selectedDomain) return;

    try {
      setLoadingContent(true);
      
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("domain", selectedDomain)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No data found for this domain
          setResources([]);
          setNews([]);
          return;
        }
        throw error;
      }

      // Transform materials
      const transformedResources = [];
      if (data?.materials && Array.isArray(data.materials)) {
        data.materials.forEach((material, index) => {
          if (material.description && material.url) {
            transformedResources.push({
              id: `${data.id}-material-${index}`,
              title: material.description,
              description: material.description,
              url: material.url,
              domain: selectedDomain,
              type: 'material',
              created_at: material.created_at || data.created_at // Use material's created_at if available
            });
          }
        });
      }

      // Transform news - handle JSONB format
      const transformedNews = [];
      if (data?.news) {
        // Since news is now JSONB, it should be directly accessible as an array
        let newsArray = [];
        
        if (Array.isArray(data.news)) {
          newsArray = data.news;
        } else if (typeof data.news === 'object' && data.news !== null) {
          // Handle case where JSONB might come as a single object
          newsArray = [data.news];
        }

        newsArray.forEach((newsItem, index) => {
          if (typeof newsItem === 'string' && newsItem.trim()) {
            // Old format: just URLs (legacy support)
            transformedNews.push({
              id: `${data.id}-news-${index}`,
              title: `${getDomainInfo(selectedDomain)?.name} News`,
              description: `Latest news from ${getDomainInfo(selectedDomain)?.name}`,
              url: newsItem,
              domain: selectedDomain,
              type: 'news',
              created_at: data.created_at
            });
          } else if (typeof newsItem === 'object' && newsItem?.title && newsItem?.url) {
            // New format: full news objects from News API
            transformedNews.push({
              id: newsItem.id || `${data.id}-news-${index}`,
              title: newsItem.title,
              description: newsItem.description || `Latest news from ${getDomainInfo(selectedDomain)?.name}`,
              url: newsItem.url,
              imageUrl: newsItem.imageUrl,
              publishedAt: newsItem.publishedAt,
              source: newsItem.source,
              domain: selectedDomain,
              type: 'news',
              created_at: newsItem.created_at || data.created_at
            });
          }
        });
      }

      setResources(transformedResources);
      setNews(transformedNews);
    } catch (error) {
      console.error("Error fetching domain content:", error);
      toast({
        title: "Error",
        description: "Failed to load content for this domain",
        variant: "destructive"
      });
    } finally {
      setLoadingContent(false);
    }
  };

  const isSubscribed = (domainId) => {
    return subscriptions.some(sub => sub.domain === domainId);
  };

  const getDomainInfo = (domainId) => {
    return availableDomains.find(domain => domain.id === domainId);
  };

  const handleDomainClick = (domain) => {
    // Prevent multiple clicks while processing
    if (subscriptionProcessing) return;
    
    if (isSubscribed(domain.id)) {
      setSelectedDomain(domain.id);
    } else {
      setSubscriptionProcessing(true);
      setSelectedDomainForSubscription(domain);
      setShowSubscriptionDialog(true);
    }
  };

  const handleProceedToPayment = (subscriptionData) => {
    setPaymentData(subscriptionData);
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = async () => {
    if (!paymentData) return;
    
    try {
      // Update subscription status to active
      const { error } = await supabase
        .from("user_subscriptions")
        .update({
          status: 'active',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentData.subscriptionId);

      if (error) throw error;

      toast({
        title: "Subscription Activated!",
        description: "Your subscription is now active. Enjoy access to premium resources!",
        duration: 5000
      });

      // Refresh subscriptions and select the domain
      await fetchUserSubscriptions();
      setSelectedDomain(paymentData.channel.id);
      
      // Clear payment data
      setPaymentData(null);
      setSubscriptionProcessing(false);
      
    } catch (error) {
      console.error("Error activating subscription:", error);
      setSubscriptionProcessing(false);
      toast({
        title: "Error",
        description: "Payment successful but failed to activate subscription. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const getSubscriptionExpiry = (domainId) => {
    const subscription = subscriptions.find(sub => sub.domain === domainId);
    return subscription ? new Date(subscription.expires_at) : null;
  };

  const filteredResources = resources
    .filter(resource => {
      const matchesSearch = !searchTerm || 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort by created_at in descending order (newest first)
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });

  const filteredNews = news
    .filter(item => {
      const matchesSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      // Sort by publishedAt or created_at in descending order (newest first)
      const dateA = new Date(a.publishedAt || a.created_at || 0);
      const dateB = new Date(b.publishedAt || b.created_at || 0);
      return dateB - dateA;
    });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto mt-10 p-3">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Learning Resources
          </h1>
          <p className="text-gray-600 text-lg">
            Discover curated study materials and trending news across tech domains
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent" />
            <span className="ml-2 text-gray-600">Loading your resources...</span>
          </div>
        ) : (
          <>
            {/* Horizontal Scrollable Domain Bar */}
            <SubscriptionCard
              availableDomains={availableDomains}
              subscriptions={subscriptions}
              selectedDomain={selectedDomain}
              onDomainClick={handleDomainClick}
              isSubscribed={isSubscribed}
              getSubscriptionExpiry={getSubscriptionExpiry}
              isProcessing={subscriptionProcessing}
            />

            {/* Selected Domain Content */}
            {selectedDomain && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                      <span className="text-lg font-bold">
                        {getDomainInfo(selectedDomain)?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-black">
                        {getDomainInfo(selectedDomain)?.name} Resources
                      </h2>
                      <p className="text-gray-600">
                        Explore {getDomainInfo(selectedDomain)?.name?.toLowerCase()} resources and stay updated
                      </p>
                    </div>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Content Loading */}
                {loadingContent ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent" />
                    <span className="ml-2 text-gray-600">Loading content...</span>
                  </div>
                ) : (
                  /* Mobile: Tabs Layout, Desktop: Two Column Layout */
                  <>
                    {/* Mobile Tabs (visible only on small screens) */}
                    <div className="block md:hidden">
                      <Tabs defaultValue="materials" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                          <TabsTrigger value="materials" className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Resources({filteredResources.length})
                          </TabsTrigger>
                          <TabsTrigger value="news" className="flex items-center gap-2">
                            <Newspaper className="h-4 w-4" />
                            News ({filteredNews.length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="materials">
                          {filteredResources.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                              {filteredResources.map((resource) => (
                                <ResourceCard key={resource.id} resource={resource} />
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-16">
                              <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                              <h3 className="text-lg font-semibold text-black mb-2">
                                No Study Materials Found
                              </h3>
                              <p className="text-gray-500">
                                {searchTerm ? "Try adjusting your search terms" : "No materials available for this domain yet"}
                              </p>
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="news">
                          {filteredNews.length > 0 ? (
                            <div className="space-y-4">
                              {filteredNews.map((newsItem) => (
                                <NewsCard key={newsItem.id} news={newsItem} />
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-16">
                              <Newspaper className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                              <h3 className="text-lg font-semibold text-black mb-2">
                                No News Found
                              </h3>
                              <p className="text-gray-500">
                                {searchTerm ? "Try adjusting your search terms" : "No news available for this domain yet"}
                              </p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Modern Desktop Layout */}
                    <div className="hidden md:block">
                      {/* Stats Bar */}
                      <div className="grid grid-cols-12 gap-2 mb-2">
                        <div className="col-span-5 bg-black rounded-2xl p-6 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-2xl font-bold">{filteredResources.length}</h3>
                              <p className="text-gray-300">Study Resources</p>
                            </div>
                            <BookOpen className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                        <div className="col-span-7 bg-gray-900 rounded-2xl p-6 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-2xl font-bold">{filteredNews.length}</h3>
                              <p className="text-gray-300 flex items-center gap-1">
                                Latest News
                              </p>
                            </div>
                            <Newspaper className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Main Content Grid */}
                      <div className="grid grid-cols-12 gap-2" style={{ height: 'calc(100vh - 300px)' }}>
                        
                        {/* Study Materials Section - Left 5 columns */}
                        <div className="col-span-5 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                          {/* Header */}
                          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                                  <BookOpen className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-black">Study Materials</h3>
                                  <p className="text-xs text-gray-600">{filteredResources.length} resources</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-600">Live</span>
                              </div>
                            </div>
                          </div>

                          {/* Scrollable Content */}
                          <div className="h-full overflow-y-auto p-6 space-y-4 independent-scroll">
                            {filteredResources.length > 0 ? (
                              <>
                                {filteredResources.map((resource, index) => (
                                  <div 
                                    key={resource.id}
                                    className="group bg-gray-50 hover:bg-white border border-gray-200 hover:border-black rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg"
                                    onClick={() => window.open(resource.url, '_blank')}
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {index + 1}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-black mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                                          {resource.title}
                                        </h4>
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                          <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(resource.created_at)}
                                          </span>
                                          <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-black" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                <div className="h-4"></div> {/* Bottom padding */}
                              </>
                            ) : (
                              <div className="text-center py-16">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                  <BookOpen className="h-8 w-8 text-gray-400" />
                                </div>
                                <h4 className="font-medium text-gray-700 mb-2">No Materials Found</h4>
                                <p className="text-sm text-gray-500">
                                  {searchTerm ? "Try different search terms" : "No study materials available yet"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* News Feed Section - Right 7 columns */}
                        <div className="col-span-7 bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                          {/* Header */}
                          <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center relative">
                                  <Newspaper className="h-5 w-5 text-white" />
                                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-black rounded-full animate-ping"></div>
                                </div>
                                <div>
                                  <h3 className="font-bold text-black flex items-center gap-2">
                                    Breaking News
                                    <span className="px-2 py-1 bg-black text-white text-xs rounded-full animate-pulse">
                                      LIVE
                                    </span>
                                  </h3>
                                  <p className="text-xs text-gray-600">{filteredNews.length} articles • Updated continuously</p>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(new Date().toISOString())}
                              </div>
                            </div>
                          </div>

                          {/* Scrollable News Feed */}
                          <div className="h-full overflow-y-auto independent-scroll">
                            {filteredNews.length > 0 ? (
                              <div className="p-6 space-y-6">
                                {/* Hero Article */}
                                {filteredNews[0] && (
                                  <div 
                                    className="relative bg-black rounded-2xl overflow-hidden cursor-pointer group"
                                    onClick={() => window.open(filteredNews[0].url, '_blank')}
                                  >
                                    {filteredNews[0].imageUrl && (
                                      <div className="relative h-48 overflow-hidden">
                                        <img
                                          src={filteredNews[0].imageUrl}
                                          alt={filteredNews[0].title}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/50"></div>
                                      </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                      <div className="flex items-center gap-2 mb-3">
                                        <span className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full">
                                          BREAKING
                                        </span>
                                        <span className="text-xs text-gray-300">
                                          {formatDate(filteredNews[0].publishedAt || filteredNews[0].created_at)}
                                        </span>
                                      </div>
                                      <h2 className="text-xl font-bold mb-2 group-hover:text-gray-300 transition-colors">
                                        {filteredNews[0].title}
                                      </h2>
                                      {filteredNews[0].description && (
                                        <p className="text-gray-300 text-sm line-clamp-2">
                                          {filteredNews[0].description}
                                        </p>
                                      )}
                                      <div className="flex items-center justify-between mt-4">
                                        <span className="text-xs font-medium text-gray-400">
                                          {filteredNews[0].source}
                                        </span>
                                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* News Feed */}
                                <div className="space-y-4">
                                  {filteredNews.slice(1).map((newsItem, index) => (
                                    <div 
                                      key={newsItem.id}
                                      className={`group bg-gray-50 hover:bg-white border border-gray-200 hover:border-black rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                        index % 3 === 0 ? 'ml-8' : index % 3 === 1 ? 'mr-8' : ''
                                      }`}
                                      onClick={() => window.open(newsItem.url, '_blank')}
                                    >
                                      <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                          {newsItem.imageUrl ? (
                                            <img
                                              src={newsItem.imageUrl}
                                              alt={newsItem.title}
                                              className="w-20 h-16 object-cover rounded-xl"
                                            />
                                          ) : (
                                            <div className="w-20 h-16 bg-black rounded-xl flex items-center justify-center">
                                              <Newspaper className="h-6 w-6 text-white" />
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs text-gray-500">
                                              {formatDate(newsItem.publishedAt || newsItem.created_at)}
                                            </span>
                                            {index < 3 && (
                                              <span className="px-2 py-1 bg-gray-200 text-black text-xs font-medium rounded-full">
                                                Trending
                                              </span>
                                            )}
                                          </div>
                                          <h4 className="font-semibold text-black mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
                                            {newsItem.title}
                                          </h4>
                                          <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-600 truncate">
                                              {newsItem.source}
                                            </span>
                                            <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-black flex-shrink-0" />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="h-4"></div> {/* Bottom padding */}
                              </div>
                            ) : (
                              <div className="text-center py-16">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                  <Newspaper className="h-8 w-8 text-gray-400" />
                                </div>
                                <h4 className="font-medium text-gray-700 mb-2">No News Available</h4>
                                <p className="text-sm text-gray-500">
                                  {searchTerm ? "Try different search terms" : "No news articles available yet"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Welcome Message when no domain is selected */}
            {!selectedDomain && (
              <div className="text-center py-16">
                <div className="mb-6">
                  <Sparkles className="h-20 w-20 mx-auto mb-4 text-black" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome to Learning Resources
                  </h3>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Select a domain above to access curated study materials and trending news. 
                    Subscribe to unlock premium content and stay ahead in your learning journey.
                  </p>
                </div>
                
                {subscriptions.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">
                      Your Active Subscriptions
                    </h4>
                    <div className="flex flex-wrap justify-center gap-3">
                      {subscriptions.map((subscription) => {
                        const domainInfo = getDomainInfo(subscription.domain);
                        return (
                          <div
                            key={subscription.id}
                            className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium"
                          >
                            {domainInfo?.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Subscription Dialog */}
        <SubscriptionDialog
          isOpen={showSubscriptionDialog}
          onClose={() => {
            setShowSubscriptionDialog(false);
            setSubscriptionProcessing(false);
          }}
          channel={selectedDomainForSubscription}
          userEmail={currentUser?.email}
          userId={currentUser?.user_id}
          onSubscriptionSuccess={() => {
            fetchUserSubscriptions();
            setShowSubscriptionDialog(false);
            setSubscriptionProcessing(false);
          }}
          onProceedToPayment={handleProceedToPayment}
        />

        {/* Payment Dialog */}
        <PaymentDialog
          isOpen={showPaymentDialog}
          onClose={() => {
            setShowPaymentDialog(false);
            setSubscriptionProcessing(false);
          }}
          onPaymentSuccess={handlePaymentSuccess}
          subscriptionData={paymentData}
        />
      </div>
    </div>
  );
}