// app/routes/dashboard.tsx

import { LoaderFunction, redirect } from "@remix-run/node";
import { getSession } from "~/sessions";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  // Get the session from cookies
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  console.log("dashboard session: ", session);

  // Check if the user is authenticated (i.e., if a "user" is stored in the session)
  const user = session?.data["user"];
  console.log("dashboard user: ", user);

  if (!user) {
    return redirect("/login");
  }

  // Return the user data to be used in the component
  return { user };
};

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
