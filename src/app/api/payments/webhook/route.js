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

    // Extract booking_id from order_id (format: booking_{booking_id}_{timestamp})
    // If order_id doesn't match booking format, it might be a subscription payment
    const bookingIdMatch = order_id.match(/^booking_(.+?)_\d+$/);
    
    if (!bookingIdMatch) {
      // This might be a subscription payment, not a booking payment
      // Return success but don't update booking
      console.log('Webhook received non-booking order_id:', order_id);
      return NextResponse.json({ success: true, message: 'Order processed (not a booking)' });
    }

    const bookingId = bookingIdMatch[1];

    const supabase = await createServerSupabaseClient();

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

