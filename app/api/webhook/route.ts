import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import crypto from 'crypto';
const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';
    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = hmac.update(rawBody).digest('hex');

    // --- SECURITY FIX START ---
    const signatureBuffer = Buffer.from(signature);
    const digestBuffer = Buffer.from(digest);

    // Constant-time comparison to prevent timing attacks
    const isValid = signatureBuffer.length === digestBuffer.length &&
      crypto.timingSafeEqual(signatureBuffer, digestBuffer);

    if (!isValid) {
      return new NextResponse('Invalid signature', { status: 400 });
    }
    // --- SECURITY FIX END ---
    const payload = JSON.parse(rawBody);

    if (payload.meta.event_name === 'order_created') {
      const order = payload.data.attributes;
      const email = (order.user_email || '').toString().toLowerCase().trim();
      const orderId = payload.data.id;
      if (order.status === 'paid' && email) {
        const supabase = createAdminClient();
        const { error } = await supabase
          .from('paid_orders')
          .insert({
            email,
            order_id: orderId,
            status: 'paid',
            amount: order.total,
            created_at: new Date().toISOString(),
          });
        if (error && !error.message.includes('duplicate key')) {

          return new NextResponse('DB error', { status: 500 });
        }

        return NextResponse.json({ success: true });
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {

    return new NextResponse('Crash', { status: 500 });
  }
}
