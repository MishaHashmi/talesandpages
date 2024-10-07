
//const PAGES_FUNCTIONS_URL ='http://127.0.0.1:8788/auth';

const PAGES_FUNCTIONS_URL = 'https://talesandpages.com/auth'; 


export async function getUserOrCreate(email) {
  console.log("db.server entered");
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

  const user = await response.json();
  console.log("db.server user:",user);
  return user;
}
