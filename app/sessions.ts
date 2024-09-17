// app/sessions.ts


const sessionSecret = import.meta.env.VITE_SESSION_SECRET;

// Ensure sessionSecret is not undefined
if (!sessionSecret) {
    throw new Error("VITE_SESSION_SECRET is not defined.");
  }
  
  // Helper function to create a new session object
  export function createEmptySession() {
    return {
      data: {},
      set(key: string, value: any) {
        this.data[key] = value;
      },
      get(key: string) {
        return this.data[key];
      },
      clear() {
        this.data = {};
      }
    };
  }
  
  // Utility functions for cookie management
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
  
  export async function getSession(cookieHeader: string | null) {
    try {
      const cookies = parseCookies(cookieHeader);
      const sessionCookie = cookies["session"];
      const session = sessionCookie ? JSON.parse(sessionCookie) : createEmptySession();
      return session;
    } catch (error) {
      console.error("Error retrieving session:", error);
      return createEmptySession(); // Return an empty session on error
    }
  }
  
  export async function commitSession(session: any) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // Example expiration time, adjust as needed
    return serializeCookie("session", JSON.stringify(session), {
      secure: import.meta.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      expires,
    });
  }
  
  export async function destroySession() {
    return serializeCookie("session", "", {
      expires: new Date(0), // Set to expire immediately
      secure: import.meta.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
    });
  }
  
  export async function createSession(email: string, redirectTo: string) {
    // Create an empty session object
    const session = createEmptySession();
    
    // Set the user in the session
    session.set("user", email);
  
    if (session) {
      console.log("sessions session: ", session);
      // Commit the session and prepare the response
      return new Response(null, {
        headers: {
          "Set-Cookie": await commitSession(session),
          "Location": redirectTo,
        },
        status: 302,
      });
    } else {
      throw new Error("Failed to create session.");
    }
  }