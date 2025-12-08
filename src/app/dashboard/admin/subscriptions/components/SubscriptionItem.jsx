import { Check, X, Calendar, Clock, User, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Status badge component
function StatusBadge({ subscription }) {
  const isExpired = new Date(subscription.expires_at) < new Date();
  
  if (subscription.status === 'active' && isExpired) {
    return (
      <div className="bg-black text-white px-2 py-1 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
        <AlertCircle className="w-2 h-2" />
        Expired
      </div>
    );
  }
  
  switch (subscription.status) {
    case 'active':
      return (
        <div className="bg-white border border-black text-black px-2 py-1 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          Active
        </div>
      );
    case 'pending':
      return (
        <div className="bg-black/10 border border-black text-black px-2 py-1 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
          <Clock className="w-2 h-2" />
          Pending
        </div>
      );
    case 'rejected':
      return (
        <div className="bg-black text-white px-2 py-1 text-xs font-black uppercase tracking-wider inline-flex items-center gap-1">
          <X className="w-2 h-2" />
          Rejected
        </div>
      );
    default:
      return (
        <div className="bg-white border border-black text-black px-2 py-1 text-xs font-black uppercase tracking-wider">
          {subscription.status}
        </div>
      );
  }
}

export default function SubscriptionItem({ 
  subscription, 
  index, 
  handleStatusUpdate, 
  handleExtendSubscription, 
  actionLoading 
}) {
  const hasExpiryDate = subscription.expires_at && subscription.expires_at !== null;
  const isExpired = hasExpiryDate && new Date(subscription.expires_at) < new Date();
  const isPending = subscription.status === 'pending';
  const isActive = subscription.status === 'active' && hasExpiryDate && !isExpired;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDomainDisplayName = (domain) => {
    return domain?.charAt(0).toUpperCase() + domain?.slice(1).replace(/_/g, ' ') || 'Unknown';
  };

  return (
    <div className={`
      border border-black bg-white p-3 transition-all duration-200
      hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px]
      ${isPending ? 'shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]' : 'shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'}
    `}>
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPending ? 'bg-black animate-pulse' : 'bg-black/30'}`}></div>
          <span className="text-xs font-black text-black uppercase tracking-wider">
            #{index + 1}
          </span>
          <StatusBadge subscription={subscription} />
        </div>
        <div className="flex items-center gap-1 text-black/60">
          <Clock className="w-3 h-3" />
          <span className="text-xs font-medium">
            {formatDate(subscription.created_at)}
          </span>
        </div>
      </div>

      {/* Compact Info Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 mb-3">
        {/* User & Domain Info */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <User className="w-3 h-3 text-black" />
            <label className="text-xs font-black text-black uppercase tracking-wider">User</label>
          </div>
          <div className="p-2 bg-black/5 border border-black/20">
            <div className="font-bold text-black text-sm mb-1 truncate" title={subscription.user_email}>
              {subscription.user_email}
            </div>
            <div className="text-xs font-bold text-black/70 uppercase tracking-wide">
              {getDomainDisplayName(subscription.domain)}
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <CreditCard className="w-3 h-3 text-black" />
            <label className="text-xs font-black text-black uppercase tracking-wider">Payment</label>
          </div>
          <div className="p-2 bg-black/5 border border-black/20">
            <div className="font-bold text-black text-sm mb-1">
              {subscription.payment_method || 'N/A'}
            </div>
            <div className="text-xs font-bold text-black/70 uppercase tracking-wide truncate" title={subscription.transaction_id}>
              {subscription.transaction_id || 'N/A'}
            </div>
          </div>
        </div>

        {/* Expiry Info */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-black" />
            <label className="text-xs font-black text-black uppercase tracking-wider">Expires</label>
          </div>
          <div className="p-2 bg-black/5 border border-black/20">
            <div className={`font-bold text-sm mb-1 ${isExpired ? 'text-black' : 'text-black'}`}>
              {formatDate(subscription.expires_at)}
            </div>
            <div className={`text-xs font-bold uppercase tracking-wide ${isExpired ? 'text-black/70' : 'text-black/70'}`}>
              {isPending && !hasExpiryDate ? 'PENDING ACTIVATION' : isExpired ? 'EXPIRED' : hasExpiryDate ? 'ACTIVE' : 'NOT SET'}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Action Buttons */}
      {(isPending || isActive || isExpired) && (
        <div className="flex items-center gap-2 pt-2 border-t border-black/10">
          {isPending && (
            <>
              <Button
                onClick={() => handleStatusUpdate(subscription.id, 'active')}
                disabled={actionLoading[subscription.id]}
                className="
                  border border-black rounded-none font-black uppercase tracking-wider text-xs px-3 py-1 h-auto
                  bg-black text-white hover:bg-white hover:text-black
                  transition-all duration-200 flex items-center gap-1
                  shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]
                "
              >
                <Check className="w-3 h-3" />
                Activate
              </Button>
              <Button
                onClick={() => handleStatusUpdate(subscription.id, 'rejected')}
                disabled={actionLoading[subscription.id]}
                className="
                  border border-black rounded-none font-black uppercase tracking-wider text-xs px-3 py-1 h-auto
                  bg-white text-black hover:bg-black hover:text-white
                  transition-all duration-200 flex items-center gap-1
                  shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]
                "
              >
                <X className="w-3 h-3" />
                Reject
              </Button>
            </>
          )}
          
          {isActive && (
            <Button
              onClick={() => handleExtendSubscription(subscription.id)}
              disabled={actionLoading[subscription.id]}
              className="
                border border-black rounded-none font-black uppercase tracking-wider text-xs px-3 py-1 h-auto
                bg-white text-black hover:bg-black hover:text-white
                transition-all duration-200 flex items-center gap-1
                shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]
              "
            >
              <Calendar className="w-3 h-3" />
              Extend
            </Button>
          )}
          
          {isExpired && (
            <Button
              onClick={() => handleStatusUpdate(subscription.id, 'active')}
              disabled={actionLoading[subscription.id]}
              className="
                border border-black rounded-none font-black uppercase tracking-wider text-xs px-3 py-1 h-auto
                bg-black text-white hover:bg-white hover:text-black
                transition-all duration-200 flex items-center gap-1
                shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]
              "
            >
              <Check className="w-3 h-3" />
              Reactivate
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
