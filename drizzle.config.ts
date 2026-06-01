import type { Config } from 'drizzle-kit';

// Use POSTGRES_URL_NON_POOLING for Vercel Postgres/Neon
export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING!,
  },
} satisfies Config;
