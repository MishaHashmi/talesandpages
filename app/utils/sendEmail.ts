import { createToken } from "./token.server";
import { Email } from "./email";
import { Resend } from 'resend';




export async function sendMagicLink(email: string) {
  const secret = import.meta.env.VITE_SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not defined");
  }

  console.log("sE email", email);

 
  const token = createToken({ email: email}, secret);
  const magicLink = `https://talesandpages.com/magiclink?token=${token}`;

  const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);
  
  
  await resend.emails.send({
    from: 'login@talesandpages.com',
    to: email,
    subject: 'Login to Tales and Pages',
    html:Email(magicLink),
  });
}
