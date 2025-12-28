import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { processWebhook } from '@/lib/cashfreeGateway';

// Cashfree payment webhook handler
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Verify webhook signature (implement based on Cashfree docs)
    // For now, we'll process the webhook
    
    if (!body.order_id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    
    // Process webhook data using the gateway service
    const webhookData = processWebhook(body);
    
    if (!webhookData.booking_id) {
      // This might be a subscription payment, not a booking payment
      console.log('Webhook received non-booking order_id:', body.order_id);
      return NextResponse.json({ success: true, message: 'Order processed (not a booking)' });
    }

    // Try to find booking by payment_id if booking_id extraction failed
    let bookingId = webhookData.booking_id;
    if (!bookingId) {
      const { data: booking } = await supabase
        .from('mentorship_bookings')
        .select('id')
        .eq('payment_id', body.order_id)
        .single();
      
      if (booking) {
        bookingId = booking.id;
      } else {
        console.log('Webhook received order_id with no matching booking:', body.order_id);
        return NextResponse.json({ success: true, message: 'Order processed (no booking found)' });
      }
    }

    // Update booking payment status
    const updateData = {
      payment_status: webhookData.is_success ? 'paid' : 
                     webhookData.is_failed ? 'failed' : 'pending',
      updated_at: new Date().toISOString()
    };

    // If payment successful, confirm booking
    if (webhookData.is_success) {
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

    return NextResponse.json({ 
      success: true,
      booking_id: bookingId,
      payment_status: updateData.payment_status
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

