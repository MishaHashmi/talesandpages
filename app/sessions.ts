const sessionSecret = import.meta.env.VITE_SESSION_SECRET;

// Ensure sessionSecret is not undefined
if (!sessionSecret) {
    throw new Error("VITE_SESSION_SECRET is not defined.");
}

// Helper function to create a new session object without double nesting
export function createEmptySession() {
    return {
        data: {}, // No more nesting
        set(key: string, value: any) {
            this.data[key] = value; // Set data directly on the session object, no more this.data[key]
        },
        get(key: string) {
            return this.data[key]; // Get data directly from the session object
        },
        clear() {
          this.data = {};
        }
    };
}

// Utility function for parsing cookies
export function parseCookies(cookieHeader: string | null): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const [name, ...rest] = cookie.split('=');
            cookies[name.trim()] = rest.join('=').trim();
        });
    }
    return cookies;
}

// Utility function to serialize a cookie
export function serializeCookie(name: string, value: string, options: Record<string, any> = {}): string {
    let cookieStr = `${name}=${value}`;
    
    if (options.expires) {
        cookieStr += `; expires=${options.expires.toUTCString()}`;
    }
    if (options.secure) {
        cookieStr += `; secure`;
    }
    if (options.sameSite) {
        cookieStr += `; SameSite=${options.sameSite}`;
    }
    if (options.path) {
        cookieStr += `; Path=${options.path}`;
    }
    if (options.httpOnly) {
        cookieStr += `; HttpOnly`;
    }
    
    return cookieStr;
}

// Get session data from cookies
export async function getSession(cookieHeader: string | null) {
    try {
        const cookies = parseCookies(cookieHeader);
        const sessionCookie = cookies["session"];
        const sessionData = sessionCookie ? JSON.parse(sessionCookie) : {};

        // Create an empty session and assign data directly without nesting
        const session = createEmptySession();
        Object.assign(session, sessionData); // Directly assign session data

        return session;
    } catch (error) {
        console.error("Error retrieving session:", error);
        return createEmptySession(); // Return an empty session on error
    }
}

// Commit the session by serializing it into a cookie
export async function commitSession(session: any) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // Example expiration time

    // Serialize session without double-nesting the data
    return serializeCookie("session", JSON.stringify(session), {
        secure: import.meta.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        expires,
    });
}

// Destroy the session by expiring the cookie
export async function destroySession() {
    return serializeCookie("session", "", {
        expires: new Date(0), // Set to expire immediately
        secure: import.meta.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
    });
}

// Create a new session with user data
export async function createSession(email: string, redirectTo: string) {
    const session = createEmptySession();

    // Set the user and username directly on the session object
    session.set("user", email);
    session.set("username", email.split('@')[0]);

    console.log("sessions session: ", session);
    
    return new Response(null, {
        headers: {
            "Set-Cookie": await commitSession(session), // Commit the updated session
            "Location": redirectTo,
        },
        status: 302,
    });
}
