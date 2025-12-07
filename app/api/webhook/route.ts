// app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';

    // Verify signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(rawBody).digest('hex');

    if (signature !== digest) {
      console.error('Webhook signature verification failed');
      return new NextResponse('Invalid signature', { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    // Log the event for debugging
    console.log('Webhook received:', payload.meta.event_name);

    if (payload.meta.event_name === 'order_created') {
      const order = payload.data.attributes;

      const email = (order.user_email || order.customer_email || '').toString().toLowerCase().trim();
      const status = order.status;
      const orderId = payload.data.id;

      if (status === 'paid' && email) {
        const supabase = createAdminClient();

        const { error } = await supabase
          .from('paid_orders')
          .upsert(
            {
              email,
              order_id: orderId,
              status: 'paid',
              amount: order.total,
              created_at: new Date().toISOString(),
            },
            { onConflict: 'email' }
          );

        if (error) {
          console.error('Supabase insert failed:', error);
          return new NextResponse('DB error', { status: 500 });
        }

        console.log(`Successfully recorded paid order for ${email}`);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return new NextResponse('Webhook handler crashed', { status: 500 });
  }
}