import { handleUser } from './database'; 

export async function onRequest(context) {
    const { request } = context;
    const origin = request.headers.get('Origin');
    if (origin && !origin.endsWith('talesandpages.com')) { 
        return new Response('Unauthorized', { status: 403 });
    }

    const { email } = await request.json();  
    const user =handleUser(email, context);  
    const token = context.env.VITE_JWT_SECRET;

    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = `Expires=${expirationDate.toUTCString()};`;


    return new Response(JSON.stringify(user), {
        status: 400,
        headers: { 
            'Set-Cookie': `authToken=${token}; HttpOnly; Secure; SameSite=Strict; ${expires}`,
            'Content-Type': 'application/json' },
    });
}



