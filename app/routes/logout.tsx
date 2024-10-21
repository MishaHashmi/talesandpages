export async function loader({ request }: { request: Request }): Promise<Response> {
  const cookieHeader = request.headers.get("Cookie");

  // Parse the existing cookies to retrieve the session cookie
  const cookies = Object.fromEntries(cookieHeader?.split("; ").map(cookie => {
    const [name, value] = cookie.split("=");
    return [name, decodeURIComponent(value)];
  }) || []);

  // If the session cookie exists, expire it by setting Max-Age to -1
  if (cookies.session) {
    return new Response(null, {
      headers: {
        "Set-Cookie": `session=; Max-Age=-1; Path=/; Secure; SameSite=Lax`,
        Location: "/", // Redirect to the home page or login
      },
      status: 302,
    });
  }

  // If no session cookie is found, simply redirect to the home page
  return new Response(null, {
    headers: {
      Location: "/", // Redirect to the home page or login
    },
    status: 302,
  });
}
