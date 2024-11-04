import { verifyToken } from './cookie';
import { getStories, saveStory, createStoriesTable } from './database'; 

export async function onRequest(context) {
    const { request } = context;

    const cookieHeader = request.headers.get('Cookie') || '';
    const cookies = parseCookies(cookieHeader);
    const authToken = cookies.authToken; 
    
    
    const user = verifyToken(authToken, context.env.VITE_JWT_SECRET);
    

    if (!authToken || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const body = await request.json();
    
    const action = body.call;

    if (action === 'retrieve') {
        console.log("retrieve");
        try {
            const stories = await getStories(user.email, context);
            // console.log(stories);
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
    } else if (action === 'save') {
        
        const { title, story } = body;
        // console.log(title, user.email);
        if (!title || !story) {
            return new Response(JSON.stringify({ error: 'Title and story are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Handle story saving
        try {
            console.log(user.email, title)
            await saveStory(user.email, title, story, context); 
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

        return new Response(JSON.stringify({ error: 'Invalid action' }), {
            status: 400,
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
