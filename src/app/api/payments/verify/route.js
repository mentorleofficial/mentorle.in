import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { verifyPayment } from '@/lib/cashfreeGateway';

// Verify payment status for a booking
export async function POST(request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get authenticated user
    let userId = null;
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      userId = session.user.id;
    } else {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (user && !error) userId = user.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { booking_id, order_id } = body;

    if (!booking_id) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
    }

    // Verify booking belongs to user
    const { data: booking, error: bookingError } = await supabase
      .from('mentorship_bookings')
      .select('*')
      .eq('id', booking_id)
      .eq('mentee_id', userId)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // If order_id provided, verify with Cashfree
    if (order_id) {
      try {
        const verificationResult = await verifyPayment(order_id);

        if (verificationResult.is_paid) {
          // Update booking if payment confirmed
          if (booking.payment_status !== 'paid') {
            await supabase
              .from('mentorship_bookings')
              .update({
                payment_status: 'paid',
                status: 'confirmed',
                updated_at: new Date().toISOString()
              })
              .eq('id', booking_id);
          }

          return NextResponse.json({
            payment_status: 'paid',
            booking_status: 'confirmed',
            verified: true,
            order_status: verificationResult.order_status
          });
        }
      } catch (error) {
        console.error('Error verifying with Cashfree:', error);
        // Continue to return current booking status
      }
    }

    // Return current booking status
    return NextResponse.json({
      payment_status: booking.payment_status,
      booking_status: booking.status,
      verified: false
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

