import { Resend } from 'resend';
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
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

    if (!resend) {

        return;
    }
    const batches = chunkArray(companies, 10);
    let sentCount = 0;
    let errorCount = 0;
    for (const batch of batches) {
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
                        cc: [userEmail],
                        subject: personalizedSubject,
                        text: personalizedBody,
                    });
                    sentCount++;
                } catch (err) {

                    errorCount++;
                }
            })
        );
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const attachments = checklistPdfBuffer ? [{
        content: checklistPdfBuffer,
        filename: 'DataGhost_Manual_Removal_Checklist.pdf',
    }] : [];
    await resend.emails.send({
        from: 'DataGhost <noreply@dataghost.me>',
        to: [userEmail],
        subject: 'Protocol Initiated: Your removal requests have been sent',
        text: `We just blasted ${sentCount} opt-out requests on your behalf.\n\nOur Ghost worker is now processing ${sentCount} form-based submissions in the background (e.g., BeenVerified, Whitepages).\n\n' : ''}You're now being ghosted. 👻\n\n- The DataGhost Team`,
        attachments,
    });
}
export async function sendVerificationEmail(email: string, code: string) {

    if (!resend) {

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
