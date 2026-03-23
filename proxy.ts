import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const LOCALES = new Set(['es', 'en']);

export default function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const { pathname } = nextUrl;

  // Files in `public/images/` are served at `/images/...`. Do not prefix with locale
  // (otherwise `/images/foo` redirects to `/es/images/foo` and 404s).
  if (pathname.startsWith('/images/')) {
    return NextResponse.next();
  }

  const [, locale] = pathname.split('/');

  if (locale && LOCALES.has(locale)) {
    return NextResponse.next();
  }

  const url = nextUrl.clone();
  url.pathname = `/es${pathname === '/' ? '' : pathname}`.replaceAll(/\/+/g, '/');

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
