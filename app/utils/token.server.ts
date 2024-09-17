import cryptoJs from 'crypto-js';

export function createToken(payload: object, secret: string) {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const body = JSON.stringify(payload);
  
  const headerBase64 = btoa(header);
  const bodyBase64 = btoa(body);
  
  // Create HMAC using HmacSHA256
  const signature = cryptoJs.HmacSHA256(`${headerBase64}.${bodyBase64}`, secret).toString();
  
  return `${headerBase64}.${bodyBase64}.${signature}`;
}

export function verifyToken(token: string, secret: string) {
  const [headerBase64, bodyBase64, signature] = token.split('.');
  
  // Create expected signature
  const expectedSignature = cryptoJs.HmacSHA256(`${headerBase64}.${bodyBase64}`, secret).toString();
  
  if (signature !== expectedSignature) {
    console.error("Invalid token signature");
    return null;
  }

  // Decode and parse the payload
  const payload = JSON.parse(atob(bodyBase64));
  return payload;
}
