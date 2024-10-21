import { handleUser } from './database'; 

export async function onRequest(context) {
    const { request } = context;

    const { email } = await request.json();  

    if (!email) {
        return new Response(JSON.stringify({ error: 'Email is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    const result = await handleUser(email, context);  
    const user = result.user;
    const token = context.env.VITE_JWT_SECRET;

    
    const maxAge = 7 * 24 * 60 * 60;


    const authCookie = `authToken=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=None; Secure;`;
    const sessionCookie = `session=${JSON.stringify({ data: { user: email, username: user.username } })}; Max-Age=${maxAge}; Path=/; SameSite=None; Secure;`;

    // Set headers and append cookies using Cloudflare's Headers.append for multiple Set-Cookie
    const headers = new Headers();
    headers.append("Set-Cookie", authCookie);
    headers.append("Set-Cookie", sessionCookie);
    headers.append("Content-Type", "application/json");
    headers.append("Access-Control-Allow-Origin", "https://talesandpages.com");
    headers.append("Access-Control-Allow-Credentials", "true");

    // Return the response with the appended headers
    return new Response(JSON.stringify(user), {
        headers,
    });
}
