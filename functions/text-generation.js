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
        // Create the messages array with roles and content
        const messages = [
            {
                role: "system",
                content: "Write whimsical, friendly and cute stories in markdown formatting. Follow the markdown formatting consistently. Begin stories immediately without any preamble."
            },
            {
                role: "user",
                content: prompt  // User-provided prompt
            }
        ];

        // Call the Llama-3-8b-instruct model using the AI bindings
        const response = await env.AI.fetch('llama-3-8b-instruct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: messages, // Pass the messages to the AI model
                max_tokens: 50,    // Adjust based on your use case (limits response length)
                temperature: 0.7,    // Adjust for creativity (lower is more focused, higher is more random)
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate text from AI');
        }
  
        const data = await response.json();
        const generatedText = data.choices[0].message.content; // Extract the generated text from the AI response
  
        return new Response(JSON.stringify({ text: generatedText }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
  
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Text generation failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
