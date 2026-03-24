import { NextRequest, NextResponse } from 'next/server';
import { auth, ADMIN_EMAIL } from '@/lib/auth';

function isAdminEmail(email?: string | null): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL;
}

function isAdminApiPath(pathname: string): boolean {
  return pathname.startsWith('/api/admin/');
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Allow public access to admin login page
  if (pathname === '/admin/login') {
    const session = await auth();

    // If already logged in with @lawal.com.ar, redirect to admin
    if (session?.user && isAdminEmail(session.user.email)) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  // Check session for all other admin routes
  const session = await auth();

  if (!session?.user) {
    // No session - redirect to login or return 401 for API
    if (isAdminApiPath(pathname)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Session exists - check if admin domain
  if (!isAdminEmail(session.user.email)) {
    // Wrong domain - return 403
    if (isAdminApiPath(pathname)) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // For pages, redirect to login with error
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('error', 'wrong_domain');
    return NextResponse.redirect(loginUrl);
  }

  // Admin domain - allow access
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
