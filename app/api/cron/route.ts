import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resendRemovalEmails } from '@/lib/data-broker-remover/send-emails';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET() {
    const workerUrl = process.env.WORKER_URL || 'https://dataghost-worker-production.up.railway.app';
    const now = new Date();

    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);

    const { data: deletedUsers, error: deleteError } = await supabase
        .from('data_broker_users')
        .delete()
        .lt('created_at', fortyFiveDaysAgo.toISOString())
        .select();

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const { data: usersToScan, error: scanError } = await supabase
        .from('data_broker_users')
        .select('*')
        .gt('created_at', fortyFiveDaysAgo.toISOString())
        .lt('last_scanned_at', sevenDaysAgo.toISOString())
        .limit(5);

    if (scanError) return NextResponse.json({ error: scanError.message }, { status: 500 });
    if (!usersToScan?.length) {
        return NextResponse.json({ success: true, message: 'No users need rescanning.' });
    }

    for (const user of usersToScan) {
        try {
            await resendRemovalEmails(user as any);
        } catch (err) {
        }

        try {
            await fetch(`${workerUrl}/nuke-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    fullName: user.full_name,
                    city: user.city,
                    state: user.state,
                    ageRange: user.age_range,
                    jobId: null
                })
            });
        } catch (err) {
        }

        await supabase
            .from('data_broker_users')
            .update({ last_scanned_at: new Date() })
            .eq('id', user.id);
    }

    return NextResponse.json({
        success: true,
        deleted: deletedUsers?.length || 0,
        rescanned: usersToScan.length
    });
}
