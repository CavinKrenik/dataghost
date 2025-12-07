'use server';

import { createAdminClient } from '@/lib/supabase/admin';

export async function checkEmailPayment(email: string) {
    console.log(`[Verify] Starting check for: ${email}`);

    try {
        const supabase = createAdminClient();

        // 1. Sanitize email
        const cleanEmail = email.toLowerCase().trim();

        // 2. Query paid_orders table
        // We use maybeSingle() so it doesn't throw an error if empty
        const { data, error } = await supabase
            .from('paid_orders')
            .select('email, status, order_id')
            .eq('email', cleanEmail)
            .eq('status', 'paid')
            .maybeSingle();

        if (error) {
            console.error('[Verify] DB Error:', error);
            return { success: false, error: 'Database connection failed' };
        }

        if (!data) {
            console.warn(`[Verify] No paid order found for: ${cleanEmail}`);
            return {
                success: false,
                error: 'No payment found for this email. Did you use a different email at checkout?'
            };
        }

        console.log(`[Verify] Success! Found order ${data.order_id}`);
        return { success: true, isPaid: true };

    } catch (err) {
        console.error('[Verify] Critical Server Error:', err);
        return { success: false, error: 'Server processing error' };
    }
}
