// database.server.ts

const WORKER_URL = 'https://auth.talesandpages.com/';

export async function getUserOrCreate(email) {
  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user from worker');
  }

  const user = await response.json();
  console.log("database.server user", user);
  return user;
}
