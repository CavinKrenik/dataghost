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
        const { data: existingUser } = await supabase
            .from('data_broker_users')
            .select('id')
            .eq('email', email)
            .maybeSingle();

        if (existingUser) {
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
        let emailBrokers: { name: string, email: string, subject?: string }[] = [];
        let formBrokers: { name: string, url?: string }[] = [];

        try {
            // Use the centralized utils function for email brokers
            emailBrokers = getBrokerList();

            // For form brokers, we still load directly from json as getBrokerList currently only returns email types
            // defined in the interface
            const allBrokers = require('@/data/brokers.json');

            // Re-map just to be sure we have the full list if getBrokerList changes
            emailBrokers = allBrokers
                .filter((b: any) => b.type === 'email' && b.email)
                .map((b: any) => ({ name: b.name, email: b.email, subject: b.subject }));

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
            subject: broker.subject || 'Data Removal Request',
            body: `Dear ${broker.name},\n\nI am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.\n\nMy Information:\n- Name: {{name}}\n- Age Range: {{age_range}}\n- Address: {{city}}, {{state}}\n- Email: {{email}}\n\nPlease confirm receipt of this request and provide information about the removal process and timeline.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n{{name}}`,
        }));

        // 6. Generate PDF Checklist
        let pdfBase64: string | undefined;
        let pdfBuffer: Buffer | undefined;

        if (formBrokers.length > 0) {
            try {
                // DYNAMIC IMPORT: Load the heavy library only now, inside the try block
                const { generateChecklistPDF } = await import('@/lib/pdf-generator');

                pdfBuffer = await generateChecklistPDF(fullName, formBrokers);
                pdfBase64 = pdfBuffer.toString('base64');
            } catch (err) {
                console.error('Failed to generate PDF:', err);
                // We intentionally catch this so the email still sends even if PDF fails
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
