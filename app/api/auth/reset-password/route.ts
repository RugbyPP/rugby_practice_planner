import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth-utils';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    // Validate token format (should be a hex string)
    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // For now, accept any valid token format
    // In production, validate against database or use JWT
    // Token format: SHA256 hex string

    // Hash new password
    const passwordHash = await hashPassword(password);

    // For now, update the first user (ID 1)
    // In production, extract user ID from token or JWT
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, 1));

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Reset password error:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to reset password', details: errorMessage },
      { status: 500 }
    );
  }
}
