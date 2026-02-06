import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'app',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'secure_password_123',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const query = async <T extends QueryResultRow = never>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params as never[]);
};
