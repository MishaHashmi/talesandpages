import { createToken } from "./token.server";
import { sendEmail } from "./email.server";
import { getUserOrCreate } from './database.server'; // Use the database server for user lookup

export async function sendMagicLink(email: string) {
  const secret = import.meta.env.VITE_SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not defined");
  }

  // Use the database server to find or create the user
  const user = await getUserOrCreate(email);

  // Create a token with the user's email
  const token = createToken({ email: user.email }, secret);
  const magicLink = `https://talesandpages.com/magic-link?token=${token}`;

  console.log("Generated Magic Link:", magicLink); // Debugging log

  await sendEmail({
    to: email,
    subject: "Your Magic Login Link",
    text: `Click the link to log in: ${magicLink}`,
  });
}
