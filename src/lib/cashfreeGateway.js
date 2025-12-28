/**
 * Cashfree Payment Gateway Service
 * 
 * A streamlined payment gateway service for creating orders, processing payments,
 * and handling webhooks for mentorship booking offerings.
 * 
 * This service provides a clean, free-flowing payment integration with Cashfree.
 */

/**
 * Get Cashfree configuration from environment variables
 */
function getCashfreeConfig() {
  // Support both naming conventions for flexibility
  const appId = process.env.CASHFREE_APP_ID || process.env.NEXT_PUBLIC_CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;
  const environment = process.env.CASHFREE_ENVIRONMENT || 
                     process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || 
                     'PRODUCTION';
  const apiUrl = process.env.CASHFREE_API_URL;
  const appUrl = process.env.CASHFREE_RETURN_URL || 
                 process.env.NEXT_PUBLIC_APP_URL || 
                 process.env.APP_URL || 
                 'http://localhost:3000';

  if (!appId || !secretKey) {
    throw new Error('Cashfree credentials not configured. Please set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in environment variables.');
  }

  // Determine base URL
  let baseUrl;
  if (apiUrl) {
    baseUrl = apiUrl.replace(/\/pg$/, '');
  } else {
    const isProduction = environment.toUpperCase() === 'PRODUCTION';
    baseUrl = isProduction 
      ? 'https://api.cashfree.com' 
      : 'https://sandbox.cashfree.com';
  }

  // Ensure HTTPS for return URLs (Cashfree requirement)
  const returnUrl = appUrl.startsWith('http://') 
    ? appUrl.replace('http://', 'https://')
    : appUrl;

  return {
    appId,
    secretKey,
    environment: environment.toUpperCase(),
    baseUrl,
    returnUrl,
    isProduction: environment.toUpperCase() === 'PRODUCTION'
  };
}

/**
 * Generate a unique order ID for a booking
 */
function generateOrderId(bookingId) {
  return `booking_${bookingId}_${Date.now()}`;
}

/**
 * Create a payment order for a booking offering
 * 
 * @param {Object} params - Order creation parameters
 * @param {string} params.bookingId - The booking ID
 * @param {number} params.amount - Order amount
 * @param {string} params.currency - Currency code (default: INR)
 * @param {string} params.customerId - Customer user ID
 * @param {string} params.customerName - Customer name
 * @param {string} params.customerEmail - Customer email
 * @param {string} params.customerPhone - Customer phone
 * @param {string} params.offeringTitle - Offering title for order note
 * @param {string} params.returnPath - Return path after payment (default: /dashboard/mentee/bookings/{bookingId}/payment)
 * 
 * @returns {Promise<Object>} Order creation response with order_id, payment_session_id, and payment_url
 */
