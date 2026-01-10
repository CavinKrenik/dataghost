import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new NextResponse('Invalid signature', { status: 400 });
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = (session.customer_email || session.customer_details?.email || '').toLowerCase().trim();
      const orderId = session.id;

      if (session.payment_status === 'paid' && email) {
        const supabase = createAdminClient();
        const { error } = await supabase
          .from('paid_orders')
          .insert({
            email,
            order_id: orderId,
            status: 'paid',
            amount: session.amount_total,
            created_at: new Date().toISOString(),
          });

        if (error && !error.message.includes('duplicate key')) {
          console.error('DB error:', error);
          return new NextResponse('DB error', { status: 500 });
        }

        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return new NextResponse('Webhook error', { status: 500 });
  }
}
