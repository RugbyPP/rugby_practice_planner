import type { Config } from 'drizzle-kit';

// Use POSTGRES_URL_NON_POOLING for Vercel Postgres/Neon
export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg' as const,
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL_NON_POOLING!,
  },
} satisfies Config;
