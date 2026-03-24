// src/lib/db.ts
import { Pool, QueryResult, QueryResultRow } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Tipos explícitos para parámetros de consulta
type QueryParam = string | number | boolean | Date | null | undefined;

export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: QueryParam[] = []
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};