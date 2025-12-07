import { Resend } from 'resend';

// Initialize Resend with key if available, otherwise undefined
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

// Helper to batch arrays
function chunkArray<T>(array: T[], size: number): T[][] {
    const chunked: T[][] = [];
    let index = 0;
    while (index < array.length) {
        chunked.push(array.slice(index, index + size));
        index += size;
    }
    return chunked;
}

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
        return;
    }

    // BATCHING: Send 10 emails at once to prevent timeouts
    // 80 emails in batches of 10 = 8 "rounds".
    // 8 rounds * ~400ms = ~3.2 seconds total (vs 32 seconds serially).
    const batches = chunkArray(companies, 10);
    let sentCount = 0;
    let errorCount = 0;

    for (const batch of batches) {
        // Process this batch in parallel
        await Promise.all(
            batch.map(async (company) => {
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

                    await resend!.emails.send({
                        from: 'DataGhost <noreply@dataghost.me>',
                        to: [company.email],
                        cc: [userEmail], // transparency CC
                        subject: personalizedSubject,
                        text: personalizedBody,
                    });
                    sentCount++;
                } catch (err) {
                    console.error(`[Email Service] Failed to send to ${company.name}:`, err);
                    errorCount++;
                    // We catch errors here so one failure doesn't stop the whole batch
                }
            })
        );

        // Small delay between batches to be polite to the Resend API
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`[Email Service] Finished. Sent: ${sentCount}, Errors: ${errorCount}`);

    // Send final confirmation/report email to user
    const attachments = checklistPdfBuffer ? [{
        content: checklistPdfBuffer,
        filename: 'DataGhost_Manual_Removal_Checklist.pdf',
    }] : [];

    await resend.emails.send({
        from: 'DataGhost <noreply@dataghost.me>',
        to: [userEmail],
        subject: 'Protocol Initiated: Your removal requests have been sent',
        text: `We just blasted ${sentCount} opt-out requests on your behalf.\n\nYou'll receive CCs from each data broker as they process your removal (usually within 7-45 days).\n\nWe'll re-scan and re-send for 45 days if anything pops back up.\n\n${checklistPdfBuffer ? 'Attached is your manual removal checklist for brokers requiring specific forms.\n\n' : ''}You're now being ghosted. 👻\n\n- The DataGhost Team`,
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
