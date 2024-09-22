import React, { useState } from 'react';
import { useLoaderData, Link } from '@remix-run/react';
import { getSession } from "~/sessions"; // Ensure this is compatible with Cloudflare

// Loader function remains the same
export async function loader({ request }) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const user = session.get("user");
  const username = session.get("username");

  return { user, username }; // Return plain object instead of using json
}

export default function Dashboard() {
  const { user, username } = useLoaderData();
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const prompts = [
    "A short story about an orange cat on a vacation.",
    "Recipe a cat will use to make biscuits.",
    "Dialogue between two black cats of a witch."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedResponse(null); // Reset previous response

    const response = await fetch('/generate-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: selectedPrompt }),
    });

    if (response.ok) {
      const result = await response.json();
      setGeneratedResponse(result.response);
    } else {
      console.error('Failed to generate text');
    }
    setLoading(false);
  };

  const formatResponse = (response) => {
    const parts = response.split(/(\*\*.*?\*\*|".*?"|\d+\.\s?)/g);
  
    return parts.map((part, index) => {
      if (part.match(/\*\*.*?\*\*/)) {
        const boldText = part.replace(/\*\*(.*?)\*\*/, '$1');
        return (
          <React.Fragment key={index}>
            <br />
            <strong className="text-red-200">{boldText}</strong>
            <br />
          </React.Fragment>
        );
      }
      
      if (part.match(/".*?"/)) {
        return (
          <React.Fragment key={index}>
            <strong>{part}</strong>
          </React.Fragment>
        );
      }

      if (part.match(/^\d+\.\s/)) {
        return (
          <React.Fragment key={index}>
            <br />
            <span className="ml-4">{part}</span>
          </React.Fragment>
        );
      }
  
      return part; // Return normal text
    });
  };

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

      <h2 className="text-2xl text-center text-orange-200 mt-6">You can select a prompt to generate your story.</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-4 m-4">
        <div className="flex sm:flex-row flex-col justify-center gap-4 mb-4">
          {prompts.map((p, index) => (
            <div
              key={index}
              onClick={() => setSelectedPrompt(p)}
              className={`w-full max-w-sm p-4 text-center border-2 border-sky-200 rounded-lg font-semibold cursor-pointer ${
                selectedPrompt === p ? 'bg-sky-200 text-white' : 'bg-white text-sky-200'
              } hover:bg-sky-200 hover:text-white focus:outline-none`}
            >
              {p}
            </div>
          ))}
        </div>

        <input type="hidden" name="prompt" value={selectedPrompt} />

        <button
          type="submit"
          disabled={!selectedPrompt} 
          className={`w-full max-w-xs px-4 py-2 bg-sky-200 text-white font-semibold rounded-lg hover:bg-orange-200 focus:outline-none ${
            !selectedPrompt ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Generate
        </button>
      </form>

      {loading && (
        <div className="flex justify-center">
          <svg className="w-16 h-16 stroke-red-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <circle fill="none" strokeOpacity="1" strokeWidth=".5" cx="100" cy="100" r="0">
              <animate attributeName="r" calcMode="spline" dur="2" values="1;80" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
              <animate attributeName="stroke-width" calcMode="spline" dur="2" values="0;25" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
              <animate attributeName="stroke-opacity" calcMode="spline" dur="2" values="1;0" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
            </circle>
          </svg>
        </div>
      )}

      {generatedResponse && (
        <div className="mt-4 p-4 mx-16 border border-orange-200">
          <h3 className="text-1xl py-4 text-center font-bold text-red-200">{selectedPrompt}</h3>
          <p className="text-1xl text-sky-200">{formatResponse(generatedResponse)}</p>
        </div>
      )}
    </div>
  );
}
