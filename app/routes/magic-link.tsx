import { verifyToken } from "~/utils/token.server";
import { createEmptySession, commitSession } from "~/sessions";
import { getUserOrCreate } from "~/utils/auth.out";

export async function loader({ request }: { request: Request }): Promise<Response> {
  try {
    const url = new URL(request.url);
  
    const token = url.searchParams.get("token");
 

    if (token) {
      const secret = import.meta.env.VITE_SESSION_SECRET;
      if (!secret) {
        console.error("SESSION_SECRET is not defined");
        return Response.redirect("/login?status=error", 302);
      }

      const payload = verifyToken(token, secret);

      if (payload && payload.email) {

        const user = await getUserOrCreate(payload.email);
        const username = user.username; 

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

