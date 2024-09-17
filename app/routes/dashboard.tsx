import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/sessions";

export async function loader(request: Request): Promise<Response> {
  // Get the session from cookies

  // console.log(request);
  const cookieHeader = request.request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  

  // Check if the user is authenticated (i.e., if a "user" is stored in the session)
  const user = session?.data["user"];

  if (!user) {
    return Response.redirect("/login", 302);
  }

  // Return the user data to be used in the component
  return new Response(JSON.stringify({ user }), {
    headers: { "Content-Type": "application/json" },
  });
}

export default function Dashboard() {
  // Retrieve the user data from the loader
  const { user } = useLoaderData<{ user: string }>();

  return (
    <div>
      <div className="text-6xl text-center font-bold text-orange-200 transition ease-in-out delay-150 duration-1000 hover:text-teal-100 py-8">
        TALES AND PAGES
      </div>
      <h1 className="text-2xl text-center text-orange-200">Welcome to your dashboard!</h1>
      <h2 className="text-1xl text-center font-bold text-teal-100">{user}</h2>
    </div>
  );
}
