import { verifyToken } from "~/utils/token.server";
import { createSession } from "~/sessions";

export async function loader(request: Request): Promise<Response> {
  try {
    // Extract query parameters from the URL
    console.log("req: ",request.request.url);
    const url = new URL(request.request.url);
    console.log("URL:         ",url);
    const token = url.searchParams.get("token");
    console.log("token:         ",token);

    if (token) {
      // Retrieve secret from environment variables
      const secret = import.meta.env.VITE_SESSION_SECRET;
      if (!secret) {
        console.error("SESSION_SECRET is not defined");
        return Response.redirect("/login?status=error", 302);
      }

      // Verify token and create a session if valid
      const payload = verifyToken(token, secret);

      if (payload && payload.email) {
        console.log("magic-link: ", payload);
        return createSession(payload.email, "/dashboard");
      }
    }

    return Response.redirect("/login?status=invalid", 302);

  } catch (error) {
    console.error("Error in loader:", error);
    return Response.redirect("/login?status=error", 302);
  }
}
