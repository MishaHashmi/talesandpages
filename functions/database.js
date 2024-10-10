export async function handleUser(email, context) {
  const db = context.env.DATABASE;  

  if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
      });
  }

  
  const user = await getUserByEmail(email, db);
  if (user) {
      return new Response(JSON.stringify(user), {
          headers: { 'Content-Type': 'application/json' },
      });
  } else {
      const username = email.split('@')[0];
      const newUser = { email, username };
      await createUser(newUser, db);
      return new Response(JSON.stringify(newUser), {
          headers: { 'Content-Type': 'application/json' },
      });
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
