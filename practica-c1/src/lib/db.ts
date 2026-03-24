import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://user:con123456@localhost:5432/library';

const pool = new Pool({
  connectionString,
});

export const query = async (text: string, params?: unknown[]) => {
  const start = Date.now();
  const res = await pool.query(text, params as unknown[]);
  const duration = Date.now() - start;
  return res;
};
