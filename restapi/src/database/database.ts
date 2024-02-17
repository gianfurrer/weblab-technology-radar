import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.POSTGRES_SERVER || "localhost",
  database: process.env.POSTGRES_DATABSE || "technology-radar",
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

export async function executeSQL(query: string, ...args) {
  const result = await pool.query(query, args);
  return result.rows;
}
