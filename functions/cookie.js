// Define a key based on your secret
async function importSecretKey(secret) {
    const enc = new TextEncoder();
    return await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );
  }
  
  // Base64 encoding/decoding (Web Crypto requires URL-safe Base64)
  function toBase64Url(input) {
    return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  
  function fromBase64Url(input) {
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    return atob(input);
  }
  
  // JWT creation
  export async function createToken(payload, secret) {
    const header = { alg: "HS256", typ: "JWT" };
    const headerEncoded = toBase64Url(JSON.stringify(header));
    const payloadEncoded = toBase64Url(JSON.stringify(payload));
    
    const key = await importSecretKey(secret);
    const data = `${headerEncoded}.${payloadEncoded}`;
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
    const signatureEncoded = toBase64Url(String.fromCharCode(...new Uint8Array(signature)));
    
    return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
  }
  
  // JWT verification
  export async function verifyToken(token, secret) {
    const [headerEncoded, payloadEncoded, signatureEncoded] = token.split(".");
    
    const key = await importSecretKey(secret);
    const data = `${headerEncoded}.${payloadEncoded}`;
    const signature = new Uint8Array([...fromBase64Url(signatureEncoded)].map(c => c.charCodeAt(0)));
    
    const valid = await crypto.subtle.verify("HMAC", key, signature, new TextEncoder().encode(data));
    if (!valid) {
      return null;
    }
    
    // Parse and return payload if signature is valid
    return JSON.parse(fromBase64Url(payloadEncoded));
  }
  