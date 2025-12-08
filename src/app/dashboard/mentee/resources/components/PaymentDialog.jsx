"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export default function PaymentDialog({ 
  isOpen, 
  onClose, 
  onPaymentSuccess, 
  subscriptionData 
}) {
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'success', 'failed'
  const [showThankYou, setShowThankYou] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState(null);

  // For testing purposes - simulate payment success
  const simulatePaymentSuccess = () => {
    setPaymentStatus('success');
    setShowThankYou(true);
    
    setTimeout(() => {
      onPaymentSuccess(); // This will handle the database update in parent component
      onClose();
      setShowThankYou(false);
      setPaymentStatus('pending');
      setInvoiceUrl(null);
    }, 5000);
  };

  const handlePaymentMessage = (event) => {
    // Listen for payment completion messages from Cashfree iframe
    if (event.origin !== 'https://payments.cashfree.com') return;
    
    try {
      const data = JSON.parse(event.data);
      if (data.event === 'payment_success') {
        setPaymentStatus('success');
        setShowThankYou(true);
        
        // Store invoice URL if provided
        if (data.invoice_url || data.receipt_url || data.order_url) {
          const url = data.invoice_url || data.receipt_url || data.order_url;
          setInvoiceUrl(url);
          // Open invoice/receipt in new tab
          window.open(url, '_blank', 'noopener,noreferrer');
        }
        
        // Call the success callback after showing thank you message
        setTimeout(() => {
          onPaymentSuccess(); // This will handle the database update in parent component
          onClose();
          setShowThankYou(false);
          setPaymentStatus('pending');
          setInvoiceUrl(null);
        }, 5000); // Increased time to 5 seconds for better UX
      } else if (data.event === 'payment_failed') {
        setPaymentStatus('failed');
      } else if (data.event === 'redirect' || data.event === 'navigation') {
        // Handle redirect events by opening in new tab instead of same window
        if (data.url) {
          window.open(data.url, '_blank', 'noopener,noreferrer');
        }
      }
    } catch (error) {
      console.error('Error parsing payment message:', error);
    }
  };

  // Add event listener when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', handlePaymentMessage);
      
      // Additional listener for navigation events
      const handleNavigation = (event) => {
        if (event.data && typeof event.data === 'string') {
          try {
            // Check if it's a URL that looks like a Cashfree receipt/invoice
            if (event.data.includes('cashfree') && (event.data.includes('receipt') || event.data.includes('invoice') || event.data.includes('success'))) {
              window.open(event.data, '_blank', 'noopener,noreferrer');
              event.preventDefault();
            }
          } catch (e) {
            // Ignore parsing errors for non-JSON messages
          }
        }
      };
      
      window.addEventListener('message', handleNavigation);
      
      return () => {
        window.removeEventListener('message', handlePaymentMessage);
        window.removeEventListener('message', handleNavigation);
      };
    }
  }, []);

  // Iframe loading timeout
  useEffect(() => {
    if (isOpen && !iframeLoaded) {
      const timeout = setTimeout(() => {
        setIframeLoaded(true); // Force show iframe even if onLoad doesn't fire
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timeout);
    }
  }, [isOpen, iframeLoaded]);

  const handleClose = () => {
    if (paymentStatus !== 'success') {
      onClose();
      setPaymentStatus('pending');
      setShowThankYou(false);
      setIframeLoaded(false);
      setInvoiceUrl(null);
    }
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    
    // Try to monitor iframe navigation
    try {
      const iframe = document.querySelector('iframe[title="Cashfree Payment Gateway"]');
      if (iframe) {
        iframe.addEventListener('load', () => {
          try {
            // Check if iframe navigated to a success/receipt page
            const iframeUrl = iframe.contentWindow?.location?.href;
            if (iframeUrl && (iframeUrl.includes('success') || iframeUrl.includes('receipt') || iframeUrl.includes('invoice'))) {
              // Open in new tab
              window.open(iframeUrl, '_blank', 'noopener,noreferrer');
              // Reset iframe to prevent full-page navigation
              iframe.src = 'about:blank';
            }
          } catch (e) {
            // Cross-origin restriction - this is expected
          }
        });
      }
    } catch (error) {
      // Ignore errors related to iframe access
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[95vh] p-0 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${subscriptionData?.channel?.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white text-sm sm:text-xl flex-shrink-0 shadow-lg`}>
              {subscriptionData?.channel?.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                Payment for {subscriptionData?.channel?.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">₹99/month • Premium Access</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {showThankYou ? (
            <div className="text-center py-8 sm:py-12 px-4 sm:px-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-900 mb-2 sm:mb-3">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Thank you for subscribing to <span className="font-semibold text-green-700">{subscriptionData?.channel?.name}</span>. 
                Your premium access is now active and ready to use.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border border-blue-200 max-w-md mx-auto mb-4">
                <p className="text-xs sm:text-sm text-blue-800 leading-relaxed mb-2">
                  📄 Your payment receipt and invoice have been opened in a new tab for your records.
                </p>
                {invoiceUrl && (
                  <button
                    onClick={() => window.open(invoiceUrl, '_blank', 'noopener,noreferrer')}
                    className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    📖 View Invoice Again
                  </button>
                )}
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-200 max-w-md mx-auto shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm sm:text-base font-medium text-green-900">
                    Premium Access Activated
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-green-800 leading-relaxed">
                  You now have full access to premium resources, study materials, and exclusive content.
                </p>
              </div>
              
              <div className="mt-6 sm:mt-8">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  Redirecting you back to resources...
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Security Notice */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm sm:text-base">🔒 Secure Payment Gateway</h4>
                      <p className="text-xs sm:text-sm text-blue-800 leading-tight">
                        Powered by Cashfree • SSL Encrypted • PCI DSS Compliant • Bank-level Security
                      </p>
                    </div>
                  </div>
                  
                  {/* Test Button for Development */}
                  {/* {process.env.NODE_ENV === 'development' && (
                    <button
                      onClick={simulatePaymentSuccess}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Test Success
                    </button>
                  )} */}
                </div>
              </div>

              {/* Payment Frame */}
              <div className="flex-1 bg-white relative overflow-hidden">
                {/* Loading state for iframe */}
                {!iframeLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center z-10">
                    <div className="text-center max-w-sm mx-auto px-4">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-sm text-gray-700 font-medium mb-2">Loading secure payment gateway...</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Establishing secure connection with Cashfree payment servers
                      </p>
                      <div className="mt-4 flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <iframe
                  src="https://payments.cashfree.com/forms/mentorleprime?redirect_target=_blank"
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
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-50 to-pink-50 border-t border-red-200 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <div>
                      <p className="text-sm sm:text-base font-medium text-red-900">⚠️ Payment Failed</p>
                      <p className="text-xs sm:text-sm text-red-800">
                        Please try again or contact our support team if the issue persists.
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
