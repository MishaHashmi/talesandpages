import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useNavigate } from '@remix-run/react';
import ReactMarkdown from 'react-markdown';
import { verifyToken } from "~/utils/token";
import SlideMenu from '~/components/menu';

export async function loader({ request }) {
    const cookieHeader = request.headers.get("Cookie");
    if (cookieHeader) {
        const cookies = Object.fromEntries(cookieHeader.split('; ').map(cookie => {
            const [name, value] = cookie.split('=');
            return [name, decodeURIComponent(value)];
        }));
        const authCookie = cookies['authToken'];
        const user = verifyToken(authCookie, import.meta.env.VITE_JWT_SECRET);
        return { user: user.email, username: user.username };
    } else {
        return { user: null, username: null };
    }
}

export default function Archive() {
    const { user, username } = useLoaderData();
    const [selectedStory, setSelectedStory] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStories = async () => {
            setLoading(true);
            try {
                const response = await fetch('/archive', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ call: 'retrieve' }),
                    credentials: 'include',
                });
                if (response.ok) {
                    const storiesData = await response.json();
                    console.log("tales",storiesData);
                    setStories(storiesData);
                    
                }
            } catch (error) {
                console.error('Error in fetch:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStories();
        }
    }, [user]);

    const formatText = (text) => (
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

    const handleGenerateImages = (storyId) => {
        navigate(`/stories/${storyId}/generate-images`);
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
            <SlideMenu username={username} user={user} />
            <h1 className="text-2xl text-center text-amber-200 dark:text-amber-300">Tales</h1>
            <h2 className="text-1xl text-center font-bold text-red-200 dark:text-red-300">{username}</h2>
            <div className="flex flex-col md:flex-row mt-4">
                <div className="flex-shrink-0 p-4 md:w-1/3 border-b md:border-b-0 md:border-r border-gray-300">
                    <h3 className="text-lg font-bold text-sky-200 dark:text-sky-300 mb-2">Your Tales</h3>
                    {loading ? (
                        <p className="text-gray-600 dark:text-gray-400">Loading saved tales...</p>
                    ) : (
                        stories.length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400">No tales found in your archive.</p>
                        ) : (
                            <ul className="space-y-2">
                                {stories.map((story) => (
                                    <li key={story.id} className="p-2 border rounded-md border-sky-300">
                                        <p onClick={() => setSelectedStory(story)} className="cursor-pointer text-sky-300">{story.title}</p>
                                        <button onClick={() => handleGenerateImages(story.id)} className="text-sm text-sky-300 hover:underline">Generate Images</button>
                                    </li>
                                ))}
                            </ul>
                        )
                    )}
                </div>

                <div className="p-4 md:w-2/3">
                    {selectedStory ? (
                        <>
                            <h3 className="text-1xl py-4 font-bold text-center text-white bg-red-200 mb-4">{selectedStory.title}</h3>
                            <p className="text-1xl text-sky-300">{formatText(selectedStory.story)}</p>
                        </>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400 mt-8">Select a story to view its content</p>
                    )}
                </div>
            </div>
        </div>
    );
}
