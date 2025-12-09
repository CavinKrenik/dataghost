import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resendRemovalEmails } from '@/lib/data-broker-remover/send-emails';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // 1. Incoming Security Check
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const workerUrl = process.env.WORKER_URL || 'https://dataghost-worker-production.up.railway.app';
    const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Delete old users
    await supabase.from('data_broker_users').delete().lt('created_at', fortyFiveDaysAgo.toISOString());

    // Fetch users to scan
    const { data: usersToScan } = await supabase.from('data_broker_users').select('*')
        .gt('created_at', fortyFiveDaysAgo.toISOString())
        .lt('last_scanned_at', sevenDaysAgo.toISOString())
        .limit(5);

    if (!usersToScan?.length) return NextResponse.json({ success: true, message: 'No users.' });

    // Process in Parallel
    await Promise.allSettled(usersToScan.map(async (user) => {
        // Resend Emails
        try { await resendRemovalEmails(user as any); } catch (e) { }

        // Trigger Worker (Authenticated)
        try {
            await fetch(`${workerUrl}/nuke-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.CRON_SECRET}`
                },
                body: JSON.stringify({
                    email: user.email, fullName: user.full_name, city: user.city,
                    state: user.state, ageRange: user.age_range, jobId: null
                })
            });
        } catch (e) { }

        // Update DB
        await supabase.from('data_broker_users').update({ last_scanned_at: new Date() }).eq('id', user.id);
    }));

    return NextResponse.json({ success: true, scanned: usersToScan.length });
}