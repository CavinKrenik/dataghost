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
    companies: Array<{
        name: string;
        email: string;
        subject: string;
        body: string;
    }>;
    checklistPdfBuffer?: Buffer;
}) {

    if (!resend) {
        // THROW ERROR instead of just logging
        throw new Error('Resend API Key missing. Skipping email send.');
    }

    // 1. Prepare the Batch (Instant processing)
    // We map the companies to an array of email objects.
    const batchEmails = companies.map((company) => {
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

        return {
            from: 'DataGhost <support@dataghost.me>',
            to: [company.email],
            cc: [userEmail], // User gets a copy
            subject: personalizedSubject,
            text: personalizedBody,
        };
    });

    if (batchEmails.length > 0) {
        try {
            // 2. Send Batch (One single API call, <2 seconds)
            // This avoids the 40s loop and fixes the 502 Timeout.
            const { data, error } = await resend.batch.send(batchEmails);

            if (error) {
                console.error('Batch Email Error:', error);
                // THROW ERROR to notify caller
                throw new Error(`Batch Email Failed: ${error.message}`);
            } else {
                console.log(`Batch successfully sent ${batchEmails.length} emails.`);
            }

        } catch (err) {
            console.error('Failed to send batch emails:', err);
            // RE-THROW ERROR
            throw err;
        }
    }

    // 3. Send Final Confirmation to User (Separate single call)
    // Only this email gets the PDF attachment (if any)
    const attachments = checklistPdfBuffer ? [{
        content: checklistPdfBuffer,
        filename: 'DataGhost_Manual_Removal_Checklist.pdf',
    }] : [];

    try {
        const { error } = await resend.emails.send({
            from: 'DataGhost <support@dataghost.me>',
            to: [userEmail],
            subject: 'Protocol Initiated: Your removal requests have been sent',
            text: `We just blasted ${companies.length} opt-out requests on your behalf.\n\nOur Ghost Worker is now processing form-based submissions in the background (e.g., BeenVerified, Whitepages).\n\nYou'll receive CCs from each data broker as they process your removal (usually within 7-45 days).\n\n${checklistPdfBuffer ? 'Attached is your manual removal checklist for brokers requiring specific forms.\n\n' : ''}You're now being ghosted. 👻\n\n- The DataGhost Team`,
            attachments,
        });

        if (error) throw error;

    } catch (finalErr) {
        console.error('Failed to send confirmation email:', finalErr);
        // We might choose NOT to throw here if the batch sent successfully,
        // but for strictness, we can throw. 
        // For now, let's allow confirmation failure if batch succeeded, 
        // OR throw to be safe. Let's throw.
        throw finalErr;
    }
}

export async function sendVerificationEmail(email: string, code: string) {
    if (!resend) throw new Error('Resend API missing');

    const { error } = await resend.emails.send({
        from: 'DataGhost <support@dataghost.me>',
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

    if (error) throw error;
}