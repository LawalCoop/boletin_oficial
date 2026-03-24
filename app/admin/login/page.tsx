'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { LockKeyhole, ShieldCheck, AlertCircle } from 'lucide-react';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#ffffff_45%,#f8f8f8_100%)] px-6 py-10">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="text-text-secondary">Cargando...</div>
      </div>
    </main>
  );
}

function AdminLoginContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const error = searchParams.get('error');
  const next = searchParams.get('next') || '/admin';
  const isWrongDomain = error === 'wrong_domain';

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.isAdmin) {
      window.location.href = next;
    }
  }, [status, session, next]);

  const handleSignIn = () => {
    setIsSigningIn(true);
    signIn('google', { callbackUrl: next });
  };

  if (status === 'loading') {
    return <LoadingState />;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#ffffff_45%,#f8f8f8_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[28px] border border-border bg-bg shadow-[0_20px_80px_rgba(17,17,17,0.08)] md:grid-cols-[1.1fr_0.9fr]">
          <section className="relative hidden min-h-[560px] overflow-hidden bg-[radial-gradient(circle_at_top_left,#0066CC18_0%,transparent_40%),linear-gradient(140deg,#0f1720_0%,#19324f_52%,#2d6aa1_100%)] px-10 py-12 text-white md:flex md:flex-col md:justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.04)_100%)]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
                <ShieldCheck className="h-3.5 w-3.5" />
                Acceso restringido
              </span>
              <h1 className="mt-6 max-w-sm font-[family-name:var(--font-lora)] text-4xl font-medium leading-tight">
                Panel operativo del Boletín Oficial
              </h1>
            </div>
          </section>

          <section className="flex min-h-[560px] flex-col justify-center px-6 py-10 sm:px-10">
            <Link
              href="/"
              className="mb-10 text-sm font-medium text-text-muted transition hover:text-text-primary"
            >
              Volver al portal
            </Link>

            <div className="mb-8 space-y-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-[family-name:var(--font-lora)] text-3xl font-medium text-text-primary">
                  Ingreso admin
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                  Acceso exclusivo para miembros de la organización Lawal.
                </p>
              </div>
            </div>

            {isWrongDomain && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Acceso denegado
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    No tenés permisos para acceder al panel de administración.
                  </p>
                </div>
              </div>
            )}

            {status === 'authenticated' && !session?.user?.isAdmin && (
              <>
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Cuenta sin permisos
                    </p>
                    <p className="mt-1 text-sm text-amber-700">
                      Estás conectado como {session.user.email}, pero no tenés permisos de administrador.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-medium text-text-primary shadow-sm transition hover:bg-bg-soft hover:shadow"
                >
                  Cerrar sesión y usar otra cuenta
                </button>
              </>
            )}

            {status !== 'authenticated' && (
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-sm font-medium text-text-primary shadow-sm transition hover:bg-bg-soft hover:shadow disabled:opacity-50"
              >
                <GoogleIcon className="h-5 w-5" />
                {isSigningIn ? 'Redirigiendo...' : 'Continuar con Google'}
              </button>
            )}

            <p className="mt-6 text-center text-xs text-text-muted">
              Acceso restringido
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AdminLoginContent />
    </Suspense>
  );
}
