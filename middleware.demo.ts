import { NextResponse } from 'next/server';

// Demo mode: skip authentication checks
export function middleware() {
  // In demo mode, allow all routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
