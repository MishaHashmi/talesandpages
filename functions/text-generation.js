export async function onRequest(context) {
    const { request, env } = context;
    const body = await request.json(); // Get prompt from the request body

    const { prompt } = body;

    if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Create a formatted prompt that includes the role
        const formattedPrompt = `Write a whimsical, friendly and cute story in markdown formatting. Follow the markdown formatting consistently. Begin stories immediately wihthout any preamble. Your prompt is: ${prompt}`;

        // Call the Llama-3-1-8b-instruct model using the AI bindings
        const answer = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
            prompt: formattedPrompt, 
            max_tokens: 100,    // Limit the response length
            temperature: 0.5,
        });

        // Return the AI response
        return new Response(JSON.stringify(answer), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Text generation failed:', error); // Log the error for debugging
        return new Response(JSON.stringify({ error: 'Text generation failed: ' + error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
