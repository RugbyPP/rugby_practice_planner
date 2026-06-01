import type { Config } from 'drizzle-kit';

// Use POSTGRES_URL_NON_POOLING for Vercel Postgres/Neon, fall back to DATABASE_URL
export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg' as const,
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL!,
  },
} satisfies Config;
