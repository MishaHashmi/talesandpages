import { verifyToken } from "~/utils/token";
import { useLoaderData } from '@remix-run/react';
import React from 'react';

export async function loader({ request }) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (token) {
    const secret = import.meta.env.VITE_SESSION_SECRET;
    if (!secret) {
      return new Response(null, { status: 400 });
    }

    const payload = verifyToken(token, secret);

    if (payload && payload.email) {
      return { payload, email: payload.email };
    }
  }

  return new Response(null, { status: 400 });
}

export default function Magiclink() {
  const { payload, email } = useLoaderData();

 
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          // If the response is successful, you can handle a redirect or state update here
          window.location.href = "/dashboard"; // Redirect to dashboard
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error in fetch:', error);
      }
    };

    fetchUser();
  }, [email]); 

  return (
    <div>
      <h1 className="text-2xl text-center text-sky-200 dark:text-sky-300">Processing your magic link...</h1>
      
    </div>
  );
}
