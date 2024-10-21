const PAGES_FUNCTIONS_URL = 'http://localhost:8788/auth'
// const PAGES_FUNCTIONS_URL = 'https://talesandpages.com/auth'; 

export async function getUserOrCreate(email) {
 
  const response = await fetch(PAGES_FUNCTIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user from Pages function');
  }

  // console.log("auth.out");
  // console.log(response.status);
  // console.log([...response.headers.entries()]);

  const user = await response.json();

  return user;
}
