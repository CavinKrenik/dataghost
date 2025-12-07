// app/api/cron/rescan-all/route.ts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { resendRemovalEmails } from '@/lib/data-broker-remover/send-emails';

const CRON_SECRET = process.env.CRON_SECRET!;

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const supabase = createAdminClient();
    const auth = request.headers.get('authorization');

    if (auth !== `Bearer ${CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get users who are between day 8 and day 45
    const { data: users } = await supabase
        .from('data_broker_users')
        .select('*')
        .gt('created_at', new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString())
        .lte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (!users || users.length === 0) {
        return NextResponse.json({ rescanned: 0 });
    }

    // Fire and forget — we don't wait for completion (cron has plenty of time)
    // This avoids any timeout issues and runs exactly like the original submission
    for (const user of users) {
        resendRemovalEmails(user as any).catch(console.error);
    }

    return NextResponse.json({
        success: true,
        rescanned: users.length,
        note: 'Emails queued in background',
    });
}