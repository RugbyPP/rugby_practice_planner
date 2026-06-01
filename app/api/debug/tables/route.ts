import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Try to query the information_schema to see what tables exist
    const result = await db.execute(
      sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );

    return NextResponse.json({
      tables: result,
      message: 'Successfully queried database',
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || String(error),
      code: error.code,
    }, { status: 500 });
  }
}
