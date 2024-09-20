import { verifyToken } from "~/utils/token.server";
import { createEmptySession, commitSession } from "~/sessions";
import { getUserOrCreate } from "~/utils/database.server"; // Adjust the import path as necessary

export async function loader({ request }: { request: Request }): Promise<Response> {
  try {
    // console.log("magic-link request ", request);
    const url = new URL(request.url);
    // console.log("magic-link url ", url);
    const token = url.searchParams.get("token");
    // console.log("magic-link token: ", token);

    if (token) {
      const secret = import.meta.env.VITE_SESSION_SECRET;
      if (!secret) {
        console.error("SESSION_SECRET is not defined");
        return Response.redirect("/login?status=error", 302);
      }

      const payload = verifyToken(token, secret);

      if (payload && payload.email) {
        // Use database.server to get or create the user
        const user = await getUserOrCreate(payload.email);
        const username = user.username; // Adjust based on how your user object is structured

        // Create a session with email and username
        const session = createEmptySession();
        session.set("user", payload.email);
        session.set("username", username);

        return new Response(null, {
          headers: {
            "Set-Cookie": await commitSession(session),
            "Location": "/dashboard",
          },
          status: 302,
        });
      }
    }

    return Response.redirect("/login?status=invalid", 302);

  } catch (error) {
    console.error("Error in loader:", error);
    return Response.redirect("/login?status=error", 302);
  }
}

