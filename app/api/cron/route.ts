// app/api/cron/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with Service Key (bypasses RLS to allow deletions)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    const workerUrl = 'https://dataghost-worker-production.up.railway.app'; // Your Worker URL
    const now = new Date();

    // ============================================================
    // PHASE 1: THE TRASH COMPACTOR (Delete data > 45 days old)
    // ============================================================
    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);

    // Delete users older than 45 days from 'data_broker_users'
    const { data: deletedUsers, error: deleteError } = await supabase
        .from('data_broker_users')
        .delete()
        .lt('created_at', fortyFiveDaysAgo.toISOString())
        .select();

    if (deleteError) console.error('Deletion Error:', deleteError);
    console.log(`🗑️ Deleted ${deletedUsers?.length || 0} expired users.`);


    // ============================================================
    // PHASE 2: THE RE-SCANNER (Scan active users every 7 days)
    // ============================================================
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Find users who are NOT expired, but haven't been scanned in 7 days
    const { data: usersToScan, error: scanError } = await supabase
        .from('data_broker_users')
        .select('*')
        .gt('created_at', fortyFiveDaysAgo.toISOString()) // Younger than 45 days
        .lt('last_scanned_at', sevenDaysAgo.toISOString()); // Scanned > 7 days ago OR never scanned

    if (scanError) return NextResponse.json({ error: scanError.message }, { status: 500 });

    // Loop through and wake up the Railway Worker for each one
    if (usersToScan && usersToScan.length > 0) {
        for (const user of usersToScan) {
            console.log(`🔄 Triggering weekly rescan for: ${user.full_name}`);

            // Fire and forget - tell Railway to do the heavy lifting
            // FIXED: Updated endpoint to match your worker's server.js
            await fetch(`${workerUrl}/nuke-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    fullName: user.full_name,
                    // If city/state/age are in this table, map them here too:
                    // city: user.city, 
                    // state: user.state,
                    // age: user.age_range
                })
            });

            // Update the "last_scanned_at" date immediately
            await supabase
                .from('data_broker_users')
                .update({ last_scanned_at: new Date() })
                .eq('id', user.id);
        }
    }

    return NextResponse.json({
        success: true,
        deleted: deletedUsers?.length || 0,
        rescanned: usersToScan?.length || 0
    });
}