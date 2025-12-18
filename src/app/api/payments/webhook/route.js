import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// Cashfree payment webhook handler
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Verify webhook signature (implement based on Cashfree docs)
    // For now, we'll process the webhook
    
    const { order_id, order_amount, payment_status, payment_message } = body;

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    
    // Extract booking_id from order_id
    // Format 1: booking_{booking_id}_{timestamp} (from order API)
    // Format 2: booking_link_booking_{booking_id}_{timestamp} (from payment link API)
    let bookingId = null;
    
    // Try order format first
    const bookingIdMatch = order_id.match(/^booking_(.+?)_\d+$/);
    if (bookingIdMatch) {
      bookingId = bookingIdMatch[1];
    } else {
      // Try payment link format
      const linkMatch = order_id.match(/^booking_link_booking_(.+?)_\d+$/);
      if (linkMatch) {
        bookingId = linkMatch[1];
      } else {
        // Check if it's a payment link order (Cashfree might use link_id as order_id)
        // Try to find booking by payment_id in database
        const { data: booking } = await supabase
          .from('mentorship_bookings')
          .select('id')
          .eq('payment_id', order_id)
          .single();
        
        if (booking) {
          bookingId = booking.id;
        }
      }
    }
    
    if (!bookingId) {
      // This might be a subscription payment, not a booking payment
      console.log('Webhook received non-booking order_id:', order_id);
      return NextResponse.json({ success: true, message: 'Order processed (not a booking)' });
    }

    // Update booking payment status
    const updateData = {
      payment_status: payment_status === 'SUCCESS' ? 'paid' : 
                     payment_status === 'FAILED' ? 'failed' : 'pending',
      updated_at: new Date().toISOString()
    };

    // If payment successful, confirm booking
    if (payment_status === 'SUCCESS') {
      updateData.status = 'confirmed';
    }

    const { error } = await supabase
      .from('mentorship_bookings')
      .update(updateData)
      .eq('id', bookingId);

    if (error) {
      console.error('Error updating booking payment status:', error);
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }

    // TODO: Send notification to mentor and mentee

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

