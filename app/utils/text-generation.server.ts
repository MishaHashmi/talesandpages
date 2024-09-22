const WORKER_URL = 'https://auth.talesandpages.com/';

export async function generateText(prompt: string): Promise<string> {
    const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
    
      if (!response.ok) {
        throw new Error('Failed to fetch user from worker');
      }
    
      const answer = await response.json();
      return answer.response;

    
  
    }
  