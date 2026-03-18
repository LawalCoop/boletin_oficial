export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8;

type AdminConfig = {
  username: string;
  password: string;
  sessionSecret: string;
};

function getEnv(name: 'ADMIN_USERNAME' | 'ADMIN_PASSWORD' | 'ADMIN_SESSION_SECRET'): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required admin environment variable: ${name}`);
  }

  return value;
}

export function getAdminConfig(): AdminConfig {
  return {
    username: getEnv('ADMIN_USERNAME'),
    password: getEnv('ADMIN_PASSWORD'),
    sessionSecret: getEnv('ADMIN_SESSION_SECRET'),
  };
}

function toBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function toBuffer(value: string): ArrayBuffer {
  const bytes = toBytes(value);
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function importSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    toBuffer(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

async function signValue(value: string, secret: string): Promise<string> {
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, toBuffer(value));
  return toHex(signature);
}

function timingSafeEqualString(a: string, b: string): boolean {
  const left = toBytes(a);
  const right = toBytes(b);
  const maxLength = Math.max(left.length, right.length);
  let mismatch = left.length === right.length ? 0 : 1;

  for (let index = 0; index < maxLength; index += 1) {
    mismatch |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }

  return mismatch === 0;
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const config = getAdminConfig();

  return (
    timingSafeEqualString(username, config.username) &&
    timingSafeEqualString(password, config.password)
  );
}

export async function createAdminSessionToken(): Promise<string> {
  const { sessionSecret } = getAdminConfig();
  const expiresAt = Date.now() + ADMIN_SESSION_DURATION_SECONDS * 1000;
  const payload = String(expiresAt);
  const signature = await signValue(payload, sessionSecret);

  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }

  const dotIndex = token.indexOf('.');
  if (dotIndex <= 0) {
    return false;
  }

  const payload = token.slice(0, dotIndex);
  const providedSignature = token.slice(dotIndex + 1);

  if (!/^\d+$/.test(payload) || !/^[a-f0-9]{64}$/.test(providedSignature)) {
    return false;
  }

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return false;
  }

  const { sessionSecret } = getAdminConfig();
  const expectedSignature = await signValue(payload, sessionSecret);

  return timingSafeEqualString(providedSignature, expectedSignature);
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  };
}

export function getAdminLogoutCookieOptions() {
  return {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  };
}

export function normalizeAdminRedirectPath(value: string | null | undefined): string {
  if (!value || !value.startsWith('/admin') || value.startsWith('/admin/login')) {
    return '/admin';
  }

  return value;
}
