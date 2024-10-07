//const PAGES_FUNCTIONS_URL = 'http://127.0.0.1:8788/text-generation';  
const PAGES_FUNCTIONS_URL = 'https://talesandpages.com/text-generation';


export async function generateText(prompt: string): Promise<string> {
  const response = await fetch(PAGES_FUNCTIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),  // Send the prompt in the request body
  });

  if (!response.ok) {
    throw new Error('Failed to fetch AI response from Pages function');
  }

  const answer = await response.json();
  return answer.response;  // Adjust this based on how the response is structured in the Pages Function
}
