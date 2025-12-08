'use server';
import { createRemovalJob } from '@/lib/db';
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
    if (!rawData.fullName || !rawData.city || !rawData.state || !rawData.ageRange || !rawData.email || !rawData.postcode) {
        return { success: false, error: 'Please fill in all fields.' };
    }
    if (!rawData.email.includes('@')) {
        return { success: false, error: 'Invalid email address.' };
    }
    const { fullName, city, state, ageRange, email, country } = rawData;
    try {
        const supabase = createAdminClient();
        const { data: paymentRecord } = await supabase
            .from('paid_orders')
            .select('id')
            .eq('email', email.toLowerCase())
            .eq('status', 'paid')
            .maybeSingle();
        if (!paymentRecord) {
            return { success: false, error: 'Payment verification failed. Please ensure you have paid with this email.' };
        }
        const { data: existingUser } = await supabase
            .from('data_broker_users')
            .select('id')
            .eq('email', email)
            .maybeSingle();
        if (existingUser) {
            return { success: false, error: 'You have already ghosted with this email. One per person.' };
        }
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
        let emailBrokers: { name: string, email: string, subject?: string }[] = [];
        let formBrokers: { name: string, url?: string }[] = [];
        try {
            emailBrokers = getBrokerList();
            const allBrokers = require('@/data/brokers.json');
            emailBrokers = allBrokers
                .filter((b: any) => b.type === 'email' && b.email)
                .map((b: any) => ({ name: b.name, email: b.email, subject: b.subject }));
            formBrokers = allBrokers
                .filter((b: any) => b.type === 'form')
                .map((b: any) => ({ name: b.name, url: b.url }));
        } catch (e) {

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
        let pdfBase64: string | undefined;
        let pdfBuffer: Buffer | undefined;
        if (formBrokers.length > 0) {
            try {
                const { generateChecklistPDF } = await import('@/lib/pdf-generator');
                pdfBuffer = await generateChecklistPDF(fullName, formBrokers);
                pdfBase64 = pdfBuffer.toString('base64');
            } catch (err) {

            }
        }
        await sendOptOutEmails({
            fullName,
            city,
            state,
            ageRange,
            userEmail: email,
            companies,
            checklistPdfBuffer: pdfBuffer,
        });
        const workerData = {
            fullName,
            city,
            state,
            ageRange,
            email,
            postcode: rawData.postcode
        };
        let jobId: string | undefined;
        try {
            const job = await createRemovalJob({
                user_email: email,
                worker_data: workerData,
                status: 'pending'
            });
            jobId = job?.id;

        } catch (jobErr) {

        }
        triggerWorker({
            ...workerData,
            jobId
        });
        revalidatePath('/');
        return {
            success: true,
            count: companies.length,
            manualBrokersCount: formBrokers.length,
            pdfBase64
        };
    } catch (error: any) {

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
        }).catch(err => { });
    } catch (e) {

    }
}
