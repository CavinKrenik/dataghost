'use server';

import crypto from 'crypto';
import { upsertDataBrokerUser } from '@/lib/db';
import { getBrokerList, US_ONLY_BROKERS } from '@/lib/data-broker-remover/utils';
import { sendOptOutEmails } from '@/lib/email-sending';

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
};

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
        // 1. Save user to DB (for 45-day rescans)
        const hash = crypto.createHash('sha256');
        hash.update(email);
        const hashedEmail = hash.digest('hex');

        await upsertDataBrokerUser({
            id: hashedEmail,
            verified: true, // Auto-verify since they paid
            last_sent_at: new Date().toISOString(),
        });

        // 2. Get and Filter Brokers
        let brokers: { name: string, email: string }[] = getBrokerList();

        // Fallback to brokers.json if env is empty
        if (brokers.length === 0) {
            try {
                // Determine path or just require it if we are in server context
                // Note: using require with dynamic path can be tricky in webpack, but static path is fine.
                // We need to import the JSON file. 
                // Since this file is in app/start/actions.ts and brokers is in data/brokers.json...
                // Using a relative import or alias
                const allBrokers = require('@/data/brokers.json');
                brokers = allBrokers
                    .filter((b: any) => b.type === 'email' && b.email)
                    .map((b: any) => ({ name: b.name, email: b.email }));
            } catch (e) {
                console.warn('Failed to load brokers.json fallback', e);
            }
        }

        if (country !== 'US') {
            brokers = brokers.filter((b) => !US_ONLY_BROKERS.includes(b.name));
        }

        if (brokers.length === 0) {
            console.warn('No brokers found in env or json.');
            // return { success: false, error: 'Configuration error: No data brokers found.' };
        }

        // 3. Prepare Email Objects
        const companies = brokers.map((broker) => ({
            name: broker.name,
            email: broker.email,
            subject: 'Data Removal Request',
            body: `Dear ${broker.name},\n\nI am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.\n\nMy Information:\n- Name: {{name}}\n- Age Range: {{age_range}}\n- Address: {{city}}, {{state}}\n- Email: {{email}}\n\nPlease confirm receipt of this request and provide information about the removal process and timeline.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n{{name}}`,
        }));

        // 4. Send Emails
        await sendOptOutEmails({
            fullName,
            city,
            state,
            ageRange,
            userEmail: email,
            companies,
        });

        return { success: true, count: companies.length };
    } catch (error) {
        console.error('Ghosting error:', error);
        return { success: false, error: 'Failed to start ghosting. Please try again.' };
    }
}
