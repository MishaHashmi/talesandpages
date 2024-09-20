import { Form, useSearchParams } from "@remix-run/react";
import { sendMagicLink } from "~/utils/auth.server";
import { useEffect, useState } from "react";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (typeof email === "string") {
    try {
      await sendMagicLink(email);
      return new Response(null, { status: 302, headers: { Location: "/login?status=success" } });
    } catch (error) {
      console.error("Error sending magic link:", error);
      return new Response(null, { status: 302, headers: { Location: "/login?status=error" } });
    }
  }

  return new Response(null, { status: 302, headers: { Location: "/login?status=invalid" } });
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "error") {
      setMessage("There was an error sending the magic link. Please try again.");
    } else if (status === "invalid") {
      setMessage("Please enter a valid email address.");
    } else if (status === "success") {
      setEmail(""); // Clear the email input
      setMessage("Email sent. Check your inbox for Log In.");
    } else {
      setMessage(""); // Clear the message if no status
    }
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <div className="text-2xl text-center text-orange-200">Log In</div>
      {message && <div className={`mb-2 text-center ${status === "success" ? "text-green-200" : "text-red-200"}`}>{message}</div>}
      <Form method="post" className="flex flex-row sm:flex-col items-center justify-center space-y-4 mb-4">
        
        
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          required
          className="placeholder-sky-200 text-orange-200 w-full max-w-xs px-4 py-2 border-b-2 border-orange-200 focus:outline-none focus:border-b-sky-200"
        />
        <button
          type="submit"
          className="w-full max-w-xs px-4 py-2 bg-sky-200 text-white font-semibold rounded-lg hover:bg-orange-200 focus:outline-none"
        >
          Send Magic Link
        </button>
      </Form>
    </div>
  );
}
