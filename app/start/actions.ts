// app/start/actions.ts

'use server';

import { getBrokerList, US_ONLY_BROKERS } from '@/lib/data-broker-remover/utils';
import { sendOptOutEmails } from '@/lib/email-sending';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';


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

    // Manual Validation
    if (!rawData.fullName || !rawData.city || !rawData.state || !rawData.ageRange || !rawData.email || !rawData.postcode) {
        return { success: false, error: 'Please fill in all fields.' };
    }
    if (!rawData.email.includes('@')) {
        return { success: false, error: 'Invalid email address.' };
    }

    const { fullName, city, state, ageRange, email, country } = rawData;

    try {
        console.log('DEBUG 1: STARTING ACTION');
        const supabase = createAdminClient();

        // 1. Verify Payment (Security Check) - Already passed, proceeding.
        console.log('DEBUG 2: CHECKING PAYMENT (SHOULD PASS)');
        const { data: paymentRecord } = await supabase
            .from('paid_orders')
            .select('id')
            .eq('email', email.toLowerCase())
            .eq('status', 'paid')
            .maybeSingle();

        if (!paymentRecord) {
            return { success: false, error: 'Payment verification failed. Please ensure you have paid with this email.' };
        }
        console.log('DEBUG 3: PAYMENT VERIFIED. ATTEMPTING USER INSERT.');

        // 2. Insert new user - We are BYPASSING the "already ghosted" check for debugging
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
            // This happens if the email is already in the DB and we failed to check it
            console.error('ERROR 4: SUPABASE INSERT FAILED:', insertError);
            throw insertError;
        }
        console.log('DEBUG 5: USER INSERTED. LOADING BROKERS.');

        // 3. Get and Filter Brokers - Logic remains the same
        let emailBrokers: { name: string, email: string, subject?: string }[] = [];
        let formBrokers: { name: string, url?: string }[] = [];

        try {
            emailBrokers = getBrokerList().filter((b: any) => b.type === 'email');
            const allBrokers = require('@/data/brokers.json');
            formBrokers = allBrokers.filter((b: any) => b.type === 'form').map((b: any) => ({ name: b.name, url: b.url }));

        } catch (e) {
            console.warn('Failed to load brokers.json fallback', e);
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

        console.log('DEBUG 6: BROKERS LOADED. ATTEMPTING EMAIL/WORKER SEND.');

        // 4. Send Emails (This uses RESEND_API_KEY)
        await sendOptOutEmails({
            fullName,
            city,
            state,
            ageRange,
            userEmail: email,
            companies,
            // checklistPdfBuffer: pdfBuffer, <-- PDF BYPASS IS ACTIVE
        });
        console.log('DEBUG 7: EMAILS SENT. TRIGGERING WORKER.');

        // 5. Trigger the Heavy Muscle (Playwright Worker)
        triggerWorker({
            fullName,
            city,
            state,
            ageRange,
            email,
            postcode: rawData.postcode
        });
        console.log('DEBUG 8: WORKER TRIGGERED. ACTION COMPLETE.');


        revalidatePath('/');
        return {
            success: true,
            count: companies.length,
            manualBrokersCount: formBrokers.length,
            // pdfBase64: pdfBase64 // <-- PDF BYPASS IS ACTIVE
        };

    } catch (error: any) {
        console.error('ERROR 9: GHOSTING CATCH BLOCK HIT. CRASH DETAILS:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

async function triggerWorker(userData: any) {
    const WORKER_URL = process.env.WORKER_URL || 'http://localhost:8080/nuke-data';

    try {
        fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        }).catch(err => console.error('Worker Trigger Failed:', err));

    } catch (e) {
        console.error('Worker Trigger Failed (network level):', e);
    }
}