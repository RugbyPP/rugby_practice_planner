import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Singleton pattern for database connection in serverless environment
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const connectionString = process.env.POSTGRES_URL_NON_POOLING;
  if (!connectionString) {
    throw new Error('POSTGRES_URL_NON_POOLING environment variable is not set');
  }
  
  const pool = new Pool({
    connectionString,
    max: 1, // Limit connections in serverless
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  dbInstance = drizzle(pool, { schema });
  return dbInstance;
}

// Use a Proxy to lazily initialize the database
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get: (_target, prop) => {
    const actualDb = getDb();
    return (actualDb as any)[prop];
  },
});

export type Database = ReturnType<typeof drizzle>;