async function createPaymentOrder({
  bookingId,
  amount,
  currency = 'INR',
  customerId,
  customerName,
  customerEmail,
  customerPhone = '9999999999',
  offeringTitle = 'Mentorship Session',
  returnPath = null
}) {
  try {
    const config = getCashfreeConfig();
    const orderId = generateOrderId(bookingId);
    
    // Build return URL
    const returnUrlPath = returnPath || `/dashboard/mentee/bookings/${bookingId}/payment`;
    const returnUrl = `${config.returnUrl}${returnUrlPath}`;
    const notifyUrl = `${config.returnUrl}/api/payments/webhook`;

    // Create order payload
    const orderPayload = {
      order_id: orderId,
      order_amount: parseFloat(amount),
      order_currency: currency,
      order_note: `Booking payment for ${offeringTitle}`,
      customer_details: {
        customer_id: customerId,
        customer_name: customerName || 'User',
        customer_email: customerEmail || 'user@example.com',
        customer_phone: customerPhone
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: notifyUrl
      }
    };

    // Create order via Cashfree API
    const response = await fetch(`${config.baseUrl}/pg/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': config.appId,
        'x-client-secret': config.secretKey,
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree order creation failed:', data);
      throw new Error(
        data.message || 
        data.error || 
        `Payment gateway error: ${response.status} ${response.statusText}`
      );
    }

    // Extract payment information
    const paymentSessionId = data.payment_session_id || null;
    const paymentUrl = data.payment_url || data.payment_link || null;

    // If no payment URL from order, try creating a payment link
    let finalPaymentUrl = paymentUrl;
    if (!finalPaymentUrl && paymentSessionId) {
      // Payment session ID is available, frontend can use checkout.js SDK
      console.log('Order created with payment_session_id, frontend can use checkout.js');
    }

    return {
      order_id: orderId,
      payment_session_id: paymentSessionId,
      payment_url: finalPaymentUrl,
      order_amount: amount,
      order_currency: currency,
      raw_response: data
    };
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
}

/**
 * Create a payment link for a booking (alternative method)
 * 
 * @param {Object} params - Payment link parameters (same as createPaymentOrder)
 * @returns {Promise<Object>} Payment link response
 */
async function createPaymentLink({
  bookingId,
  amount,
  currency = 'INR',
  customerId,
  customerName,
  customerEmail,
  customerPhone = '9999999999',
  offeringTitle = 'Mentorship Session',
  returnPath = null
}) {
  try {
    const config = getCashfreeConfig();
    const linkId = `link_booking_${bookingId}_${Date.now()}`;
    
    // Build return URL
    const returnUrlPath = returnPath || `/dashboard/mentee/bookings/${bookingId}/payment`;
    const returnUrl = `${config.returnUrl}${returnUrlPath}`;
    const notifyUrl = `${config.returnUrl}/api/payments/webhook`;

    // Create payment link payload
    const linkPayload = {
      link_id: linkId,
      link_amount: parseFloat(amount),
      link_currency: currency,
      link_purpose: `Booking payment for ${offeringTitle}`,
      customer_details: {
        customer_id: customerId,
        customer_name: customerName || 'User',
        customer_email: customerEmail || 'user@example.com',
        customer_phone: customerPhone
      },
      link_notify: {
        send_sms: false,
        send_email: false
      },
      link_meta: {
        return_url: returnUrl,
        notify_url: notifyUrl
      },
      link_auto_reminders: false,
      link_partial_payments: false
    };

    // Create payment link via Cashfree API
    const response = await fetch(`${config.baseUrl}/pg/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': config.appId,
        'x-client-secret': config.secretKey,
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(linkPayload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree payment link creation failed:', data);
      throw new Error(
        data.message || 
        data.error || 
        `Payment gateway error: ${response.status} ${response.statusText}`
      );
    }

    // Extract payment URL from various possible fields
    const paymentUrl = data.link_url || 
                      data.short_url || 
                      data.url || 
                      data.payment_url ||
                      data.link ||
                      null;

    return {
      order_id: linkId,
      payment_url: paymentUrl,
      link_id: data.link_id || linkId,
      order_amount: amount,
      order_currency: currency,
      raw_response: data
    };
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw error;
  }
}

/**
 * Verify payment status for an order
 * 
 * @param {string} orderId - The order ID to verify
 * @returns {Promise<Object>} Payment status information
 */
async function verifyPayment(orderId) {
  try {
    const config = getCashfreeConfig();

    const response = await fetch(`${config.baseUrl}/pg/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-client-id': config.appId,
        'x-client-secret': config.secretKey,
        'x-api-version': '2023-08-01'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashfree order verification failed:', data);
      throw new Error(
        data.message || 
        data.error || 
        `Payment verification error: ${response.status} ${response.statusText}`
      );
    }

    return {
      order_id: data.order_id || orderId,
      order_status: data.order_status,
      payment_status: data.payment_status,
      order_amount: data.order_amount,
      order_currency: data.order_currency,
      payment_message: data.payment_message,
      is_paid: data.order_status === 'PAID',
      raw_response: data
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

/**
 * Process webhook data from Cashfree
 * 
 * @param {Object} webhookData - Webhook payload from Cashfree
 * @returns {Object} Processed webhook data with booking_id extracted
 */
function processWebhook(webhookData) {
  const { order_id, order_amount, payment_status, payment_message } = webhookData;

  if (!order_id) {
    throw new Error('Order ID is required in webhook data');
  }

  // Extract booking_id from order_id
  // Format: booking_{booking_id}_{timestamp} or link_booking_{booking_id}_{timestamp}
  let bookingId = null;
  
  // Try order format first
  const bookingIdMatch = order_id.match(/^booking_(.+?)_\d+$/);
  if (bookingIdMatch) {
    bookingId = bookingIdMatch[1];
  } else {
    // Try payment link format
    const linkMatch = order_id.match(/^link_booking_(.+?)_\d+$/);
    if (linkMatch) {
      bookingId = linkMatch[1];
    }
  }

  return {
    order_id,
    booking_id: bookingId,
    order_amount: parseFloat(order_amount) || 0,
    payment_status: payment_status || 'PENDING',
    payment_message: payment_message || null,
    is_success: payment_status === 'SUCCESS' || payment_status === 'PAID',
    is_failed: payment_status === 'FAILED',
    raw_data: webhookData
  };
}

/**
 * Get payment URL for redirect-based payment flow
 * 
 * @param {string} orderId - The order ID
 * @param {string} paymentSessionId - The payment session ID (optional)
 * @returns {string} Payment URL
 */
function getPaymentUrl(orderId, paymentSessionId = null) {
  const config = getCashfreeConfig();
  
  if (paymentSessionId) {
    // Use checkout.js SDK with payment_session_id (preferred)
    return null; // Frontend should use checkout.js SDK
  }

  // Construct payment URL if available
  const paymentBaseUrl = config.isProduction 
    ? 'https://payments.cashfree.com'
    : 'https://sandbox.cashfree.com';
  
  return `${paymentBaseUrl}/pg/orders/${orderId}`;
}

module.exports = {
  createPaymentOrder,
  createPaymentLink,
  verifyPayment,
  processWebhook,
  getPaymentUrl,
  getCashfreeConfig,
  generateOrderId
};

