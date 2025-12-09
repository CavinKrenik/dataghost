import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

// Helper to strictly respect rate limits (Sleep function)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    companies: Array<{
        name: string;
        email: string;
        subject: string;
        body: string;
    }>;
    checklistPdfBuffer?: Buffer;
}) {

    if (!resend) {
        console.error('Resend API Key missing. Skipping email send.');
        return;
    }

    let sentCount = 0;
    let errorCount = 0;

    // FIX 1: Sequential Loop to respect the 2 req/s limit.
    for (const company of companies) {
        try {
            const personalizedSubject = company.subject
                .replace(/{{name}}/g, fullName)
                .replace(/{{fullName}}/g, fullName)
                .replace(/{{city}}/g, city)
                .replace(/{{state}}/g, state);

            const personalizedBody = company.body
                .replace(/{{name}}/g, fullName)
                .replace(/{{city}}/g, city)
                .replace(/{{state}}/g, state)
                .replace(/{{email}}/g, userEmail)
                .replace(/{{age_range}}/g, ageRange);

            // FIX 2: Changed 'noreply' to 'support' to increase deliverability trust.
            await resend.emails.send({
                from: 'DataGhost <support@dataghost.me>',
                to: [company.email],
                cc: [userEmail],
                subject: personalizedSubject,
                text: personalizedBody,
            });

            sentCount++;

            // FIX 3: Wait 600ms between sends (approx 1.6 req/s).
            await wait(600);

        } catch (err) {
            console.error(`Failed to send to ${company.name}:`, err);
            errorCount++;
            // Cool down on error
            await wait(1000);
        }
    }

    // Final Confirmation Email to User
    const attachments = checklistPdfBuffer ? [{
        content: checklistPdfBuffer,
        filename: 'DataGhost_Manual_Removal_Checklist.pdf',
    }] : [];

    try {
        await resend.emails.send({
            from: 'DataGhost <support@dataghost.me>', // Updated here too
            to: [userEmail],
            subject: 'Protocol Initiated: Your removal requests have been sent',
            text: `We just blasted ${sentCount} opt-out requests on your behalf.\n\nOur Ghost Worker is now processing form-based submissions in the background (e.g., BeenVerified, Whitepages).\n\nYou'll receive CCs from each data broker as they process your removal (usually within 7-45 days).\n\n${checklistPdfBuffer ? 'Attached is your manual removal checklist for brokers requiring specific forms.\n\n' : ''}You're now being ghosted. 👻\n\n- The DataGhost Team`,
            attachments,
        });
    } catch (finalErr) {
        console.error('Failed to send confirmation email:', finalErr);
    }
}

export async function sendVerificationEmail(email: string, code: string) {
    if (!resend) return;

    await resend.emails.send({
        from: 'DataGhost <support@dataghost.me>', // Updated here too
        to: [email],
        subject: 'Your Verification Code',
        html: `
      <!DOCTYPE html>
      <html>
      <body>
          <h2>Your Verification Code</h2>
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
      </body>
      </html>
    `,
        text: `Your Verification Code\n\nYour verification code is: ${code}\n\nThis code will expire in 30 minutes.\n\nIf you didn't request this code, please ignore this email.`
    });
}