import { verifyToken } from "~/utils/token.server";
// import { createEmptySession, commitSession } from "~/sessions";
import { getUserOrCreate } from "~/utils/auth.out";

export async function loader({ request }: { request: Request }): Promise<Response> {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (token) {
      const secret = import.meta.env.VITE_SESSION_SECRET;
      if (!secret) {
        console.error("SESSION_SECRET is not defined");
        return new Response("Error: SESSION_SECRET is not defined", {
          status: 400,
          headers: { "Content-Type": "text/plain" },
        });
      }

      const payload = verifyToken(token, secret);

      if (payload && payload.email) {
        const user = await getUserOrCreate(payload.email);
        const username = user.username;

        // Log the user details before redirecting
        console.log("User:", user);

        // Create a session with email and username
        const session = createEmptySession();
        session.set("user", payload.email);
        session.set("username", username);

        // Add a delay to ensure logs appear in the console before redirect
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2-second delay

        return new Response(null, {
          headers: {
            // "Set-Cookie": await commitSession(session),
            "Location": "/dashboard",
          },
          status: 302,
        });
      }
    }

    return new Response("Error: Invalid token", {
      status: 400,
      headers: { "Content-Type": "text/plain" },
    });

  } catch (error) {
    console.error("Error in loader:", error);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Add a delay for error logging
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
