import { NextResponse } from 'next/server';

// Maintenance mode: with MAINTENANCE_MODE=true every page redirects to /maintenance.
// Team preview: visit any URL with ?preview=<MAINTENANCE_BYPASS_TOKEN> (?preview=off to exit).
const MAINTENANCE_PATH = '/maintenance';
const BYPASS_COOKIE = 'mentorle_preview';
// Still reachable while locked: the signup endpoint and the scheduled-posts cron
const ALLOWED_PREFIXES = ['/api/newsletter', '/api/cron'];

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  if (process.env.MAINTENANCE_MODE !== 'true') {
    if (pathname === MAINTENANCE_PATH) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  const token = process.env.MAINTENANCE_BYPASS_TOKEN;
  const preview = searchParams.get('preview');
  if (token && preview) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('preview');
    const response = NextResponse.redirect(url);
    if (preview === token) {
      response.cookies.set(BYPASS_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    } else if (preview === 'off') {
      response.cookies.delete(BYPASS_COOKIE);
    }
    return response;
  }
  if (token && request.cookies.get(BYPASS_COOKIE)?.value === token) {
    return NextResponse.next();
  }

  if (
    pathname === MAINTENANCE_PATH ||
    ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    /\.[a-z0-9]+$/i.test(pathname) // static files: fonts, robots.txt, etc.
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'maintenance' },
      { status: 503, headers: { 'Retry-After': '3600' } }
    );
  }

  return NextResponse.redirect(new URL(MAINTENANCE_PATH, request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
