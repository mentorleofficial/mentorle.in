"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function SubscriptionDialog({ 
  isOpen, 
  onClose, 
  channel, 
  userEmail, 
  userId, 
  onSubscriptionSuccess,
  onProceedToPayment 
}) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!channel || !userEmail) {
      console.error("Channel or user email is missing");
      return;
    }

    setLoading(true);

    try {
      // First check if a subscription already exists for this user and domain
      const { data: existingSubscription, error: checkError } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_email", userEmail)
        .eq("domain", channel.id)
        .single();

      let subscriptionData;

      if (existingSubscription && !checkError) {
        // Subscription already exists
        subscriptionData = existingSubscription;
        
        if (existingSubscription.status === 'active') {
          toast({
            title: "Already Subscribed!",
            description: "You already have an active subscription for this domain.",
            variant: "destructive"
          });
          onClose();
          return;
        }
        
        // If status is pending, we can proceed with payment using existing record
        toast({
          title: "Existing Request Found!",
          description: "Proceeding to payment...",
          duration: 3000
        });
      } else {
        // No existing subscription, create a new one
        const { data: newSubscription, error: insertError } = await supabase
          .from("user_subscriptions")
          .insert({
            user_email: userEmail,  
            user_id: userId, 
            domain: channel.id,
            status: 'pending',
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) throw insertError;
        
        subscriptionData = newSubscription;
        
        toast({
          title: "Subscription Request Created!",
          description: "Proceeding to payment...",
          duration: 3000
        });
      }
      
      // Close this dialog and open payment dialog
      onClose();
      
      // Pass the subscription data to payment dialog
      if (onProceedToPayment) {
        onProceedToPayment({
          subscriptionId: subscriptionData.id,
          channel: channel,
          userEmail: userEmail,
          userId: userId
        });
      }
      
    } catch (error) {
      console.error("Error handling subscription:", error);
      toast({
        title: "Error",
        description: "Failed to process subscription request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${channel?.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white text-xl`}>
              {channel?.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold">Subscribe to {channel?.name}</h3>
              <p className="text-sm text-gray-600">₹99/month</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Next Steps</h4>
            </div>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Click "Proceed to Payment" to continue</p>
              <p>• Complete secure payment via Cashfree</p>
              <p>• activation within 24 hours upon successful payment</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-900">What You'll Get</h4>
            </div>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Access to curated study materials</li>
              <li>• Latest industry news and trends</li>
              <li>• Expert-recommended resources</li>
              <li>• PDF downloads and course links</li>
              <li>• Monthly updates and new content</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Proceed to Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
