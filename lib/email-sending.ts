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

    // FIX: Sequential Loop instead of Promise.all
    // We send 1 email at a time to strictly respect the 2 req/s limit.
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

            await resend.emails.send({
                from: 'DataGhost <noreply@dataghost.me>',
                to: [company.email],
                cc: [userEmail], // User gets a copy for their records
                subject: personalizedSubject,
                text: personalizedBody,
            });

            sentCount++;

            // CRITICAL: Wait 600ms between sends.
            // 1000ms / 600ms = ~1.66 requests per second (Safe under the 2 req/s limit)
            await wait(600);

        } catch (err) {
            console.error(`Failed to send to ${company.name}:`, err);
            errorCount++;
            // If we hit an error (even rate limit), wait a bit longer to cool down
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
            from: 'DataGhost <noreply@dataghost.me>',
            to: [userEmail],
            subject: 'Protocol Initiated: Your removal requests have been sent',
            text: `We just blasted ${sentCount} opt-out requests on your behalf.\n\nOur Ghost Worker is now processing form-based submissions in the background (e.g., BeenVerified, Whitepages).\n\nYou'll receive CCs from each data broker as they process your removal (usually within 7-45 days).\n\nYou're now being ghosted. 👻\n\n- The DataGhost Team`,
            attachments,
        });
    } catch (finalErr) {
        console.error('Failed to send confirmation email:', finalErr);
    }
}

export async function sendVerificationEmail(email: string, code: string) {
    if (!resend) return;

    await resend.emails.send({
        from: 'DataGhost <noreply@dataghost.me>',
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