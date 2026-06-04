import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );

  response.cookies.delete('userId');

  return response;
}
