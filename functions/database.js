export async function handleUser(email, context) {
  const db = context.env.DATABASE;  

  if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
      });
  }

  // Check if the user exists
  // console.log("Connected to database:", db); // Log the D1 database object
  // await createUsersTable(db);
  // await checkTables(db);
  
  const user = await getUserByEmail(email, db);
  if (user) {
      return new Response(JSON.stringify(user), {
          headers: { 'Content-Type': 'application/json' },
      });
  } else {
      // Create a new user
      const username = email.split('@')[0];
      const newUser = { email, username };
      await createUser(newUser, db);
      return new Response(JSON.stringify(newUser), {
          headers: { 'Content-Type': 'application/json' },
      });
  }
}

async function checkTables(db) {
  const tables = await db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Existing tables:", tables);
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


async function createUsersTable(db) {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
          email TEXT PRIMARY KEY,
          username TEXT NOT NULL
      )
  `;
  await db.prepare(query).run();
}