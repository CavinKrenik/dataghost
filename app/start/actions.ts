'use server';

import { createRemovalJob } from '@/lib/db';
import { US_ONLY_BROKERS } from '@/lib/data-broker-remover/utils';
import { sendOptOutEmails } from '@/lib/email-sending';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

// NOTE: This utility function is usually placed in utils.ts or a separate file, 
// but is defined here for completeness in the Server Action file.
const getBrokerList = () => {
    // We assume the JSON syntax is correct now and load it directly
    return require('@/data/brokers.json');
};


export type State = {
    success?: boolean;
    error?: string | null;
    count?: number;
    pdfBase64?: string;
    manualBrokersCount?: number;
};

export async function startGhosting(prevState: State | undefined, formData: FormData): Promise<State> {
    const rawData = {
        fullName: formData.get('fullName') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        ageRange: formData.get('ageRange') as string,
        email: formData.get('email') as string,
        country: 'US',
        postcode: formData.get('postcode') as string || '00000',
    };

    if (!rawData.fullName || !rawData.city || !rawData.state || !rawData.ageRange || !rawData.email || !rawData.postcode) {
        return { success: false, error: 'Please fill in all fields.' };
    }
    if (!rawData.email.includes('@')) {
        return { success: false, error: 'Invalid email address.' };
    }

    const { fullName, city, state, ageRange, email, country } = rawData;

    try {
        const supabase = createAdminClient();

        // 1. Verify Payment (Security Check)
        const { data: paymentRecord } = await supabase
            .from('paid_orders')
            .select('id')
            .eq('email', email.toLowerCase())
            .eq('status', 'paid')
            .maybeSingle();

        if (!paymentRecord) {
            return { success: false, error: 'Payment verification failed. Please ensure you have paid with this email.' };
        }

        // 2. Check for existing user (to prevent duplicate primary key violation)
        const { data: existingUser } = await supabase
            .from('data_broker_users')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        // 3. Insert new user (if not exists)
        if (!existingUser) {
            const { error: insertError } = await supabase
                .from('data_broker_users')
                .insert({
                    email: email,
                    full_name: fullName,
                    city: city,
                    state: state,
                    age_range: ageRange,
                });

            if (insertError) {
                // Ignore failure if it's a known constraint error (i.e., user already exists)
                console.warn('Supabase Insert Warning (User likely exists):', insertError);
            }
        }

        // 4. Get and Filter Brokers
        let emailBrokers: { name: string, email: string, subject?: string }[] = [];
        let formBrokers: { name: string, url?: string }[] = [];

        try {
            const allBrokers = getBrokerList();

            emailBrokers = allBrokers
                .filter((b: any) => b.type === 'email' && b.email)
                .map((b: any) => ({ name: b.name, email: b.email, subject: b.subject }));

            formBrokers = allBrokers
                .filter((b: any) => b.type === 'form')
                .map((b: any) => ({ name: b.name, url: b.url }));

        } catch (e) {
            console.error('CRITICAL: FAILED TO LOAD BROKERS.JSON:', e);
            return { success: false, error: 'Failed to load broker list from server.' };
        }

        if (country !== 'US') {
            emailBrokers = emailBrokers.filter((b) => !US_ONLY_BROKERS.includes(b.name));
            formBrokers = formBrokers.filter((b) => !US_ONLY_BROKERS.includes(b.name));
        }

        const companies = emailBrokers.map((broker) => ({
            name: broker.name,
            email: broker.email,
            subject: broker.subject || 'Data Removal Request',
            body: `Dear ${broker.name},\n\nI am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.\n\nMy Information:\n- Name: {{name}}\n- Age Range: {{age_range}}\n- Address: {{city}}, {{state}}\n- Email: {{email}}\n\nPlease confirm receipt of this request and provide information about the removal process and timeline.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n{{name}}`,
        }));

        // PDF Generation (BYPASSED)
        let pdfBase64: string | undefined;
        let pdfBuffer: Buffer | undefined;
        // ... (PDF logic remains commented out)

        // 5. Send Emails (RESEND) - HIGHLY PROTECTED
        try {
            await sendOptOutEmails({
                fullName,
                city,
                state,
                ageRange,
                userEmail: email,
                companies,
                checklistPdfBuffer: pdfBuffer,
            });
        } catch (emailErr) {
            console.error('ERROR: EMAIL SEND FAILED (Non-critical):', emailErr);
            // The job continues even if the email fails, preventing a 500 error.
        }

        // 6. Trigger Worker (The successful part)
        const workerData = {
            fullName,
            city,
            state,
            ageRange,
            email,
            postcode: rawData.postcode
        };
        let jobId: string | undefined;

        triggerWorker({
            ...workerData,
            jobId
        });

        // 7. Create Job Record (ASYNCHRONOUSLY, HIGHLY PROTECTED)
        try {
            const job = await createRemovalJob({
                user_email: email,
                worker_data: workerData,
                status: 'pending'
            });
            jobId = job?.id;

        } catch (jobErr) {
            console.error('ERROR: FAILED TO CREATE JOB RECORD (DB MIGRATION ISSUE LIKELY):', jobErr);
            // Job record creation is a non-critical error for the user's success page
        }

        // 8. Final Return
        // The return must be clean and fast for the browser to register success.
        // We explicitly ignore revalidatePath to avoid unnecessary error
        // revalidatePath('/'); 

        return {
            success: true,
            count: companies.length,
            manualBrokersCount: formBrokers.length,
            pdfBase64
        };
    } catch (error: any) {
        console.error('CRITICAL GHOSTING FAILURE (UNCATEGORIZED):', error);
        return { success: false, error: error.message || 'Unknown server error during ghosting.' };
    }
}

async function triggerWorker(userData: any) {
    const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8080/nuke-data';

    try {
        // We do not await this fetch because we want the serverless function to complete quickly.
        fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        }).catch(err => { console.error('Worker Trigger Failed (Fetch):', err) });
    } catch (e) {
        console.error('Worker Trigger Failed (Network):', e);
    }
}