export async function saveStory(title: string, content: string, email: string, context: ExecutionContext) {
    try {
      const stmt = context.env.DATABASE_NAME
        .prepare(`INSERT INTO stories (prompt, story, user) VALUES (?, ?, ?)`)
        .bind(title, content, email);
  
      await stmt.run();
      return { success: true, message: "Story saved successfully" };
    } catch (error) {
      console.error("Error saving story:", error);
      throw new Error("Failed to save story");
    }
  }


export async function getStories(email: string, context: ExecutionContext) {
    try {
      
      const stmt = context.env.DATABASE_NAME
        .prepare(`SELECT * FROM stories WHERE user = ?`)
        .bind(email);
  
      
      const results = await stmt.all();
  
      return results;
    } catch (error) {
      console.error("Error fetching saved items:", error);
      throw new Error("Failed to fetch saved items");
    }
  }
  