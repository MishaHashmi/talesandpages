import { verifyToken } from './cookie';
import { getStories, saveStory } from './database'; // Import your functions from database.js

export async function onRequest(context) {

    const { request } = context;

    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const authToken = cookies.authToken; 
    
    // Verify user token
    console.log()
    const user = verifyToken(authToken, context.env.VITE_JWT_SECRET);
    console.log("type of..",typeof(user), user);

    if (!authToken || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Determine the request method
    const method = request.method;

    if (method === 'GET') {
        // Handle story retrieval
        try {
            const stories = await getStories(user.email, context);
            return new Response(JSON.stringify(stories), {
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('Failed to retrieve stories:', error);
            return new Response(JSON.stringify({ error: 'Failed to retrieve stories: ' + error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } else if (method === 'POST') {
        // Handle story saving
        const body = await request.json();
        const { title, content } = body;

        if (!title || !content) {
            return new Response(JSON.stringify({ error: 'Title and content are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        try {
            await saveStory(user.email, title, content, context); // Assuming saveStory takes email, title, and content
            return new Response(JSON.stringify({ message: 'Story saved successfully' }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('Failed to save story:', error);
            return new Response(JSON.stringify({ error: 'Failed to save story: ' + error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } else {
        // Method Not Allowed
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Function to parse cookies from the request header
function parseCookies(cookieHeader) {
    return cookieHeader.split('; ').reduce((cookies, cookie) => {
        const [name, ...rest] = cookie.split('=');
        cookies[name] = rest.join('=');
        return cookies;
    }, {});
}
