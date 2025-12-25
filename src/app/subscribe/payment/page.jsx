"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import PaymentDialog from "@/app/dashboard/mentee/resources/components/PaymentDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function SubscribePaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);

  useEffect(() => {
    const initializeSubscription = async () => {
      try {
        setLoading(true);
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Login Required",
            description: "Please log in to subscribe to Campus Program updates.",
            variant: "destructive",
          });
          router.push("/login?returnUrl=/subscribe/payment");
          return;
        }

        const userEmail = session.user.email;
        const userId = session.user.id;

        // Check if subscription already exists for campus program
        const { data: existingSubscription, error: checkError } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_email", userEmail)
          .eq("domain", "campus") // Use "campus" as domain identifier
          .maybeSingle();

        let subscriptionData;

        if (existingSubscription && !checkError) {
          subscriptionData = existingSubscription;
          
          if (existingSubscription.status === 'active') {
            toast({
              title: "Already Subscribed!",
              description: "You already have an active subscription for Campus Program updates.",
              variant: "destructive"
            });
            router.push("/campus");
            return;
          }
        } else {
          // Create new subscription for campus program
          const { data: newSubscription, error: insertError } = await supabase
            .from("user_subscriptions")
            .insert({
              user_email: userEmail,
              user_id: userId,
              domain: "campus",
              status: 'pending',
              created_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) throw insertError;
          subscriptionData = newSubscription;
        }

        setSubscriptionId(subscriptionData.id);
        
        // Set up payment data for the dialog
        setPaymentData({
          subscriptionId: subscriptionData.id,
          channel: {
            name: "Campus Program Updates",
            id: "campus",
            icon: "🎓",
            gradient: "from-blue-400 to-purple-600"
          },
          userEmail: userEmail,
          userId: userId
        });

        // Open payment dialog
        setShowPaymentDialog(true);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing subscription:", error);
        toast({
          title: "Error",
          description: "Failed to initialize subscription. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    initializeSubscription();
  }, [router, toast]);

  const handlePaymentSuccess = async () => {
    try {
      if (!paymentData) return;

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
        description: "Thank you for subscribing! You'll be notified when the Campus Program launches.",
        duration: 5000
      });

      // Close payment dialog and redirect to campus page after successful payment
      setShowPaymentDialog(false);
      setTimeout(() => {
        router.push("/campus");
      }, 2000);
    } catch (error) {
      console.error("Error activating subscription:", error);
      toast({
        title: "Payment Successful",
        description: "Payment successful but failed to activate subscription. Please contact support.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Setting up your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push("/campus")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campus Program
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Subscribe to Campus Program Updates</h1>
          <p className="text-gray-600 mb-6">
            Be the first to know when we launch our campus program features.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Click the button below to proceed with payment and complete your subscription.
            </p>
          </div>
        </div>

        {showPaymentDialog && paymentData && (
          <PaymentDialog
            isOpen={showPaymentDialog}
            onClose={() => {
              setShowPaymentDialog(false);
              router.push("/campus");
            }}
            onPaymentSuccess={handlePaymentSuccess}
            subscriptionData={paymentData}
          />
        )}
      </div>
    </div>
  );
}
