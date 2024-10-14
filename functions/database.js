export async function handleUser(email, context) {
  const db = context.env.DATABASE;  

  
  const [localPart, domainPart] = email.split('@');
  const username=localPart.split('+')[0];
  const cleanEmail = `${username}@${domainPart}`;
  
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
