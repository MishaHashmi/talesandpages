import { createToken } from "./token.server";
import { sendEmail } from "./email.server";

export async function sendMagicLink(email: string) {
  const secret = import.meta.env.VITE_SESSION_SECRET;
  console.log("auth.server secret:", secret);
  if (!secret) {
    throw new Error("SESSION_SECRET is not defined");
  }

  // Ensure valid email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Invalid email format");
  }

  const token = createToken({ email }, secret);
  const magicLink = `https://talesandpages.com/magic-link?token=${token}`;

  console.log("Generated Magic Link:", magicLink); // Debugging log

  await sendEmail({
    to: email,
    subject: "Your Magic Login Link",
    text: `Click the link to log in: ${magicLink}`,
  });
}
