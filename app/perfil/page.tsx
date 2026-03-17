'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { useUserData } from '@/contexts/UserDataContext';
import { TEMAS } from '@/lib/constants';
import { TemaIcon } from '@/components/shared/TemaIcon';
import { Star, Bookmark, X, User, ArrowRight } from 'lucide-react';
import { LoginButton } from '@/components/auth/LoginButton';

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { subscriptions, savedSlugs, isLoading, unsubscribe } = useUserData();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Allow viewing but prompt to login
    }
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-bg-surface rounded-full" />
              <div className="space-y-2">
                <div className="h-6 w-40 bg-bg-surface rounded" />
                <div className="h-4 w-60 bg-bg-surface rounded" />
              </div>
            </div>
            <div className="h-40 bg-bg-surface rounded-lg" />
            <div className="h-40 bg-bg-surface rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-bg pb-20 lg:pb-0">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 bg-bg-surface rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-text-muted" />
            </div>
            <h1 className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary mb-2">
              Mi Perfil
            </h1>
            <p className="text-text-secondary mb-6">
              Iniciá sesión para ver tus suscripciones y artículos guardados.
            </p>
            <LoginButton className="mx-auto" />
          </div>
        </main>
        <Footer />
        <BottomTabBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'Usuario'}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          <div>
            <h1 className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary">
              {session.user.name || 'Usuario'}
            </h1>
            <p className="text-text-muted">{session.user.email}</p>
          </div>
        </div>

        {/* Subscriptions */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-[#FFD700]" />
            <h2 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary">
              Mis Suscripciones
            </h2>
          </div>

          {subscriptions.length === 0 ? (
            <div className="bg-bg-surface rounded-lg p-6 text-center">
              <p className="text-text-muted mb-4">
                No estás suscrito a ningún tema todavía.
              </p>
              <p className="text-sm text-text-secondary">
                Explorá las noticias y suscribite a los temas que te interesen para recibir actualizaciones.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subscriptions.map((tema) => {
                const temaInfo = TEMAS[tema];
                if (!temaInfo) return null;

                return (
                  <div
                    key={tema}
                    className="flex items-center justify-between p-4 bg-bg-surface rounded-lg border border-border"
                  >
                    <Link
                      href={`/tema/${tema}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${temaInfo.color}20` }}
                      >
                        <TemaIcon iconName={temaInfo.icon} className="w-5 h-5" style={{ color: temaInfo.color }} />
                      </div>
                      <span className="font-medium text-text-primary">{temaInfo.label}</span>
                    </Link>
                    <button
                      onClick={() => unsubscribe(tema)}
                      className="p-2 text-text-muted hover:text-red-500 transition-colors"
                      title="Dejar de seguir"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Saved Articles Preview */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-accent" />
              <h2 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary">
                Artículos Guardados
              </h2>
            </div>
            {savedSlugs.length > 0 && (
              <Link
                href="/guardados"
                className="flex items-center gap-1 text-sm text-accent hover:underline"
              >
                Ver todos
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {savedSlugs.length === 0 ? (
            <div className="bg-bg-surface rounded-lg p-6 text-center">
              <p className="text-text-muted mb-4">
                No tenés artículos guardados todavía.
              </p>
              <p className="text-sm text-text-secondary">
                Guardá artículos para leerlos más tarde usando el botón de guardar.
              </p>
            </div>
          ) : (
            <div className="bg-bg-surface rounded-lg p-6">
              <p className="text-text-secondary">
                Tenés <strong className="text-text-primary">{savedSlugs.length}</strong> artículo{savedSlugs.length !== 1 ? 's' : ''} guardado{savedSlugs.length !== 1 ? 's' : ''}.
              </p>
              <Link
                href="/guardados"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
              >
                <Bookmark className="w-4 h-4" />
                Ver artículos guardados
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
