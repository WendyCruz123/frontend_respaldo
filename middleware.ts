import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si el usuario está autenticado (tiene la cookie "accessToken") y va a login o register → redirigir a /
  if (
    (pathname === '/login' || pathname === '/register') &&
    request.cookies.has('accessToken')
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Si el usuario NO tiene token e intenta acceder a páginas privadas → redirigir a /login
  if (
    (pathname === '/' || pathname.startsWith('/dashboard')) &&
    !request.cookies.has('accessToken')
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard/:path*'],
};