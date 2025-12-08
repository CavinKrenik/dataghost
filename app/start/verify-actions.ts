'use server';
import { createAdminClient } from '@/lib/supabase/admin';
export async function checkEmailPayment(email: string) {

    try {
        const supabase = createAdminClient();
        const cleanEmail = email.toLowerCase().trim();
        const { data, error } = await supabase
            .from('paid_orders')
            .select('email, status, order_id')
            .eq('email', cleanEmail)
            .eq('status', 'paid')
            .maybeSingle();
        if (error) {

            return { success: false, error: 'Database connection failed' };
        }
        if (!data) {

            return {
                success: false,
                error: 'No payment found for this email. Did you use a different email at checkout?'
            };
        }

        return { success: true, isPaid: true };
    } catch (err) {

        return { success: false, error: 'Server processing error' };
    }
}
