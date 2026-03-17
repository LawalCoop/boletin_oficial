'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { useUserData } from '@/contexts/UserDataContext';
import { NewsCard } from '@/components/feed/NewsCard';
import { NoticiaPreview } from '@/lib/types';
import { Bookmark, User, ArrowLeft } from 'lucide-react';
import { LoginButton } from '@/components/auth/LoginButton';

export default function GuardadosPage() {
  const { data: session, status } = useSession();
  const { savedSlugs, isLoading: userDataLoading } = useUserData();
  const [articles, setArticles] = useState<NoticiaPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedArticles() {
      if (savedSlugs.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch article data for each saved slug
        const articlesData = await Promise.all(
          savedSlugs.map(async (slug) => {
            try {
              const res = await fetch(`/api/noticias/${slug}`);
              if (!res.ok) return null;
              const data = await res.json();
              // Convert Articulo to NoticiaPreview format
              return {
                id: data.id,
                slug: data.slug,
                categoria: data.metadata.categoria,
                tema: data.metadata.tema,
                seccionBoletin: 'primera' as const,
                tipoDocumento: data.metadata.tipoDocumento,
                numeroDocumento: data.metadata.numeroDocumento,
                titulo: data.contenidoIA.titulo,
                extracto: data.contenidoIA.resumen.slice(0, 200) + '...',
                fuente: data.metadata.organismoEmisor,
                tiempoLectura: data.tiempoLectura,
                fechaPublicacion: data.fechaPublicacion,
                tags: data.tags || [],
                urlOriginal: data.metadata.urlOriginal,
              } as NoticiaPreview;
            } catch {
              return null;
            }
          })
        );

        setArticles(articlesData.filter((a): a is NoticiaPreview => a !== null));
      } catch (error) {
        console.error('Error fetching saved articles:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!userDataLoading && status === 'authenticated') {
      fetchSavedArticles();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [savedSlugs, userDataLoading, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-bg-surface rounded-lg" />
            ))}
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
              Artículos Guardados
            </h1>
            <p className="text-text-secondary mb-6">
              Iniciá sesión para ver tus artículos guardados.
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/perfil"
            className="p-2 rounded-lg hover:bg-bg-surface transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-muted" />
          </Link>
          <div className="flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-accent" />
            <h1 className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary">
              Artículos Guardados
            </h1>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="bg-bg-surface rounded-lg p-8 text-center">
            <Bookmark className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h2 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary mb-2">
              No tenés artículos guardados
            </h2>
            <p className="text-text-secondary mb-6">
              Guardá artículos que te interesen para leerlos más tarde.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
            >
              Explorar noticias
            </Link>
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-sm text-text-muted mb-4">
              {articles.length} artículo{articles.length !== 1 ? 's' : ''} guardado{articles.length !== 1 ? 's' : ''}
            </p>
            {articles.map((article, index) => (
              <NewsCard key={article.id} noticia={article} index={index} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
