import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Get clean hostname (e.g. portal.localhost:3000 -> portal.localhost)
  const currentHost = hostname.split(':')[0];

  // Check if subdomain is "portal"
  const isPortalSubdomain =
    currentHost === 'portal.rynexsecurity.com' ||
    currentHost === 'portal.localhost';

  if (isPortalSubdomain) {
    // Prevent duplicate paths if user types portal.rynexsecurity.com/portal/login
    let cleanPathname = pathname;
    if (pathname.startsWith('/portal')) {
      cleanPathname = pathname.replace('/portal', '') || '/';
    }

    const sessionCookie = request.cookies.get('portal_session')?.value;
    const isLoginPage = cleanPathname === '/login';
    const isChangePasswordPage = cleanPathname === '/change-password';

    // Verify Session
    let decodedSession = null;
    if (sessionCookie) {
      decodedSession = await verifyJWT(sessionCookie);
    }

    // Auth redirection check
    // 1. If on login and already authenticated -> redirect to dashboard
    if (isLoginPage && decodedSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 2. If not authenticated and not on login page -> redirect to login
    if (!isLoginPage && !decodedSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }


    // Rewrite requests to map silently into /src/app/portal/* directory
    const url = request.nextUrl.clone();
    url.pathname = `/portal${cleanPathname}`;
    return NextResponse.rewrite(url);
  }

  // Protect against main domain /portal access: return 404 page (no redirection)
  if (pathname.startsWith('/portal')) {
    const url = request.nextUrl.clone();
    url.pathname = '/not-found';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  // Matches all paths except static files, favicon, API, and image assets
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
