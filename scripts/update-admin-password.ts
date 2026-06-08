import { Pool } from 'pg';
import crypto from 'crypto';

const connectionString = 'postgresql://neondb_owner:npg_mF9drGs7gpIe@ep-plain-cherry-abf7h1de.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

async function updateAdminPassword() {
  const client = await pool.connect();
  try {
    // Hash the password
    const passwordHash = await hashPassword('password');
    console.log('Password hash:', passwordHash);

    // Update admin user with correct password hash
    const result = await client.query(`
      UPDATE "users" 
      SET "password_hash" = $1, "updated_at" = NOW()
      WHERE "email" = $2
      RETURNING *;
    `, [passwordHash, 'c.williams@mwbs.co.uk']);

    console.log('✓ Admin password updated:', result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

updateAdminPassword();
