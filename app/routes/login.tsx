import { Form, useSearchParams } from "@remix-run/react";
import { sendMagicLink } from "~/utils/sendEmail";
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
      setEmail(""); 
      setMessage("Email sent. Check your inbox for Log In.");
    } else {
      setMessage(""); 
    }
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <div className="text-2xl text-center text-orange-300 my-6">Log In</div>
      {message && <div className={`mb-2 text-center ${status === "success" ? "text-green-200" : "text-red-200"}`}>{message}</div>}
      <Form method="post" className="flex flex-col gap-2 items-center justify-center space-y-4 my-4">
        
        
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          required
          className="dark:bg-gray-800 placeholder-sky-200 dark:placeholder-sky-300 text-orange-200 dark:text-orange-300 rounded-none w-full max-w-xs px-4 py-2 border-b-2 border-orange-200 dark:border-orange-300 focus:outline-none focus:border-b-sky-200 dark:focus:border-b-sky-300"
        />
        <button
          type="submit"
          className="w-full max-w-xs px-4 py-2 bg-sky-200 dark:bg-sky-300 text-white dark:text-white font-semibold rounded-lg hover:bg-orange-200 dark:hover:bg-orange-300 focus:outline-none"
        >
          Send Magic Link
        </button>
      </Form>
    </div>
  );
}
