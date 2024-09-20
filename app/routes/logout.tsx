import { destroySession } from "~/sessions";

export async function loader({ request }: { request: Request }): Promise<Response> {
  const cookieHeader = request.headers.get("Cookie");
  
  // Destroy the session
  const sessionCookie = await destroySession();

  // Redirect to the login page or dashboard after logout
  return new Response(null, {
    headers: {
      "Set-Cookie": sessionCookie,
      Location: "/", // Redirect to the home page or login
    },
    status: 302,
  });
}
