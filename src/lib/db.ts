import { Pool, QueryResult, QueryResultRow } from 'pg';

// Configuración de conexión EXPLÍCITA para Docker
const dbConfig = {
  user: 'app',  // Usuario de la aplicación
  host: 'db',   // Nombre del servicio en Docker Compose
  database: 'library_db',
  password: 'secure_password_123',
  port: 5432,
};

console.log('🔧 PostgreSQL Configuration:', dbConfig);

const pool = new Pool(dbConfig);

// Event listeners para depuración
pool.on('connect', () => {
  console.log('✅ PostgreSQL: Conexión establecida');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL Error:', err.message);
  console.error('Stack:', err.stack);
});

pool.on('acquire', () => {
  console.log('📥 PostgreSQL: Cliente adquirido del pool');
});

pool.on('release', () => {
  console.log('📤 PostgreSQL: Cliente liberado al pool');
});

export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> => {
  console.log(`📝 PostgreSQL Query ejecutándose: ${text.substring(0, 100)}...`);
  
  try {
    const start = Date.now();
    const result = await pool.query<T>(text, params as any[]);
    const duration = Date.now() - start;
    
    console.log(`✅ Query ejecutada en ${duration}ms: ${result.rowCount} filas afectadas`);
    return result;
  } catch (error) {
    console.error('❌ Error en query PostgreSQL:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      query: text.substring(0, 200),
      params: params,
    });
    
    // Re-lanzar el error para que lo maneje el llamador
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};