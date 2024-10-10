// functions/auth.js
import { handleUser } from './database';

export async function onRequest(context) {
    const { request } = context;
    const { email } = await request.json();  
    return handleUser(email, context);  
}
