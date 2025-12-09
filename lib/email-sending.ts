import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export async function sendOptOutEmails({
    fullName,
    city,
    state,
    ageRange,
    userEmail,
    companies,
    checklistPdfBuffer,
}: {
    fullName: string;
    city: string;
    state: string;
    ageRange: string;
    userEmail: string;
    companies: Array<{ name: string; email: string; subject: string; body: string; }>;
    checklistPdfBuffer?: Buffer;
}) {

    if (!resend) throw new Error('Resend API Key missing.');

    const batchEmails = companies.map((company) => ({
        from: 'DataGhost <support@dataghost.me>',
        to: [company.email],
        cc: [userEmail],
        subject: company.subject.replace(/{{name}}/g, fullName).replace(/{{fullName}}/g, fullName).replace(/{{city}}/g, city).replace(/{{state}}/g, state),
        text: company.body.replace(/{{name}}/g, fullName).replace(/{{city}}/g, city).replace(/{{state}}/g, state).replace(/{{email}}/g, userEmail).replace(/{{age_range}}/g, ageRange),
    }));

    if (batchEmails.length > 0) {
        const { error } = await resend.batch.send(batchEmails);
        if (error) throw new Error(`Batch Email Failed: ${error.message}`);
        console.log(`Batch successfully sent ${batchEmails.length} emails.`);
    }

    const attachments = checklistPdfBuffer ? [{ content: checklistPdfBuffer, filename: 'DataGhost_Manual_Removal_Checklist.pdf' }] : [];

    try {
        await resend.emails.send({
            from: 'DataGhost <support@dataghost.me>',
            to: [userEmail],
            subject: 'Protocol Initiated: Your removal requests have been sent',
            text: `We just blasted ${companies.length} opt-out requests on your behalf.\n\nOur Ghost Worker is now processing form-based submissions in the background (e.g., BeenVerified, Whitepages).\n\nYou'll receive CCs from each data broker as they process your removal (usually within 7-45 days).\n\n${checklistPdfBuffer ? 'Attached is your manual removal checklist for brokers requiring specific forms.\n\n' : ''}You're now being ghosted. 👻\n\n- The DataGhost Team`,
            attachments,
        });
    } catch (finalErr) {
        console.error('Confirmation email failed, but batch likely sent:', finalErr);
    }
}

export async function sendVerificationEmail(email: string, code: string) {
    if (!resend) return;
    await resend.emails.send({
        from: 'DataGhost <support@dataghost.me>',
        to: [email],
        subject: 'Your Verification Code',
        html: `<!DOCTYPE html><html><body><h2>Your Verification Code</h2><p>Your verification code is: <strong>${code}</strong></p><p>This code will expire in 30 minutes.</p></body></html>`,
        text: `Your Verification Code: ${code}`
    });
}