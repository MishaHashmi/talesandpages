import { createCookie } from "@remix-run/node";

const sessionSecret = import.meta.env.VITE_SESSION_SECRET;

// Define your cookie for session management
const sessionCookie = createCookie("session", {
  secrets: [sessionSecret || ""],
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  httpOnly: true,
});

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
  

  export async function getSession(cookieHeader: string | null) {
    try {
      const session = await sessionCookie.parse(cookieHeader || "");
      return session || createEmptySession(); // Return an empty session if parsing fails
    } catch (error) {
      console.error("Error retrieving session:", error);
      return createEmptySession(); // Return an empty session on error
    }
  }

export async function commitSession(session: any) {
  return sessionCookie.serialize(session);
}

export async function destroySession() {
  return sessionCookie.serialize({}, { expires: new Date(0) });
}

export async function createSession(email: string, redirectTo: string) {
  // Create an empty session object
  const session = createEmptySession();
  
  // Set the user in the session
  session.set("user", email);
  if(session){
      console.log("sessions session: ", session);
        // Commit the session and prepare the response
    return new Response(null, {
        headers: {
        "Set-Cookie": await commitSession(session),
        Location: redirectTo,
        },
        status: 302,
    });
  }
  else{
    throw new Error("Failed to create session.");
  }
  
}
