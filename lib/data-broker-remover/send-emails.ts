import { sendOptOutEmails } from '@/lib/email-sending';
import { getBrokerList, US_ONLY_BROKERS } from '@/lib/data-broker-remover/utils';
interface User {
    full_name: string;
    city: string;
    state: string;
    age_range: string;
    email: string;
    country?: string;
}
export async function resendRemovalEmails(user: User) {

    try {
        let emailBrokers = getBrokerList();
        const country = user.country || 'US';
        if (country !== 'US') {
            emailBrokers = emailBrokers.filter((b) => !US_ONLY_BROKERS.includes(b.name));
        }
        const companies = emailBrokers.map((broker) => ({
            name: broker.name,
            email: broker.email,
            subject: broker.subject || 'Data Removal Request',
            body: `Dear ${broker.name},\n\nI am writing to request the removal of my personal information from your database in accordance with applicable data privacy laws.\n\nMy Information:\n- Name: {{name}}\n- Age Range: {{age_range}}\n- Address: {{city}}, {{state}}\n- Email: {{email}}\n\nPlease confirm receipt of this request and provide information about the removal process and timeline.\n\nThank you for your prompt attention to this matter.\n\nSincerely,\n{{name}}`,
        }));
        await sendOptOutEmails({
            fullName: user.full_name,
            city: user.city,
            state: user.state,
            ageRange: user.age_range,
            userEmail: user.email,
            companies,
        });
    } catch (e) {

    }
}
