import { useLoaderData } from "@remix-run/react";import { useLoaderData, Link } from "@remix-run/react";
import { getSession } from "~/sessions";

export async function loader({ request }: { request: Request }): Promise<Response> {
  const cookieHeader = request.headers.get("Cookie");
  // console.log("dashboard cookie: ", cookieHeader);
  const session = await getSession(cookieHeader);
  // console.log("dashboard session: ", session);
  const user = session.get("user");
  // console.log("dashboard user: ", user);
  const username = session.get("username");

  // If user is not authenticated, just return a response indicating that
  if (!user) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ user, username }), {
    headers: { "Content-Type": "application/json" },
  });
}

export default function Dashboard() {
  const { user, username } = useLoaderData<{ user: string; username: string }>();

  if (!user) {
    return (
      <div>
        <h1 className="text-2xl text-center text-orange-200">Login to view dashboard</h1>
        <Link to="/login" className="block text-center text-green-300">Login</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl text-center text-orange-200">Welcome to your dashboard!</h1>
      <h2 className="text-1xl text-center font-bold text-sky-200">{username}</h2>
      <p className="text-center font-bold text-sky-200">{user}</p>
      <Link to="/logout" className="block text-center text-red-300">Logout</Link>
    </div>
  );
}
