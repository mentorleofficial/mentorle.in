"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Newspaper, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Activity,
  Settings
} from "lucide-react";

export default function NewsAutomation() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const { toast } = useToast();

  const handleManualFetch = async () => {
    try {
      setIsLoading(true);
      
      toast({
        title: "Starting News Fetch",
        description: "Fetching latest news for all domains...",
      });

      const response = await fetch('/api/fetch-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setLastResult(result);
        toast({
          title: "News Fetch Completed",
          description: result.message,
        });
      } else {
        throw new Error(result.error || 'Unknown error');
      }

    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "News Fetch Failed",
        description: error.message || "Failed to fetch news. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-10 bg-white">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="bg-white border border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black uppercase tracking-wider">News Automation</h2>
                <p className="text-sm font-bold text-black/70 uppercase tracking-wide">Manage automated news fetching for all domains</p>
              </div>
            </div>
            <Button
              onClick={handleManualFetch}
              disabled={isLoading}
              className="
                border border-black rounded-none font-black uppercase tracking-wider text-xs px-4 py-2 h-auto mt-3 md:mt-0
                bg-black text-white hover:bg-white hover:text-black
                transition-all duration-200 flex items-center gap-2
                shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]
              "
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Newspaper className="h-3 w-3" />
                  Fetch News Now
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-black uppercase tracking-wider">API Status</span>
              <Activity className="h-3 w-3 text-black" />
            </div>
            <div className="text-xl font-black text-black uppercase tracking-wider">Active</div>
            <div className="text-xs font-bold text-black/70 uppercase tracking-wide">
              Using News API for automation
            </div>
          </div>

          <div className="bg-white border border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-black uppercase tracking-wider">Last Update</span>
              <Clock className="h-3 w-3 text-black" />
            </div>
            <div className="text-xl font-black text-black uppercase tracking-wider">
              {lastResult ? 'Recently' : 'Not yet'}
            </div>
            <div className="text-xs font-bold text-black/70 uppercase tracking-wide">
              {lastResult ? `${lastResult.results?.successfulUpdates} domains updated` : 'No updates performed'}
            </div>
          </div>

          <div className="bg-white border border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-black uppercase tracking-wider">Automation</span>
              <Settings className="h-3 w-3 text-black" />
            </div>
            <div className="text-xl font-black text-black uppercase tracking-wider">Ready</div>
            <div className="text-xs font-bold text-black/70 uppercase tracking-wide">
              Set up cron job to run daily
            </div>
          </div>
        </div>

        {/* Last Result */}
        {lastResult && (
          <div className="bg-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="border-b border-black p-3 bg-black/5">
              <h3 className="text-sm font-black text-black uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-3 w-3" />
                Last Fetch Results
              </h3>
            </div>
            <div className="p-3 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2 bg-black/5 border border-black/20">
                  <div className="text-xs font-black text-black uppercase tracking-wider mb-1">Total Domains</div>
                  <div className="text-lg font-black text-black">{lastResult.results?.totalDomains}</div>
                </div>
                <div className="p-2 bg-black/5 border border-black/20">
                  <div className="text-xs font-black text-black uppercase tracking-wider mb-1">Successful</div>
                  <div className="text-lg font-black text-black">{lastResult.results?.successfulUpdates}</div>
                </div>
                <div className="p-2 bg-black/5 border border-black/20">
                  <div className="text-xs font-black text-black uppercase tracking-wider mb-1">Failed</div>
                  <div className="text-lg font-black text-black">{lastResult.results?.failedUpdates}</div>
                </div>
              </div>
              
              {/* Domain Details */}
              {lastResult.results?.domains && lastResult.results.domains.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-black uppercase tracking-wider mb-2">Domain Details:</h4>
                  <div className="space-y-2">
                    {lastResult.results.domains.map((domain, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-black/5 border border-black/20">
                        <span className="text-sm font-bold text-black uppercase tracking-wide">{domain.domain}</span>
                        <div className="flex items-center gap-2">
                          {domain.updated ? (
                            <>
                              <CheckCircle className="h-3 w-3 text-black" />
                              <span className="text-xs font-bold text-black/70 uppercase tracking-wide">
                                {domain.newsCount} articles
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 text-black" />
                              <span className="text-xs font-bold text-black/70 uppercase tracking-wide">Failed</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* API Information */}
        <div className="bg-white border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b border-black p-3 bg-black/5">
            <h3 className="text-sm font-black text-black uppercase tracking-wider">API Endpoint Information</h3>
          </div>
          <div className="p-3 space-y-3">
            <div className="bg-black/5 border border-black/20 p-3">
              <div className="text-xs font-black text-black uppercase tracking-wider mb-2">Manual Trigger:</div>
              <div className="bg-black text-white p-2 text-xs font-bold uppercase tracking-wider mb-2">
                POST /api/fetch-news
              </div>
              <div className="text-xs font-bold text-black/70 uppercase tracking-wide">
                This endpoint can be called manually or set up with a cron service like Vercel Cron, GitHub Actions, or external cron services.
              </div>
            </div>

            <div className="bg-black/5 border border-black/20 p-3">
              <div className="text-xs font-black text-black uppercase tracking-wider mb-2">How It Works:</div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-black rounded-full mt-1.5"></div>
                  <span className="text-xs font-bold text-black/70 uppercase tracking-wide">
                    Fetches news only for domains that exist in your Resources table
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-black rounded-full mt-1.5"></div>
                  <span className="text-xs font-bold text-black/70 uppercase tracking-wide">
                    Uses intelligent search terms for better news relevance
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-black rounded-full mt-1.5"></div>
                  <span className="text-xs font-bold text-black/70 uppercase tracking-wide">
                    Updates existing domain resources without creating new ones
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-black rounded-full mt-1.5"></div>
                  <span className="text-xs font-bold text-black/70 uppercase tracking-wide">
                    Filters out low-quality articles and adds fresh content
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-black/5 border border-black/20 p-3">
              <div className="text-xs font-black text-black uppercase tracking-wider mb-2">Note:</div>
              <div className="text-xs font-bold text-black/70 uppercase tracking-wide">
                To add news for new domains, first create the domain in the Resources section, then run news fetch.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
