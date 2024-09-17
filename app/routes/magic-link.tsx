import { LoaderFunction, redirect } from "@remix-run/node";
import { verifyToken } from "~/utils/token.server";
import { createSession } from "~/sessions";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token) {
    const secret = import.meta.env.VITE_SESSION_SECRET;
    if (!secret) {
      console.error("SESSION_SECRET is not defined");
      return redirect("/login?status=error");
    }

    const payload = verifyToken(token, secret);
    

    if (payload && payload.email) {
      console.log("magic-link: ", payload);
      return createSession(payload.email, "/dashboard");
    }
  }

  return redirect("/login?status=invalid");
};
