import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is trying to access dashboard
  if (pathname.startsWith('/dashboard')) {
    const userId = request.cookies.get('userId');

    if (!userId) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Check if user is trying to access auth pages while logged in
  if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
    const userId = request.cookies.get('userId');

    if (userId) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Check if admin is trying to access admin dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    const adminId = request.cookies.get('adminId');

    if (!adminId) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Check if admin is trying to access admin login while logged in
  if (pathname === '/admin/login') {
    const adminId = request.cookies.get('adminId');

    if (adminId) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/login', '/auth/register', '/admin/:path*'],
};
