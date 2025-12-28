import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { createPaymentOrder } from '@/lib/cashfreeGateway';

// Create Cashfree payment order for booking
export async function POST(request) {
  try {
    let supabase = await createServerSupabaseClient();
    
    // Get authenticated user (mentee)
    let userId = null;
    let accessToken = null;
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      userId = session.user.id;
      accessToken = session.access_token;
    } else {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
      }

      // When using a bearer token without a Next.js session, rebuild the client with the token
      if (accessToken) {
        const { createClient } = require('@supabase/supabase-js');
        supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          {
            global: {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            },
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false
            }
          }
        );

        // Try to get user; if network issues, decode from JWT as fallback
        try {
          const { data: { user }, error } = await supabase.auth.getUser(accessToken);
          if (user && !error) {
            userId = user.id;
          }
        } catch (err) {
          try {
            const [, payload] = accessToken.split('.');
            const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
            if (decoded?.sub) {
              userId = decoded.sub;
            }
          } catch (decodeErr) {
            console.warn('Unable to decode access token for user id in payments create-order', decodeErr);
          }
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { booking_id, amount, currency = 'INR' } = body;

    if (!booking_id || !amount) {
      return NextResponse.json({ 
        error: 'Booking ID and amount are required' 
      }, { status: 400 });
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from('mentorship_bookings')
      .select('*, offering:offering_id (title, mentor_id)')
      .eq('id', booking_id)
      .eq('mentee_id', userId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.payment_status === 'paid') {
      return NextResponse.json({ error: 'Booking already paid' }, { status: 400 });
    }

    // Get user information for payment
    let userEmail = null;
    let userName = 'User';
    let userPhone = '9999999999';

    const { data: menteeData } = await supabase
      .from('mentee_data')
      .select('name, email, phone')
      .eq('user_id', userId)
      .single();
    
    if (menteeData) {
      if (menteeData.name) userName = menteeData.name;
      if (menteeData.email) userEmail = menteeData.email;
      if (menteeData.phone) userPhone = menteeData.phone;
    } else {
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('name')
        .eq('user_id', userId)
        .single();
      if (userRole?.name) userName = userRole.name;
    }

    // Create payment order using the streamlined gateway service
    try {
      const paymentResult = await createPaymentOrder({
        bookingId: booking_id,
        amount: parseFloat(amount),
        currency: currency,
        customerId: userId,
        customerName: userName,
        customerEmail: userEmail,
        customerPhone: userPhone,
        offeringTitle: booking.offering?.title || 'Mentorship Session'
      });

      // Update booking with payment order ID
      await supabase
        .from('mentorship_bookings')
        .update({ 
          payment_id: paymentResult.order_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', booking_id);

      return NextResponse.json({
        order_id: paymentResult.order_id,
        payment_session_id: paymentResult.payment_session_id || null,
        payment_url: paymentResult.payment_url || null,
        order_amount: paymentResult.order_amount,
        order_currency: paymentResult.order_currency
      });
    } catch (paymentError) {
      console.error('Payment order creation error:', paymentError);
      
      // Roll back booking if payment order creation failed
      await supabase
        .from('mentorship_bookings')
        .delete()
        .eq('id', booking_id)
        .eq('payment_status', 'pending');

      return NextResponse.json({ 
        error: 'Failed to create payment order',
        details: paymentError.message || 'Payment gateway error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating payment order:', error);
    
    // Roll back booking on any unexpected failure
    const body = await request.json().catch(() => ({}));
    if (body?.booking_id) {
      try {
        await supabase
          .from('mentorship_bookings')
          .delete()
          .eq('id', body.booking_id)
          .eq('payment_status', 'pending');
      } catch (rollbackError) {
        console.error('Error rolling back booking:', rollbackError);
      }
    }

    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

