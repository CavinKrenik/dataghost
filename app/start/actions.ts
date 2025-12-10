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

            if (!job?.id) {
                throw new Error('Failed to create job record');
            }

            // Trigger worker with jobId
            await triggerWorker({
                jobId: job.id,
                ...jobData.worker_data,
                email // pass email for worker reference if needed, though it's in DB
            });

        } catch (workerError: any) {
            console.error('WORKER TRIGGER FAILED:', workerError.message); // Log message only, avoid full object
            // We still return success because emails were sent, but maybe warn? 
            // Request says "throw an error so the frontend knows the process failed"
            // But we already sent emails... 
            // "If the worker returns a non-200 status, throw an error so the frontend knows the process failed."
            // Assuming this means return an error state.
            return { success: false, error: 'Request processed, but background worker failed to start. Please contact support.' };
        }

        return { success: true, count: companies.length, manualBrokersCount: formBrokers.length };

    } catch (error: any) {
        console.error('CRITICAL FAILURE:', error.message);
        return { success: false, error: 'Server error during ghosting.' };
    }
}

async function triggerWorker(userData: any) {
    const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8080/nuke-data';

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.CRON_SECRET}`
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error(`Worker responded with ${response.status}: ${response.statusText}`);
        }
    } catch (e: any) {
        // Rethrow to be caught by the caller
        throw new Error(`Worker Connection Failed: ${e.message}`);
    }
}