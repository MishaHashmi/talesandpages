export async function getUserOrCreate(email) {
  const response = await fetch('/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user from Pages function');
  }

  const user = await response.json();
  return user;
}
