import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create pool with connection pooling disabled for serverless
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Validate database connection
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL_NON_POOLING) {
  console.error('ERROR: DATABASE_URL or POSTGRES_URL_NON_POOLING environment variable is not set');
}

export const db = drizzle(pool, { schema });

export type Database = typeof db;
