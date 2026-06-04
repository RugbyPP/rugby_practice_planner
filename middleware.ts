import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is trying to access dashboard
  if (pathname.startsWith('/dashboard')) {
    const userId = request.cookies.get('userId');

    if (!userId) {
      // Redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Check if user is trying to access auth pages while logged in
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
    const userId = request.cookies.get('userId');

    if (userId) {
      // Redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/auth/register'],
};
