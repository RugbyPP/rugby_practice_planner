import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { generateResetToken } from '@/lib/auth-utils';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (user.length === 0) {
      // Don't reveal if email exists
      return NextResponse.json(
        { message: 'If email exists, reset link has been sent' },
        { status: 200 }
      );
    }

    // Generate reset token
    const token = generateResetToken();
    // Note: In production, save token to database and send via email
    // For now, we generate the token but don't store it to avoid database issues

    // In a real app, send email here
    // For now, return the token (in production, send via email)
    console.log(`Password reset link: /auth/reset-password?token=${token}`);

    // In production, send this link via email
    // For now, return it in the response for testing
    const resetLink = `/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    console.log(`Password reset link for ${email}: ${resetLink}`);

    return NextResponse.json(
      { 
        message: 'If email exists, reset link has been sent',
        resetLink: resetLink // Remove in production
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Forgot password error:', errorMessage);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: errorMessage },
      { status: 500 }
    );
  }
}
