import { createToken } from "./token.server";
import { sendEmail } from "./email.server";


export async function sendMagicLink(email: string) {
  const secret = import.meta.env.VITE_SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not defined");
  }

  // Use the database server to find or create the user
  // const user = await getUserOrCreate(email);
  const token = createToken({ email: email}, secret);
  const magicLink = `https://talesandpages.com/magiclink?token=${token}`;

  

  await sendEmail({
    to: email,
    subject: "Login to Tales and Pages",
    html: `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; max-width:600px;">
        <h1 style="text-align:center; background-color:#fde68a; color: white; padding: 40px 60px; margin-bottom:0;">
            Tales and Pages
        </h1>

        <div style="background-color:#bae6fd; padding: 60px 20px;">
            <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                    <td style="background-color:white; padding:10px; text-align:center;">
                        <a href="${magicLink}" style="text-decoration:none; color:#bae6fd; font-weight:900; background-color:white; border:1px solid white; padding:5px 15px; display:inline-block;">
                            Log In
                        </a>
                    </td>
                </tr>
            </table>

            <!-- Centered text -->
            <p style="text-align:center; color: white; margin-top:30px;">
                We heard you wanted to login, so we have sent you a link.
            </p>
        </div>
    </div>

    `,
  });
}
