import { Resend } from 'resend';

// Initialize Resend with key if available, otherwise undefined
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
    companies: Array<{
        name: string;
        email: string;
        subject: string;
        body: string;
    }>;
    checklistPdfBuffer?: Buffer;
}) {
    console.log(`[Email Service] Attempting to send ${companies.length} opt-out emails for ${userEmail}`);

    if (!resend) {
        console.warn('[Email Service] RESEND_API_KEY is not set. Skipping actual email sending (Dev Mode).');
        console.log('[Email Service] Should send opt-out emails to:', companies.map(c => c.name).join(', '));
        console.log('[Email Service] Should send confirmation to user:', userEmail);
        return;
    }

    // We will batch these slightly to avoid hitting Resend rate limits too hard if the list is huge,
    // but Resend handles this well. The user prompt loop is fine.

    for (const company of companies) {
        const personalizedSubject = company.subject
            .replace(/{{name}}/g, fullName)
            .replace(/{{city}}/g, city)
            .replace(/{{state}}/g, state);

        const personalizedBody = company.body
            .replace(/{{name}}/g, fullName)
            .replace(/{{city}}/g, city)
            .replace(/{{state}}/g, state)
            .replace(/{{email}}/g, userEmail)
            .replace(/{{age_range}}/g, ageRange);

        // Filter out empty params if any replacement failed or wasn't needed

        await resend.emails.send({
            from: 'DataGhost <noreply@dataghost.me>',
            to: [company.email],
            cc: [userEmail], // transparency CC
            subject: personalizedSubject,
            text: personalizedBody,
        });

        // Small delay to be safe, though not strictly required by Resend SDK
        await new Promise(resolve => setTimeout(resolve, 100)); // 100ms
    }

    // After all emails are sent, also send the confirmation/report email to the user
    const attachments = checklistPdfBuffer ? [{
        content: checklistPdfBuffer,
        filename: 'DataGhost_Manual_Removal_Checklist.pdf',
    }] : [];

    await resend.emails.send({
        from: 'DataGhost <noreply@dataghost.me>',
        to: [userEmail],
        subject: 'Your DataGhost removal requests have been sent!',
        text: `We just blasted ${companies.length} opt-out requests on your behalf.\n\nYou'll receive CCs from each data broker as they process your removal (usually within 7-45 days).\n\nWe'll re-scan and re-send for 45 days if anything pops back up.\n\n${checklistPdfBuffer ? 'We have also attached a manual removal checklist for the brokers that require form submissions.\n\n' : ''}You're now being ghosted. 👻\n\n- The DataGhost Team`,
        attachments,
    });
}

export async function sendVerificationEmail(email: string, code: string) {
    console.log(`[Email Service] Attempting to send verification code to ${email}`);

    if (!resend) {
        console.warn('[Email Service] RESEND_API_KEY is not set. Skipping actual email sending (Dev Mode).');
        console.log(`[Email Service] Verification Code for ${email} is: ${code}`);
        return;
    }

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
