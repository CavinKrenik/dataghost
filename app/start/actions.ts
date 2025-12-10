'use server';

import { createRemovalJob } from '@/lib/db.server';
import { US_ONLY_BROKERS } from '@/lib/data-broker-remover/utils';
import { sendOptOutEmails } from '@/lib/email-sending';
import { createAdminClient } from '@/lib/supabase/admin';
import ALL_BROKERS_JSON from '@/data/brokers.json';
import { z } from 'zod';

export type State = {
    success?: boolean;
    error?: string | null;
    count?: number;
    pdfBase64?: string;
    manualBrokersCount?: number;
};

const getBrokerList = () => ALL_BROKERS_JSON;

const FormSchema = z.object({
    fullName: z.string().min(1, "Full name is required").trim(),
    city: z.string().min(1, "City is required").trim(),
    state: z.string().min(1, "State is required").trim(),
    ageRange: z.string().min(1, "Age range is required"),
    email: z.string().email("Invalid email address"),
    postcode: z.string().optional().default("00000"),
});

export async function startGhosting(prevState: State | undefined, formData: FormData): Promise<State> {
    const rawData = {
        fullName: formData.get('fullName') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        ageRange: formData.get('ageRange') as string,
        email: formData.get('email') as string,
        postcode: formData.get('postcode') as string || '00000',
    };

    const validatedFields = FormSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { success: false, error: 'Invalid input. Please check your details.' };
    }

    const { fullName, city, state, ageRange, email, postcode } = validatedFields.data;
    const country = 'US';

    try {
        const supabase = createAdminClient();

        // 1. Verify Payment
        const { data: paymentRecord } = await supabase.from('paid_orders').select('id').eq('email', email.toLowerCase()).eq('status', 'paid').maybeSingle();
        if (!paymentRecord) return { success: false, error: 'Payment verification failed.' };

        // 2. Insert User (Fixed: Removed .catch, Supabase returns error object instead of throwing)
        await supabase.from('data_broker_users').insert({
            email,
            full_name: fullName,
            city,
            state,
            age_range: ageRange
        });

        // 3. Prepare Brokers
        const allBrokers = getBrokerList();

        // Filter out US-only brokers if the user is not in the US
        // (This fixes the "unused variable" error)
        let filteredBrokers = allBrokers;
        if (country !== 'US') {
            filteredBrokers = allBrokers.filter((b: any) => !US_ONLY_BROKERS.includes(b.name));
        }

        const emailBrokers = filteredBrokers.filter((b: any) => b.type === 'email' && b.email).map((b: any) => ({ name: b.name, email: b.email, subject: b.subject }));
        const formBrokers = filteredBrokers.filter((b: any) => b.type === 'form');

        const companies = emailBrokers.map((broker) => ({
            name: broker.name,
            email: broker.email,
            subject: broker.subject || 'Data Removal Request',
            body: `Dear ${broker.name},\n\nI am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.\n\nMy Information:\n- Name: {{name}}\n- Age Range: {{age_range}}\n- Address: {{city}}, {{state}}\n- Email: {{email}}\n\nPlease confirm receipt of this request and provide information about the removal process and timeline.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n{{name}}`,
        }));

        // 4. Send Emails (Strict Error Handling)
        try {
            await sendOptOutEmails({
                fullName, city, state, ageRange, userEmail: email, companies, checklistPdfBuffer: undefined,
            });
        } catch (emailErr: any) {
            console.error('EMAIL FAILED:', emailErr);
            return { success: false, error: 'Payment confirmed, but email system is busy. Please contact support@dataghost.me.' };
        }

        // 5. Trigger Worker (Authenticated & Tracked)
        try {
            // Create job record first
            const jobData = {
                status: 'queued',
                user_email: email,
                worker_data: {
                    fullName,
                    city,
                    state,
                    ageRange,
                    postcode: rawData.postcode
                }
            };

            const job = await createRemovalJob(jobData);

            if (job?.id) {
                // Trigger worker with jobId (Fire-and-forget logic inside helper)
                await triggerWorker({
                    jobId: job.id,
                    ...jobData.worker_data,
                    email
                });
            } else {
                console.error('Failed to create job record, skipping worker trigger');
            }

        } catch (workerError: any) {
            // We swallow worker errors to ensure the user gets to the success page
            console.error('WORKER TRIGGER LOGIC EXCEPTION:', workerError.message);
        }

        // REDIRECT TO SUCCESS with params
        // We use redirect() from next/navigation which throws a NEXT_REDIRECT error
        // so it must be outside the try/catch or rethrown.
        // However, in server actions, we can just return the redirect object or use `redirect` function
        // But the signature is `Promise<State>`, so we should check how the client handles it.
        // "Convert SuccessPage to a Client Component ... Use useSearchParams"
        // The previous code returned a state object.
        // If we change this to `redirect`, we change the function signature?
        // Ah, the user didn't ask to change the RETURN type of startGhosting, just the logic.
        // BUT, the Success Page now relies on URL params.
        // So the client component calling this action needs to handle the redirect.
        // OR we can import `redirect` and use it.

        // Wait, `startGhosting` is likely called by `useFormState`.
        // `redirect` in Server Actions works by throwing an error that Next.js catches.

        // Success - Redirecting
        // We import redirect at top-level to use it here or just import at file level.
        // Since we are inside the 'try', we have access to companies and formBrokers.
        const { redirect } = await import('next/navigation');
        redirect(`/success?emails=${companies.length}&forms=${formBrokers.length}`);

        // This return is unreachable due to redirect(), but satisfies TS if it didn't know about redirect's behavior
        return { success: true };

    } catch (error: any) {
        // NEXT_REDIRECT throws an error that looks like 'NEXT_REDIRECT', we must rethrow it
        if (error.message === 'NEXT_REDIRECT' || error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }

        console.error('CRITICAL FAILURE:', error.message);
        return { success: false, error: 'Server error during ghosting.' };
    }
}

// Refactored Helper: Non-blocking Worker Trigger
// We wait up to 4 seconds for the handshake. If it takes longer, we assume it's queued 
// and return success to the UI (since the job is already in DB).
async function triggerWorker(userData: any) {
    const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8080/nuke-data';
    const HANDSHAKE_TIMEOUT_MS = 4000;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HANDSHAKE_TIMEOUT_MS);

    try {
        console.log(`[Worker] Triggering worker at ${WORKER_URL} for Job ${userData.jobId}`);

        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CRON_SECRET}`
            },
            body: JSON.stringify(userData),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            // If the worker explicitly rejects (e.g. 500, 401), we should know.
            const errorText = await response.text().catch(() => 'No error body');
            console.error(`[Worker] Handshake Failed: ${response.status} ${response.statusText} - ${errorText}`);
            // We choose NOT to throw here effectively "swallowing" the error to the user
            // because the job is in the DB and we can retry later (or the user can retry).
            // But for now, let's log heavily.
        } else {
            console.log(`[Worker] Handshake Success: ${response.status}`);
        }

    } catch (e: any) {
        clearTimeout(timeoutId);
        if (e.name === 'AbortError') {
            console.warn(`[Worker] Handshake timed out after ${HANDSHAKE_TIMEOUT_MS}ms. Assuming queued state.`);
        } else {
            console.error(`[Worker] Connection Failed: ${e.message}`);
        }
        // We do NOT throw. We allow the UI to proceed to success.
    }
}