// text-generation.js
export async function onRequest(context) {
    const { request, env } = context;
    const body = await request.json(); 

    const { prompt } = body;

    if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const formattedPrompt = `Write a whimsical, friendly and cute story in markdown formatting. Follow the markdown formatting consistently. Begin stories immediately wihthout any preamble. Do not end the story suddenly. Your prompt is: ${prompt}`;

        const stream = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            prompt: formattedPrompt,
            stream: true,
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/event-stream' },
        });

    } catch (error) {
        console.error('Text generation failed:', error);
        return new Response(JSON.stringify({ error: 'Text generation failed: ' + error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
