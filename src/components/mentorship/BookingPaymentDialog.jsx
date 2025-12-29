"use client";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Loader2 } from "lucide-react";

export default function BookingPaymentDialog({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  paymentSessionId,
  paymentUrl,
  bookingData
}) {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'success', 'failed'
  const [showThankYou, setShowThankYou] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [checkoutInitialized, setCheckoutInitialized] = useState(false);
  const checkoutContainerRef = useRef(null);

  const handlePaymentMessage = (event) => {
    // Listen for payment completion messages from Cashfree
    if (event.origin !== 'https://payments.cashfree.com' && 
        event.origin !== 'https://sandbox.cashfree.com') return;
    
    try {
      const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      
      if (data.event === 'payment_success' || data.type === 'PAYMENT_SUCCESS') {
        setPaymentStatus('success');
        setShowThankYou(true);
        
        // Call the success callback after showing thank you message
        setTimeout(() => {
          onPaymentSuccess();
          onClose();
          setShowThankYou(false);
          setPaymentStatus('pending');
        }, 3000);
      } else if (data.event === 'payment_failed' || data.type === 'PAYMENT_FAILED') {
        setPaymentStatus('failed');
      }
    } catch (error) {
      // Check if URL contains success/failure indicators
      if (typeof event.data === 'string' && event.data.includes('cashfree')) {
        if (event.data.includes('success') || event.data.includes('SUCCESS')) {
          setPaymentStatus('success');
          setShowThankYou(true);
          setTimeout(() => {
            onPaymentSuccess();
            onClose();
            setShowThankYou(false);
            setPaymentStatus('pending');
          }, 3000);
        } else if (event.data.includes('failed') || event.data.includes('FAILED')) {
          setPaymentStatus('failed');
        }
      }
    }
  };

  // Add event listener when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', handlePaymentMessage);
      
      return () => {
        window.removeEventListener('message', handlePaymentMessage);
      };
    }
  }, []);

  // Initialize Cashfree checkout.js SDK when dialog opens and we have payment_session_id
  useEffect(() => {
    if (isOpen && paymentSessionId && !paymentUrl && !checkoutInitialized && checkoutContainerRef.current) {
      const initializeCheckout = async () => {
        try {
          // Load Cashfree checkout.js SDK
          const script = document.createElement('script');
          script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
          script.async = true;
          
          script.onload = () => {
            if (typeof window !== 'undefined' && window.Cashfree && checkoutContainerRef.current) {
              // Get Cashfree App ID from environment (client-side)
              const cashfreeAppId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
              const cashfreeEnv = process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 'PRODUCTION';
              
              if (!cashfreeAppId) {
                console.error('Cashfree App ID not configured');
                setPaymentStatus('failed');
                return;
              }

              try {
                // Initialize Cashfree SDK
                const cashfree = new window.Cashfree({
                  mode: cashfreeEnv.toUpperCase() === 'PRODUCTION' ? 'production' : 'sandbox'
                });

                // Render checkout
                cashfree.checkout({
                  paymentSessionId: paymentSessionId,
                  returnUrl: `${window.location.origin}/dashboard/mentee/bookings/${bookingData?.bookingId}/payment?order_id=${bookingData?.orderId}`,
                  onSuccess: () => {
                    console.log('Payment successful via checkout.js');
                    setPaymentStatus('success');
                    setShowThankYou(true);
                    setTimeout(() => {
                      onPaymentSuccess();
                      onClose();
                    }, 3000);
                  },
                  onFailure: (error) => {
                    console.error('Payment failed via checkout.js:', error);
                    setPaymentStatus('failed');
                  }
                }).render(checkoutContainerRef.current);
                
                setCheckoutInitialized(true);
                setIframeLoaded(true);
                console.log('✅ Cashfree checkout.js initialized successfully');
              } catch (checkoutError) {
                console.error('Error initializing Cashfree checkout:', checkoutError);
                setPaymentStatus('failed');
              }
            } else {
              console.error('Cashfree SDK not loaded or container not available');
              setPaymentStatus('failed');
            }
          };

          script.onerror = () => {
            console.error('Failed to load Cashfree SDK');
            setPaymentStatus('failed');
          };

          document.body.appendChild(script);

          return () => {
            // Cleanup script if component unmounts
            if (document.body.contains(script)) {
              document.body.removeChild(script);
            }
          };
        } catch (error) {
          console.error('Error loading Cashfree SDK:', error);
          setPaymentStatus('failed');
        }
      };

      initializeCheckout();
    }
  }, [isOpen, paymentSessionId, paymentUrl, checkoutInitialized, bookingData]);

  // Iframe loading timeout (for paymentUrl)
  useEffect(() => {
    if (isOpen && paymentUrl && !iframeLoaded) {
      const timeout = setTimeout(() => {
        setIframeLoaded(true);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen, paymentUrl, iframeLoaded]);

  const handleClose = () => {
    if (paymentStatus !== 'success') {
      onClose();
      setPaymentStatus('pending');
      setShowThankYou(false);
      setIframeLoaded(false);
      setCheckoutInitialized(false);
    }
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  // Must have either paymentUrl or paymentSessionId
  if (!paymentUrl && !paymentSessionId) {
    console.error('❌ BookingPaymentDialog: Missing both payment URL and session ID', { 
      paymentUrl, 
      paymentSessionId, 
      bookingData 
    });
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Error</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Payment initialization failed. Please try again.</p>
            <p className="text-sm text-gray-500">If this persists, contact support.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  // Debug logging
  if (paymentUrl) {
    console.log('✅ BookingPaymentDialog: Using payment URL from API:', paymentUrl);
    console.log('💰 Booking Amount:', displayAmount, 'Title:', displayTitle);
  } else if (paymentSessionId) {
    console.log('✅ BookingPaymentDialog: Using payment_session_id with checkout.js SDK');
    console.log('💰 Booking Amount:', displayAmount, 'Title:', displayTitle);
  }
  
  // Validate that we have the correct amount
  if (displayAmount === 0 || !displayAmount) {
    console.warn('⚠️ BookingPaymentDialog: Amount is 0 or missing!', { bookingData, displayAmount });
  }
  
  // Validate payment URL is not a subscription form
  if (paymentUrl && paymentUrl.includes('mentorleprime')) {
    console.error('❌ BookingPaymentDialog: Payment URL appears to be subscription form!', paymentUrl);
  }

  // Ensure amount is always displayed correctly
  const displayAmount = bookingData?.amount || 0;
  const displayTitle = bookingData?.offering?.title || "Mentorship Session";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <DialogTitle className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Payment for {displayTitle}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                ₹{displayAmount.toFixed(2)} • One-time Payment
              </p>
            </div>
            <div className="flex-shrink-0 bg-black text-white px-4 py-2 rounded-lg">
              <div className="text-xs text-gray-300">Total Amount</div>
              <div className="text-lg font-bold">₹{displayAmount.toFixed(2)}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {showThankYou ? (
            <div className="text-center py-8 sm:py-12 px-4 sm:px-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-2 sm:mb-3">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto">
                Your booking has been confirmed. You will be redirected shortly.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Security Notice with Amount Display */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b">
                <div className="flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm sm:text-base">🔒 Secure Payment Gateway</h4>
                      <p className="text-xs sm:text-sm text-blue-800">
                        Powered by Cashfree • SSL Encrypted • PCI DSS Compliant
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-xs text-blue-700 font-medium">Amount to Pay</div>
                    <div className="text-lg sm:text-xl font-bold text-blue-900">₹{displayAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Payment Frame */}
              <div className="flex-1 bg-white relative overflow-hidden">
                {/* Loading state */}
                {((paymentUrl && !iframeLoaded) || (paymentSessionId && !checkoutInitialized)) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center z-10">
                    <div className="text-center max-w-sm mx-auto px-4">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-500" />
                      <p className="text-sm text-gray-700 font-medium mb-2">Loading secure payment gateway...</p>
                      <p className="text-xs text-gray-500">
                        Establishing secure connection with Cashfree
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Use iframe for paymentUrl, checkout.js container for paymentSessionId */}
                {paymentUrl ? (
                  <>
                    {/* Amount reminder banner */}
                    <div className="absolute top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 px-4 py-2 z-20">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="font-medium text-yellow-900">Paying:</span>
                        <span className="font-bold text-lg text-yellow-900">₹{displayAmount.toFixed(2)}</span>
                        <span className="text-yellow-700">for {displayTitle}</span>
                      </div>
                    </div>
                    <iframe
                      src={paymentUrl}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                      className="w-full h-full min-h-[500px] sm:min-h-[600px] transition-opacity duration-300"
                      title={`Cashfree Payment Gateway - ₹${displayAmount.toFixed(2)}`}
                      onLoad={handleIframeLoad}
                      style={{ 
                        minHeight: 'calc(95vh - 180px)',
                        border: 'none',
                        opacity: iframeLoaded ? 1 : 0,
                        marginTop: '40px' // Space for amount banner
                      }}
                    />
                  </>
                ) : (
                  <>
                    {/* Amount reminder for checkout.js */}
                    <div className="absolute top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 px-4 py-2 z-20">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="font-medium text-yellow-900">Paying:</span>
                        <span className="font-bold text-lg text-yellow-900">₹{displayAmount.toFixed(2)}</span>
                        <span className="text-yellow-700">for {displayTitle}</span>
                      </div>
                    </div>
                    <div 
                      ref={checkoutContainerRef}
                      className="w-full h-full min-h-[500px] sm:min-h-[600px]"
                      style={{ 
                        minHeight: 'calc(95vh - 180px)',
                        marginTop: '40px' // Space for amount banner
                      }}
                    />
                  </>
                )}
              </div>

              {/* Error State */}
              {paymentStatus === 'failed' && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-50 to-pink-50 border-t">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-red-900">⚠️ Payment Failed</p>
                      <p className="text-xs sm:text-sm text-red-800">
                        Please try again or contact support if the issue persists.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

