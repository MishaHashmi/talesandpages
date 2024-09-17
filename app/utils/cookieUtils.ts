// utils/cookieUtils.ts

export function parseCookies(cookieHeader: string | null) {
  const cookies: Record<string, string> = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [key, value] = cookie.split('=').map(part => part.trim());
      cookies[key] = value;
    });
  }
  return cookies;
}

export function serializeCookie(name: string, value: string, options: Record<string, any>) {
  let cookieString = `${name}=${value};`;
  
  if (options.secure) cookieString += ' Secure;';
  if (options.sameSite) cookieString += ` SameSite=${options.sameSite};`;
  if (options.path) cookieString += ` Path=${options.path};`;
  if (options.httpOnly) cookieString += ' HttpOnly;';
  if (options.expires) cookieString += ` Expires=${options.expires.toUTCString()};`;

  return cookieString;
}
