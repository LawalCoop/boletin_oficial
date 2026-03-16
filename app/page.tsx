'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { CategoryTabs } from '@/components/layout/CategoryTabs';
import { DateHeader } from '@/components/feed/DateHeader';
import { HeroCard } from '@/components/feed/HeroCard';
import { NewsCard } from '@/components/feed/NewsCard';
import { Sidebar } from '@/components/layout/Sidebar';
import { NoticiasDia, Categoria, NoticiaPreview } from '@/lib/types';

// Extended interface to include edition info
interface NoticiasDiaExtended extends NoticiasDia {
  edicionBoletin?: string;
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

  // Separate featured and regular news
  const featuredNews: NoticiaPreview[] = noticias?.noticias.filter(n => n.destacado) || [];
  const regularNews: NoticiaPreview[] = noticias?.noticias.filter(n => !n.destacado) || [];

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

      <div className="max-w-7xl mx-auto lg:flex lg:gap-8 lg:px-8 lg:py-6">
        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-0 py-5 lg:py-0">
          <DateHeader
            fecha={fecha}
            fechasDisponibles={fechasDisponibles}
            onDateChange={setFecha}
            edicionBoletin={noticias?.edicionBoletin}
          />

          {loading ? (
            <div className="flex flex-col gap-6 mt-6">
              {/* Loading skeleton */}
              <div className="h-[300px] bg-bg-surface rounded animate-pulse" />
              <div className="lg:grid lg:grid-cols-2 lg:gap-6">
                <div className="h-[100px] bg-bg-surface rounded animate-pulse" />
                <div className="h-[100px] bg-bg-surface rounded animate-pulse hidden lg:block" />
              </div>
            </div>
          ) : noticias && noticias.noticias.length > 0 ? (
            <div className="flex flex-col gap-6 mt-4">
              {/* Featured News Grid - Desktop shows 2 columns for hero */}
              {featuredNews.length > 0 && (
                <div className="lg:grid lg:grid-cols-2 lg:gap-6">
                  <div className="lg:col-span-1">
                    <HeroCard noticia={featuredNews[0]} />
                  </div>
                  {featuredNews[1] && (
                    <div className="hidden lg:block lg:col-span-1">
                      <HeroCard noticia={featuredNews[1]} />
                    </div>
                  )}
                </div>
              )}

              {/* Regular News - Desktop shows 2 columns */}
              <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                {regularNews.map((noticia, index) => (
                  <NewsCard
                    key={noticia.id}
                    noticia={noticia}
                    index={index}
                    highlighted={false}
                  />
                ))}
              </div>

              {/* Additional featured news (mobile only, already shown in grid on desktop) */}
              <div className="lg:hidden">
                {featuredNews.slice(1).map((noticia, index) => (
                  <NewsCard
                    key={noticia.id}
                    noticia={noticia}
                    index={regularNews.length + index}
                    highlighted={true}
                  />
                ))}
              </div>
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

        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:block w-80 shrink-0">
          <Sidebar fechasDisponibles={fechasDisponibles} />
        </aside>
      </div>

      <BottomTabBar />
    </div>
  );
}
