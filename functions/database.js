
export async function saveStory(title, content, email, context) {
  const db = context.env.DATABASE; 

  try {
    const stmt = db
      .prepare(`INSERT INTO stories (title, story, user) VALUES (?, ?, ?)`)
      .bind(title, content, email);

    await stmt.run();
    return { success: true, message: "Story saved successfully" };
  } catch (error) {
    console.error("Error saving story:", error);
    throw new Error("Failed to save story");
  }
}


export async function getStories(email, context) {
  console.log("database.js email", email);

  const db = context.env.DATABASE; 
  try {
    
    const stmt = db
      .prepare(`SELECT * FROM stories WHERE user = ?`)
      .bind(email);

    
    const results = await stmt.all();

    return results;
  } catch (error) {
    console.error("Error fetching saved items:", error);
    throw new Error("Failed to fetch saved items");
  }
}



export async function handleUser(email, context) {
  const db = context.env.DATABASE;  

  
  const [localPart, domainPart] = email.split('@');
  const username=localPart.split('+')[0];
  const cleanEmail = `${username}@${domainPart}`;
  
  if(domainPart !== 'talesandpages.com'){
    const newUser = {email:null, username:null}
    return {user:newUser}
  }
  const user = await getUserByEmail(cleanEmail, db);
  if (user) {
      return {user};
  } else {
      const newUser = { email:cleanEmail, username };
      await createUser(newUser, db);
      return {user:newUser};
  }
}



async function getUserByEmail(email, db) {
  const query = `SELECT * FROM users WHERE email = ?`;
  const result = await db.prepare(query).bind(email).first();
  return result ? result : null;
}

async function createUser(user, db) {
  const query = `INSERT INTO users (email, username) VALUES (?, ?)`;
  await db.prepare(query).bind(user.email, user.username).run();
}
