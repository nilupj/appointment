import { sql } from 'drizzle-orm';

export const up = async (db) => {
  await db.execute(sql`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );
  `);
};

export const down = async (db) => {
  await db.execute(sql`DROP TABLE users;`);
};
