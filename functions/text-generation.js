
import {verifyToken} from './cookie';
export async function onRequest(context) {
    const { request, env } = context;

 
    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const authToken = cookies.authToken; 
    
    const user=await verifyToken(authToken, context.env.VITE_JWT_SECRET);
    // console.log("t-g user", user);



    if (!authToken || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
        return new Response(JSON.stringify({ error: 'Prompt is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const formattedPrompt = `Write a whimsical, friendly and cute story in markdown formatting. Follow the markdown formatting consistently. Begin stories immediately without any preamble. Avoid ending it abruptly. Your prompt is: ${prompt}`;

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
            headers: { 'Content-Type': 'application/json',
            
        },
        });
    }
}




function parseCookies(cookieHeader) {
    return cookieHeader.split('; ').reduce((cookies, cookie) => {
        const [name, ...rest] = cookie.split('=');
        cookies[name] = rest.join('=');
        return cookies;
    }, {});
}
