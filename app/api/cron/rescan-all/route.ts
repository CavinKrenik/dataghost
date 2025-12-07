import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resendRemovalEmails } from '@/lib/data-broker-remover/send-emails';

const CRON_SECRET = process.env.CRON_SECRET!;

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const auth = request.headers.get('authorization');

    if (auth !== `Bearer ${CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    const supabase = createClient();

    // Get all users who are between day 8 and day 45
    // We use 45 days ago and 7 days ago.
    // 45 days ago: users created AFTER this date are potentially still active
    // 7 days ago: users created BEFORE this date are eligible (day 8+)
    const day45Ago = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
    const day7Ago = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: users, error } = await supabase
        .from('data_broker_users')
        .select('*')
        .gt('created_at', day45Ago)
        .lte('created_at', day7Ago);

    if (error) {
        console.error('Cron job query error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!users || users.length === 0) {
        return NextResponse.json({ rescanned: 0 });
    }

    // Resend removal emails for each user
    for (const user of users) {
        await resendRemovalEmails(user as any);
    }

    return NextResponse.json({
        success: true,
        rescanned: users.length,
        timestamp: new Date().toISOString()
    });
}
