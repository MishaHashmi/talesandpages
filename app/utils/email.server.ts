import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
  await resend.emails.send({
    from: 'login@talesandpages.com', 
    to: [to],
    subject,
    html,
  });
}
  