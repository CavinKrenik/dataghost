import { sendOptOutEmails } from '@/lib/email-sending';
import { US_ONLY_BROKERS } from '@/lib/data-broker-remover/utils';

interface User {
    full_name: string;
    city: string;
    state: string;
    age_range: string;
    email: string;
    country?: string; // Optional, defaults to US in logic if missing
}

export async function resendRemovalEmails(user: User) {
    console.log(`[Cron] Rescanning for user: ${user.email}`);

    try {
        // Load brokers
        // We use the same JSON source as the main action
        // Note: Using 'require' to match the server action behavior and ensure it works in Node env
        const allBrokers = require('@/data/brokers.json');

        let emailBrokers: { name: string, email: string }[] = allBrokers
            .filter((b: any) => b.type === 'email' && b.email)
            .map((b: any) => ({ name: b.name, email: b.email }));

        // Filter for US residents only if applicable
        // The DB might not store country, but typically this app is US focused. 
        // If user.country exists and is not US, filter. Default to US behavior (no filtering) or US-only behavior?
        // In actions.ts: if (country !== 'US') { filter }
        // We will assume 'US' if not present, so we DON'T filter, unless the user explicitly is non-US.
        // But wait, US_ONLY_BROKERS means brokers that ONLY work in US.
        // If I am NOT in US, I should remove them.
        // If the user record doesn't have country, we assume US?
        // Let's assume US for now as most users are US.
        const country = user.country || 'US';

        if (country !== 'US') {
            emailBrokers = emailBrokers.filter((b) => !US_ONLY_BROKERS.includes(b.name));
        }

        const companies = emailBrokers.map((broker) => ({
            name: broker.name,
            email: broker.email,
            subject: 'Data Removal Request',
            body: `Dear ${broker.name},\n\nI am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.\n\nMy Information:\n- Name: {{name}}\n- Age Range: {{age_range}}\n- Address: {{city}}, {{state}}\n- Email: {{email}}\n\nPlease confirm receipt of this request and provide information about the removal process and timeline.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n{{name}}`,
        }));

        await sendOptOutEmails({
            fullName: user.full_name,
            city: user.city,
            state: user.state,
            ageRange: user.age_range,
            userEmail: user.email,
            companies,
            // No PDF for rescans
        });

    } catch (e) {
        console.error(`[Cron] Failed to resend emails for ${user.email}`, e);
    }
}
