import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';

const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const text = await req.text();
  const signature = req.headers.get('x-signature') || '';

  // Verify signature
  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = hmac.update(text).digest('hex');

  if (signature !== digest) {
    console.error('Invalid webhook signature');
    return new NextResponse('Invalid signature', { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(text);
  } catch (err) {
    console.error('Invalid JSON', err);
    return new NextResponse('Invalid JSON', { status: 400 });
  }

  if (event.meta.event_name === 'order_created') {
    const order = event.data;
    const email = (order.attributes.user_email || order.attributes.customer?.attributes?.email || '').toString().toLowerCase().trim();
    const status = order.attributes.status;

    if (status === 'paid' && email) {
      // Use Admin Client to bypass RLS (Service Role)
      const supabase = createAdminClient();

      const { error } = await supabase
        .from('paid_orders')
        .upsert({
          email,
          order_id: order.id,
          status: 'paid',
          amount: order.attributes.total,
          created_at: new Date().toISOString(),
        }, { onConflict: 'email' });

      if (error) {
        console.error('Supabase insert error:', error);
        return new NextResponse('DB error', { status: 500 });
      }

      console.log(`Paid order recorded for ${email}`);
      return NextResponse.json({ success: true });
    }
  }

  return NextResponse.json({ received: true });
}
