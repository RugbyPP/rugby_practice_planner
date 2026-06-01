import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const dbUrl = process.env.POSTGRES_URL_NON_POOLING;
    
    if (!dbUrl) {
      return NextResponse.json({
        error: 'POSTGRES_URL_NON_POOLING not set',
        env: Object.keys(process.env).filter(k => k.includes('POSTGRES') || k.includes('DATABASE')),
      });
    }

    // Extract host from connection string (without credentials)
    const urlObj = new URL(dbUrl);
    const host = urlObj.hostname;
    const database = urlObj.pathname.replace('/', '');

    return NextResponse.json({
      host,
      database,
      hasConnection: !!dbUrl,
      message: 'Connection string found',
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error),
    }, { status: 500 });
  }
}
