import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendRemovalEmail({
  to,
  cc,
  subject,
  html,
}: {
  to: string;
  cc?: string;
  subject: string;
  html: string;
}) {
  await resend.emails.send({
    from: "DataGhost Removals <noreply@dataghost.me>",
    to,
    cc: cc || undefined,
    subject,
    html,
  });
}
