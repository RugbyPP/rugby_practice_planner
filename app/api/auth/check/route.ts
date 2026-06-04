import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { userId: userId.value },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check auth' },
      { status: 500 }
    );
  }
}
