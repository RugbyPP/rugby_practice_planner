import { Pool } from 'pg';

const connectionString = 'postgresql://neondb_owner:npg_mF9drGs7gpIe@ep-plain-cherry-abf7h1de.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function fixAdmin() {
  const client = await pool.connect();
  try {
    // Add is_admin column if it doesn't exist
    await client.query(`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_admin" integer DEFAULT 0 NOT NULL;
    `);
    console.log('✓ Added is_admin column');

    // Create admin user
    const result = await client.query(`
      INSERT INTO "users" ("email", "password_hash", "name", "is_admin", "created_at", "updated_at")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT ("email") DO UPDATE SET "is_admin" = 1
      RETURNING *;
    `, [
      'c.williams@mwbs.co.uk',
      '$2b$10$nOUIs5kJ7naTuTFkHi8H2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMm2', // password hash for "password"
      'Admin',
      1,
    ]);

    console.log('✓ Admin user created/updated:', result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixAdmin();
