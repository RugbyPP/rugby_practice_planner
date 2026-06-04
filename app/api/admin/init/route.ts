import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth-utils';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

async function initAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, 'c.williams@mwbs.co.uk'))
      .limit(1);

    if (existingAdmin.length > 0) {
      return NextResponse.json(
        { message: 'Admin user already exists' },
        { status: 200 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword('password');

    // Create admin user
    const newAdmin = await db
      .insert(users)
      .values({
        email: 'c.williams@mwbs.co.uk',
        name: 'Admin',
        passwordHash,
        isAdmin: 1,
      })
      .returning();

    return NextResponse.json(
      { message: 'Admin user created successfully', user: newAdmin[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return initAdmin();
}

export async function POST() {
  return initAdmin();
}
