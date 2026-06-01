import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/client';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = signupSchema.parse(body);

    // Check if user already exists
    const existingResult = await query(
      'SELECT id FROM users WHERE email = $1 LIMIT 1',
      [email]
    ) as any;

    if (existingResult.rows && existingResult.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, passwordHash, name]
    ) as any;

    const newUser = result.rows?.[0];

    // Generate token
    const token = generateToken({ userId: newUser.id, email: newUser.email });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json(
      { user: { id: newUser.id, email: newUser.email, name: newUser.name } },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
