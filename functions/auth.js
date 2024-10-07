// functions/auth.js
import { handleUser } from './database';

export async function onRequest(context) {
    console.log("auth.js FUNCTION");
    const { request } = context;
    const { email } = await request.json();  // Get email from the request body
    return handleUser(email, context);  // Pass the email and context to handleUser
}
