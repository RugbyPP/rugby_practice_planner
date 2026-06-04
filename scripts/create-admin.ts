import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth-utils';
import { eq } from 'drizzle-orm';

async function createAdmin() {
  try {
    const email = 'c.williams@mwbs.co.uk';
    const password = 'password';
    const name = 'Admin';

    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create admin user
    const newAdmin = await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash,
        isAdmin: 1,
      })
      .returning();

    console.log('Admin user created successfully:', newAdmin[0]);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
