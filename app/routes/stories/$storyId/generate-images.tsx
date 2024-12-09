import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams } from '@remix-run/react';

export default function GenerateImages() {
    const { storyId } = useParams();
    const [story, setStory] = useState(null);
    const [chunks, setChunks] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await fetch(`/api/story/${storyId}`);
                if (response.ok) {
                    const storyData = await response.json();
                    setStory(storyData);
                }
            } catch (error) {
                console.error('Error fetching story:', error);
            }
        };
        fetchStory();
    }, [storyId]);

    const divideIntoChunks = () => {
        const chunked = story.content.split("\n\n"); // Adjust based on story format
        setChunks(chunked);
    };

    const generateImage = async (chunk) => {
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: chunk }),
            });
            const imageUrl = await response.text();
            setImages((prev) => [...prev, imageUrl]);
        } catch (error) {
            console.error('Error generating image:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl">Generate Images for: {story?.title}</h2>
            <button onClick={divideIntoChunks} className="mt-4">Divide Story</button>
            <div className="chunks">
                {chunks.map((chunk, index) => (
                    <div key={index}>
                        <p>{chunk}</p>
                        <button onClick={() => generateImage(chunk)}>Generate Image</button>
                        {images[index] && <img src={images[index]} alt={`Generated for chunk ${index}`} />}
                    </div>
                ))}
            </div>
        </div>
    );
}
