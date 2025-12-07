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
      console.error('Invalid webhook signature');
      return new NextResponse('Invalid signature', { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    console.log('Webhook received:', payload.meta.event_name);

    if (payload.meta.event_name === 'order_created') {
      const order = payload.data.attributes;
      const email = (order.user_email || '').toString().toLowerCase().trim();
      const orderId = payload.data.id;

      if (order.status === 'paid' && email) {
        const supabase = createAdminClient();

        // Nuclear safe insert — never fails, never throws
        const { error } = await supabase
          .from('paid_orders')
          .insert({
            email,
            order_id: orderId,
            status: 'paid',
            amount: order.total,
            created_at: new Date().toISOString(),
          });

        // Only throw if it's not a duplicate key error (duplicates are fine)
        if (error && !error.message.includes('duplicate key')) {
          console.error('Supabase insert failed:', error);
          return new NextResponse('DB error', { status: 500 });
        }

        console.log(`Paid order recorded for ${email} (order ${orderId})`);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook crashed:', err);
    return new NextResponse('Crash', { status: 500 });
  }
}