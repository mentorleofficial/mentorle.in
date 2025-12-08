"use client";
import { CheckCircle, Lock, Clock } from "lucide-react";

export default function SubscriptionCard({
  availableDomains,
  subscriptions,
  selectedDomain,
  onDomainClick,
  isSubscribed,
  getSubscriptionExpiry,
  isProcessing = false
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Choose Your Domain</h2>
        <span className="text-xs text-gray-500">
          {subscriptions.length} of {availableDomains.length} subscribed
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {availableDomains
          .sort((a, b) => {
            const aSubscribed = isSubscribed(a.id);
            const bSubscribed = isSubscribed(b.id);
            if (aSubscribed && !bSubscribed) return -1;
            if (!aSubscribed && bSubscribed) return 1;
            return a.name.localeCompare(b.name);
          })
          .map((domain) => {
            const subscribed = isSubscribed(domain.id);
            const expiry = getSubscriptionExpiry(domain.id);
            const isSelected = selectedDomain === domain.id;

            return (
              <div
                key={domain.id}
                onClick={() => !isProcessing && onDomainClick(domain)}
                className={`flex-shrink-0 w-40 p-3 cursor-pointer rounded-lg border-2 transition-colors duration-200
                  ${isSelected ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'}
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold">{domain.name}</h3>
                  {subscribed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border border-gray-400 border-t-transparent" />
                  ) : (
                    <Lock className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                <div className="text-xs">
                  {subscribed ? (
                    <div className="flex items-center gap-1 text-gray-300">
                      <Clock className="h-3 w-3" />
                      <span>Expires {expiry.toLocaleDateString()}</span>
                    </div>
                  ) : isProcessing ? (
                    <span className="text-gray-500">Processing...</span>
                  ) : (
                    <span className="text-gray-500">₹99/month</span>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
