import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { verifyPassword, generateToken } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    console.log('Test login attempt:', { email, passwordLength: password?.length });

    // Find user
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    console.log('User query result:', { found: result.length > 0 });

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found', email },
        { status: 401 }
      );
    }

    const user = result[0];
    console.log('User found:', { id: user.id, email: user.email });

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    console.log('Password verification:', { isValid });

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });
    console.log('Token generated:', { userId: user.id });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error: any) {
    console.error('Test login error:', error);
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    );
  }
}
