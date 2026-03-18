import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  getAdminConfig,
  normalizeAdminRedirectPath,
  verifyAdminSessionToken,
} from '@/lib/admin-auth';

const PUBLIC_ADMIN_PATHS = new Set([
  '/admin/login',
  '/api/admin/login',
]);

function isAdminApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/admin/');
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (PUBLIC_ADMIN_PATHS.has(pathname)) {
    if (pathname === '/admin/login') {
      try {
        getAdminConfig();
        const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
        const isAuthenticated = await verifyAdminSessionToken(token);

        if (isAuthenticated) {
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      } catch {
        return new NextResponse('Admin authentication is misconfigured', { status: 503 });
      }
    }

    return NextResponse.next();
  }

  try {
    getAdminConfig();
  } catch {
    if (isAdminApiPath(pathname)) {
      return NextResponse.json({ error: 'Admin authentication is misconfigured' }, { status: 503 });
    }

    return new NextResponse('Admin authentication is misconfigured', { status: 503 });
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = await verifyAdminSessionToken(token);

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (isAdminApiPath(pathname)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('next', normalizeAdminRedirectPath(`${pathname}${search}`));
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
