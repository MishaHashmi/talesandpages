import React, { useState } from 'react';
import { useLoaderData, Link } from '@remix-run/react';
import { getSession } from "~/sessions"; 
import ReactMarkdown from 'react-markdown';

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
  const [generatedText, setgeneratedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  

  const prompts = [
    "A dragon and a cat discussing metaphysics on the beach.",
    "Recipe a cat will use to make biscuits.",
    "Artist cat exhibits a masterpiece to her alley friends.",
    "Dialogue between two black cats of a witch at midnight on a full moon.",
    "Dragon raises a handful of mischievous kittens."
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setgeneratedText(null); // Reset previous response

    const response = await fetch('/generate-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: selectedPrompt }),
    });

    if (response.ok) {
      const result = await response.json();
      setgeneratedText(result.response);
    } else {
      console.error('Failed to generate text');
    }
    setLoading(false);
  };

  const formatText = (text) => {
    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-3xl font-bold text-rose-300">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-semibold text-rose-300">{children}</h2>,
          h3: ({ children }) => <h3 className="text-1xl font-semibold text-rose-300">{children}</h3>,
          strong: ({ children }) => <strong className="font-bold text-rose-300">{children}</strong>,
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };
  

  if (!user) {
    return (
      <div>
        <h1 className="text-2xl text-center text-sky-200 dark:text-sky-300">Login to view dashboard</h1>
        <Link to="/login" className="block text-center text-rose-200 dark:text-rose-300">Login</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl text-center text-amber-200 dark:text-amber-300">Welcome to your dashboard!</h1>
      <h2 className="text-1xl text-center font-bold text-sky-200 dark:text-sky-300">{username}</h2>
      <p className="text-center font-bold text-sky-200 dark:text-sky-300">{user}</p>
      <Link to="/logout" className="block text-center text-rose-300">Logout</Link>

      <h2 className="text-2xl text-center text-amber-200 dark:text-amber-300 mt-6">You can select a prompt to generate your story.</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center space-y-4 m-4">
        <div className="flex sm:flex-row flex-col justify-center gap-4 mb-4">
          {prompts.map((p, index) => (
            <div
              key={index}
              onClick={() => setSelectedPrompt(p)}
              className={`w-full max-w-sm p-4 text-center border-2 border-sky-200 dark:border-sky-300 rounded-lg font-semibold cursor-pointer ${
                selectedPrompt === p ? 'bg-sky-200 dark:bg-sky-300 text-white' : 'bg-white dark:bg-gray-800 text-sky-200 dark:text-sky-300'
              } hover:bg-sky-200 dark:hover:bg-sky-300 hover:text-white focus:outline-none`}
            >
              {p}
            </div>
          ))}
        </div>

        <input type="hidden" name="prompt" value={selectedPrompt} />

        <button
          type="submit"
          disabled={!selectedPrompt} 
          className={`w-full max-w-xs px-4 py-2 bg-sky-200 dark:bg-sky-300 text-white font-semibold rounded-lg hover:bg-amber-200 dark:hover:bg-amber-300 focus:outline-none ${
            !selectedPrompt ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Generate
        </button>
      </form>

      {loading && (
        <div className="flex justify-center">
          <svg className="w-16 h-16 stroke-red-200 dark:stroke-rose-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <circle fill="none" strokeOpacity="1" strokeWidth=".5" cx="100" cy="100" r="0">
              <animate attributeName="r" calcMode="spline" dur="2" values="1;80" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
              <animate attributeName="stroke-width" calcMode="spline" dur="2" values="0;25" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
              <animate attributeName="stroke-opacity" calcMode="spline" dur="2" values="1;0" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
            </circle>
          </svg>
        </div>
      )}

      {generatedText && (
        <div className="mt-4 p-4 mx-4 border border-amber-200 mb-24">
          <h3 className="text-1xl py-4 text-center font-bold text-white bg-red-200 dark:bg-red-300 mb-6">{selectedPrompt}</h3>
          
          <div className="text-1xl text-sky-300">{formatText(generatedText)}
          </div>
        </div>
      )}
    </div>
  );
}
