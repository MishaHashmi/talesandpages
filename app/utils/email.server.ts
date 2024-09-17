export async function sendEmail({ to, subject, text }: { to: string, subject: string, text: string }) {
    const apiKey = import.meta.env.VITE_POSTMARK_API_KEY;
  
    if (!apiKey) {
      throw new Error("POSTMARK_API_KEY is not defined");
    }
  
    console.log("Sending email to:", to); // Debugging log
  
    const response = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Postmark-Server-Token": apiKey,
      },
      body: JSON.stringify({
        From: "login@talesandpages.com",
        To: to,
        Subject: subject,
        TextBody: text,
      }),
    });
  
    const responseBody = await response.text();
    console.log("Response Status:", response.status);
    console.log("Response Body:", responseBody);
  
    if (!response.ok) {
      throw new Error(`Failed to send email via Postmark: ${responseBody}`);
    }
  }
  