"use client";
import { useState, useEffect } from "react";
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
  bookingData
}) {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'success', 'failed'
  const [showThankYou, setShowThankYou] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

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

  // Iframe loading timeout
  useEffect(() => {
    if (isOpen && !iframeLoaded) {
      const timeout = setTimeout(() => {
        setIframeLoaded(true);
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen, iframeLoaded]);

  const handleClose = () => {
    if (paymentStatus !== 'success') {
      onClose();
      setPaymentStatus('pending');
      setShowThankYou(false);
      setIframeLoaded(false);
    }
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  // Use the same Cashfree form as subscription payment
  // Pass order_id as parameter so webhook can identify the booking
  const paymentUrl = bookingData?.orderId
    ? `https://payments.cashfree.com/forms/mentorleprime?redirect_target=_blank&order_id=${bookingData.orderId}`
    : 'https://payments.cashfree.com/forms/mentorleprime?redirect_target=_blank';

  if (!paymentUrl) {
    console.error('BookingPaymentDialog: Missing order data', { bookingData });
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[95vh] p-0 overflow-hidden">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <DialogTitle className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Payment for {bookingData?.offering?.title || "Mentorship Session"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                ₹{bookingData?.amount || 0} • One-time Payment
              </p>
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
              {/* Security Notice */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-blue-900 text-sm sm:text-base">🔒 Secure Payment Gateway</h4>
                    <p className="text-xs sm:text-sm text-blue-800">
                      Powered by Cashfree • SSL Encrypted • PCI DSS Compliant
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Frame */}
              <div className="flex-1 bg-white relative overflow-hidden">
                {/* Loading state */}
                {!iframeLoaded && (
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
                
                <iframe
                  src={paymentUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  className="w-full h-full min-h-[500px] sm:min-h-[600px] transition-opacity duration-300"
                  title="Cashfree Payment Gateway"
                  onLoad={handleIframeLoad}
                  style={{ 
                    minHeight: 'calc(95vh - 180px)',
                    border: 'none',
                    opacity: iframeLoaded ? 1 : 0
                  }}
                />
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

