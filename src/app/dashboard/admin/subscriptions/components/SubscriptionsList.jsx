import { CreditCard } from "lucide-react";
import SubscriptionItem from "./SubscriptionItem";

export default function SubscriptionsList({ 
  filteredSubscriptions, 
  searchTerm, 
  statusFilter,
  handleStatusUpdate,
  handleExtendSubscription,
  actionLoading 
}) {
  return (
    <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="bg-black text-white p-3 border-b border-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <h2 className="text-sm font-black uppercase tracking-wider">
              Subscriptions
            </h2>
          </div>
          <div className="bg-white text-black px-2 py-1 text-xs font-black">
            {filteredSubscriptions.length}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {filteredSubscriptions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-8 h-8 text-black/30" />
            </div>
            <h3 className="text-lg font-black text-black uppercase tracking-wider mb-2">
              No Subscriptions Found
            </h3>
            <p className="text-xs font-bold text-black/70 uppercase tracking-wide">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting search or filters" 
                : "No subscription requests yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubscriptions.map((subscription, index) => (
              <SubscriptionItem
                key={subscription.id}
                subscription={subscription}
                index={index}
                handleStatusUpdate={handleStatusUpdate}
                handleExtendSubscription={handleExtendSubscription}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
