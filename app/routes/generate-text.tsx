// app/routes/generate-text.tsx
import { json } from '@remix-run/cloudflare'; // Use Cloudflare's json utility
import { generateText } from "~/utils/text-generation.server"; // Ensure this is compatible

export const action = async ({ request }) => {
  const { prompt } = await request.json();

  try {
    const response = await generateText(prompt);
    return json({ response });
  } catch (error) {
    return json({ error: 'Failed to generate text' }, { status: 500 });
  }
};
