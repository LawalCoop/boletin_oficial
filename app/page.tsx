'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { CategoryTabs } from '@/components/layout/CategoryTabs';
import { DateHeader } from '@/components/feed/DateHeader';
import { HeroCard } from '@/components/feed/HeroCard';
import { NewsCard } from '@/components/feed/NewsCard';
import { Sidebar } from '@/components/layout/Sidebar';
import { NoticiasDia, Categoria, NoticiaPreview } from '@/lib/types';
import { CATEGORIAS, TEMAS, calcularTiempoTranscurrido } from '@/lib/constants';
import { Clock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Extended interface to include edition info
interface NoticiasDiaExtended extends NoticiasDia {
  edicionBoletin?: string;
}

// Helper to get icon component dynamically
function getIconComponent(iconName: string) {
  const pascalName = iconName.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalName];
}

// Compact card for the hero grid (right side)
function CompactCard({ noticia }: { noticia: NoticiaPreview }) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tiempoTranscurrido = calcularTiempoTranscurrido(noticia.fechaPublicacion);

  return (
    <article className="flex flex-col h-full rounded-lg overflow-hidden bg-bg-surface hover:shadow-md transition-shadow group">
      {/* Image */}
      <Link href={`/articulo/${noticia.slug}`} className="relative h-32 bg-bg-warm block">
        {noticia.imagen ? (
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform"
            style={{ backgroundImage: `url(${noticia.imagen})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
        )}
        {/* Category tag on image */}
        <span
          className="absolute top-2 left-2 px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-white rounded"
          style={{ backgroundColor: categoria.color }}
        >
          {categoria.label}
        </span>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Title */}
        <Link href={`/articulo/${noticia.slug}`}>
          <h3 className="font-[family-name:var(--font-lora)] text-base font-medium text-text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
            {noticia.titulo}
          </h3>
        </Link>

        {/* Meta row */}
        <div className="flex items-center justify-between mt-auto text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span>{tiempoTranscurrido}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {noticia.tiempoLectura} min
            </span>
          </div>
          <a
            href={noticia.urlOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Original
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);
  const [fecha, setFecha] = useState<string>('');
  const [categoria, setCategoria] = useState<Categoria | 'todos'>('todos');
  const [noticias, setNoticias] = useState<NoticiasDiaExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch available dates on mount
  useEffect(() => {
    async function fetchFechasDisponibles() {
      try {
        const res = await fetch('/api/noticias/fechas');
        const data = await res.json();
        const fechas = data.fechas || [];
        setFechasDisponibles(fechas);

        // Set initial date to most recent available
        if (fechas.length > 0) {
          setFecha(fechas[0]);
        }
      } catch (error) {
        console.error('Error fetching fechas:', error);
        // Fallback to hardcoded dates if API fails
        const fallbackDates = ['2025-03-14', '2025-03-13', '2025-03-12', '2025-03-11'];
        setFechasDisponibles(fallbackDates);
        setFecha(fallbackDates[0]);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchFechasDisponibles();
  }, []);

  // Fetch news for selected date
  useEffect(() => {
    if (!fecha) return;

    async function fetchNoticias() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ fecha });
        if (categoria !== 'todos') {
          params.append('categoria', categoria);
        }
        const res = await fetch(`/api/noticias?${params}`);
        const data = await res.json();
        setNoticias(data);
      } catch (error) {
        console.error('Error fetching noticias:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNoticias();
  }, [fecha, categoria]);

  // Get all news sorted by featured first
  const allNews: NoticiaPreview[] = noticias?.noticias || [];

  // For newspaper layout: first 6 go to hero section, rest below
  const heroMainArticle = allNews[0];
  const heroGridArticles = allNews.slice(1, 6); // 5 articles for the grid
  const remainingArticles = allNews.slice(6);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-text-muted">Cargando Boletín Oficial...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      <Header />
      <CategoryTabs activeCategory={categoria} onCategoryChange={setCategoria} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 lg:py-6">
        <DateHeader
          fecha={fecha}
          fechasDisponibles={fechasDisponibles}
          onDateChange={setFecha}
          edicionBoletin={noticias?.edicionBoletin}
        />

        {loading ? (
          <div className="flex flex-col gap-6 mt-6">
            {/* Loading skeleton */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-6">
              <div className="h-[400px] bg-bg-surface rounded animate-pulse" />
              <div className="hidden lg:grid lg:grid-rows-2 lg:gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-full bg-bg-surface rounded animate-pulse" />
                  <div className="h-full bg-bg-surface rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-full bg-bg-surface rounded animate-pulse" />
                  <div className="h-full bg-bg-surface rounded animate-pulse" />
                  <div className="h-full bg-bg-surface rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        ) : noticias && allNews.length > 0 ? (
          <div className="flex flex-col gap-8 mt-4">
            {/* ===== HERO SECTION: Newspaper-style layout ===== */}
            <section className="lg:grid lg:grid-cols-2 lg:gap-6">
              {/* Left: Main featured article */}
              {heroMainArticle && (
                <div className="lg:col-span-1">
                  <HeroCard noticia={heroMainArticle} />
                </div>
              )}

              {/* Right: Grid of 5 articles (2 top, 3 bottom) */}
              {heroGridArticles.length > 0 && (
                <div className="hidden lg:flex lg:flex-col lg:gap-3">
                  {/* Top row: 2 articles */}
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    {heroGridArticles.slice(0, 2).map((noticia) => (
                      <CompactCard key={noticia.id} noticia={noticia} />
                    ))}
                  </div>
                  {/* Bottom row: 3 articles */}
                  <div className="grid grid-cols-3 gap-3 flex-1">
                    {heroGridArticles.slice(2, 5).map((noticia) => (
                      <CompactCard key={noticia.id} noticia={noticia} />
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile: Show hero grid articles as regular cards */}
              <div className="lg:hidden mt-4 flex flex-col">
                {heroGridArticles.map((noticia, index) => (
                  <NewsCard
                    key={noticia.id}
                    noticia={noticia}
                    index={index + 1}
                  />
                ))}
              </div>
            </section>

            {/* ===== REMAINING ARTICLES + SIDEBAR ===== */}
            {remainingArticles.length > 0 && (
              <section className="lg:flex lg:gap-8">
                {/* Articles grid */}
                <div className="flex-1">
                  <h2 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary mb-4 pb-3 border-b border-border">
                    Más noticias del día
                  </h2>
                  <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                    {remainingArticles.map((noticia, index) => (
                      <NewsCard
                        key={noticia.id}
                        noticia={noticia}
                        index={index + 6}
                      />
                    ))}
                  </div>
                </div>

                {/* Sidebar - Desktop only */}
                <aside className="hidden lg:block w-72 shrink-0">
                  <Sidebar fechasDisponibles={fechasDisponibles} />
                </aside>
              </section>
            )}

            {/* If no remaining articles, still show sidebar */}
            {remainingArticles.length === 0 && (
              <aside className="hidden lg:block">
                <Sidebar fechasDisponibles={fechasDisponibles} />
              </aside>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-text-muted mb-2">No hay noticias para esta fecha</p>
            <p className="text-sm text-text-muted">
              Probá seleccionando otra fecha o categoría
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/sobre" className="hover:text-text-secondary">Sobre nosotros</Link>
            <Link href="/contacto" className="hover:text-text-secondary">Contacto</Link>
            <Link href="/privacidad" className="hover:text-text-secondary">Privacidad</Link>
            <Link href="/terminos" className="hover:text-text-secondary">Términos</Link>
          </div>
          <p className="text-center">
            Powered by AI · Fuente:{' '}
            <a
              href="https://www.boletinoficial.gob.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Boletín Oficial
            </a>
          </p>
        </div>
      </footer>

      <BottomTabBar />
    </div>
  );
}
