import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  normalizeAdminRedirectPath,
  verifyAdminCredentials,
} from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const next = normalizeAdminRedirectPath(typeof body.next === 'string' ? body.next : undefined);

    if (!username || !password) {
      return NextResponse.json({ error: 'Usuario y clave son obligatorios' }, { status: 400 });
    }

    const isValid = await verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = await createAdminSessionToken();
    const response = NextResponse.json({ ok: true, redirectTo: next });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());
    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'No se pudo iniciar sesión' }, { status: 500 });
  }
}
