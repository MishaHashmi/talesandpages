export async function loader({ request }: { request: Request }): Promise<Response> {
  const cookieHeader = request.headers.get("Cookie");

  
  const cookies = Object.fromEntries(cookieHeader?.split("; ").map(cookie => {
    const [name, value] = cookie.split("=");
    return [name, decodeURIComponent(value)];
  }) || []);

  
  if (cookies.session) {
    return new Response(null, {
      headers: {
        "Set-Cookie": `session=; Max-Age=-1; Path=/; Secure; SameSite=Lax`,
        Location: "/", // Redirect to the home page or login
      },
      status: 302,
    });
  }

  
  return new Response(null, {
    headers: {
      Location: "/", 
    },
    status: 302,
  });
}
