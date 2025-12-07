'use server';

import { getBrokerList, US_ONLY_BROKERS } from '@/lib/data-broker-remover/utils';
import { sendOptOutEmails } from '@/lib/email-sending';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { generateChecklistPDF } from '@/lib/pdf-generator';

// Manual validation types and logic to avoid adding zod dependency
interface FormDataTypes {
    fullName: string;
    city: string;
    state: string;
    ageRange: string;
    email: string;
    country: string;
    postcode: string;
}

export type State = {
    success?: boolean;
    error?: string | null;
    count?: number;
    pdfBase64?: string;
    manualBrokersCount?: number;
};

export async function checkEmailPayment(email: string): Promise<{ success: boolean; error?: string }> {
    if (!email || !email.includes('@')) {
        return { success: false, error: 'Invalid email address.' };
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('paid_orders')
        .select('id, status')
        .eq('email', email.toLowerCase())
        .eq('status', 'paid')
        .maybeSingle();

    if (error) {
        console.error('Payment check error:', error);
        return { success: false, error: 'Database connection failed. Please try again.' };
    }

    if (!data) {
        return { success: false, error: 'No paid order found for this email. Please complete payment first.' };
    }

    return { success: true };
}

export async function startGhosting(prevState: State | undefined, formData: FormData): Promise<State> {
    const rawData = {
        fullName: formData.get('fullName') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        ageRange: formData.get('ageRange') as string,
        email: formData.get('email') as string,
        country: 'US',
        postcode: '00000',
    };

    // Manual Validation
    if (!rawData.fullName || !rawData.city || !rawData.state || !rawData.ageRange || !rawData.email) {
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

        // 2. Check for existing user (Prevent double submission if desired, or just update)
        // Ideally we might want to allow re-runs for the same user if they paid, but user requested prevent double-use?
        // "optionally delete or mark the order as used"
        // Let's stick to existing logic: check data_broker_users.
        const { data: existingUser } = await supabase
            .from('data_broker_users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            // Optional: allow re-run? simpler to block for now to prevent spam.
            return { success: false, error: 'You have already ghosted with this email. One per person.' };
        }

        // 3. Insert new user
        const { error: insertError } = await supabase
            .from('data_broker_users')
            .insert({
                email: email,
                full_name: fullName,
                city: city,
                state: state,
                age_range: ageRange,
            });

        if (insertError) throw insertError;

        // 4. Get and Filter Brokers
        let emailBrokers: { name: string, email: string }[] = [];
        let formBrokers: { name: string, url?: string }[] = [];

        // Fallback to brokers.json if env is empty
        try {
            const allBrokers = require('@/data/brokers.json');

            // Email brokers
            emailBrokers = allBrokers
                .filter((b: any) => b.type === 'email' && b.email)
                .map((b: any) => ({ name: b.name, email: b.email }));

            // Form brokers
            formBrokers = allBrokers
                .filter((b: any) => b.type === 'form')
                .map((b: any) => ({ name: b.name, url: b.url }));

        } catch (e) {
            console.warn('Failed to load brokers.json fallback', e);
        }

        if (country !== 'US') {
            emailBrokers = emailBrokers.filter((b) => !US_ONLY_BROKERS.includes(b.name));
            formBrokers = formBrokers.filter((b) => !US_ONLY_BROKERS.includes(b.name));
        }

        // 5. Prepare Email Objects
        const companies = emailBrokers.map((broker) => ({
            name: broker.name,
            email: broker.email,
            subject: 'Data Removal Request',
            body: `Dear ${broker.name},\n\nI am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.\n\nMy Information:\n- Name: {{name}}\n- Age Range: {{age_range}}\n- Address: {{city}}, {{state}}\n- Email: {{email}}\n\nPlease confirm receipt of this request and provide information about the removal process and timeline.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n{{name}}`,
        }));

        // 6. Generate PDF Checklist
        let pdfBase64: string | undefined;
        let pdfBuffer: Buffer | undefined;

        if (formBrokers.length > 0) {
            try {
                pdfBuffer = await generateChecklistPDF(fullName, formBrokers);
                pdfBase64 = pdfBuffer.toString('base64');
            } catch (err) {
                console.error('Failed to generate PDF:', err);
            }
        }

        // 7. Send Emails
        await sendOptOutEmails({
            fullName,
            city,
            state,
            ageRange,
            userEmail: email,
            companies,
            checklistPdfBuffer: pdfBuffer,
        });

        // Optional: Mark order as used or consumed? 
        // For now, let's keep it simple. The data_broker_users table acts as a log of "used" service.

        revalidatePath('/');
        return {
            success: true,
            count: companies.length,
            manualBrokersCount: formBrokers.length,
            pdfBase64
        };

    } catch (error: any) {
        console.error('Ghosting error:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}
