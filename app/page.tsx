'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { CategoryTabs } from '@/components/layout/CategoryTabs';
import { DateHeader } from '@/components/feed/DateHeader';
import { TemaFilter } from '@/components/feed/TemaFilter';
import { HeroCard } from '@/components/feed/HeroCard';
import { HeroBanner } from '@/components/feed/HeroBanner';
import { NewsCard } from '@/components/feed/NewsCard';
import { VariedNewsLayout, AdaptiveHeroLayout } from '@/components/feed/VariedNewsLayout';
import { SeccionResumen } from '@/components/feed/SeccionResumen';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopVotedSection, TopVotedProvider } from '@/components/feed/TopVotedSection';
import { VoteIndicator } from '@/components/feed/VoteIndicator';
import { VoteLegend } from '@/components/feed/VoteLegend';
import { NoticiasDia, Categoria, NoticiaPreview, Tema } from '@/lib/types';
import { CATEGORIAS, TEMAS, formatFechaCorta } from '@/lib/constants';
import { TemaIcon } from '@/components/shared/TemaIcon';
import { Star } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';

// Extended interface to include edition info
interface NoticiasDiaExtended extends NoticiasDia {
  edicionBoletin?: string;
}

// Compact card for the hero grid (right side)
function CompactCard({ noticia }: { noticia: NoticiaPreview }) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tema = noticia.tema ? TEMAS[noticia.tema] : null;
  const fechaFormateada = formatFechaCorta(noticia.fechaPublicacion.split('T')[0]);
  const { isSubscribed } = useUserData();
  const isSubscribedTema = noticia.tema && isSubscribed(noticia.tema);

  return (
    <article className={`flex flex-col h-full rounded-none overflow-hidden hover:shadow-md transition-all group ${
      isSubscribedTema
        ? 'bg-[#FFE455]/5 border-2 border-[#FFE455] glow-pulse'
        : 'bg-bg-surface'
    }`}>
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
        {/* Subscribed badge */}
        {isSubscribedTema && (
          <span className="absolute top-2 right-2 p-1.5 bg-[#FFE455] rounded-full shadow">
            <Star className="w-3 h-3 text-[#7A6200] fill-[#7A6200]" />
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Tema badge */}
        {tema && (
          <Link
            href={`/tema/${noticia.tema}`}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded border hover:opacity-80 transition-opacity w-fit"
            style={{
              color: tema.color,
              borderColor: tema.color,
              backgroundColor: `${tema.color}10`
            }}
          >
            <TemaIcon iconName={tema.icon} className="w-3 h-3" />
            {tema.label}
          </Link>
        )}

        {/* Title */}
        <div className="flex items-start gap-2">
          <Link href={`/articulo/${noticia.slug}`} className="flex-1">
            <h3 className="font-[family-name:var(--font-lora)] text-sm font-medium text-text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
              {noticia.titulo}
            </h3>
          </Link>
          <VoteIndicator slug={noticia.slug} />
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between mt-auto text-xs text-text-muted">
          <span>{fechaFormateada}</span>
          {noticia.urlOriginal && (
            <a
              href={noticia.urlOriginal}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              Original
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);
  const [fecha, setFechaState] = useState<string>('');
  const [categoria, setCategoria] = useState<Categoria | 'todos'>('todos');
  const [temaActivo, setTemaActivo] = useState<Tema | null>(null);
  const [filterByInterest, setFilterByInterest] = useState(false);
  const [noticias, setNoticias] = useState<NoticiasDiaExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const { subscriptions } = useUserData();

  // Update URL when date changes
  const setFecha = useCallback((newFecha: string) => {
    setFechaState(newFecha);
    const params = new URLSearchParams(searchParams.toString());
    params.set('fecha', newFecha);
    router.replace(`/?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Fetch available dates on mount
  useEffect(() => {
    async function fetchFechasDisponibles() {
      try {
        const res = await fetch('/api/noticias/fechas');
        const data = await res.json();
        const fechas = data.fechas || [];
        setFechasDisponibles(fechas);

        // Check if there's a date in URL, otherwise use most recent
        const urlFecha = searchParams.get('fecha');
        if (urlFecha && fechas.includes(urlFecha)) {
          setFechaState(urlFecha);
        } else if (fechas.length > 0) {
          setFechaState(fechas[0]);
        }
      } catch (error) {
        console.error('Error fetching fechas:', error);
        // Fallback to hardcoded dates if API fails
        const fallbackDates = ['2025-03-14', '2025-03-13', '2025-03-12', '2025-03-11'];
        setFechasDisponibles(fallbackDates);
        setFechaState(fallbackDates[0]);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchFechasDisponibles();
  }, [searchParams]);

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

  // Reset tema filter when date or category changes
  useEffect(() => {
    setTemaActivo(null);
    setFilterByInterest(false);
  }, [fecha, categoria]);

  // Get all news (before tema filter) for calculating available temas
  const allNewsRaw: NoticiaPreview[] = useMemo(() => {
    return noticias?.noticias || [];
  }, [noticias]);

  // Calculate available temas from current news
  const temasDisponibles = useMemo(() => {
    const temaSet = new Set<Tema>();
    allNewsRaw.forEach(n => {
      if (n.tema && TEMAS[n.tema]) {
        temaSet.add(n.tema);
      }
    });
    // Sort by number of articles (most first)
    const temaCounts = Array.from(temaSet).map(t => ({
      tema: t,
      count: allNewsRaw.filter(n => n.tema === t).length
    }));
    temaCounts.sort((a, b) => b.count - a.count);
    return temaCounts.map(t => t.tema);
  }, [allNewsRaw]);

  // Filter by tema or interest
  const allNews: NoticiaPreview[] = useMemo(() => {
    let filtered = allNewsRaw;

    if (filterByInterest && subscriptions.length > 0) {
      filtered = filtered.filter(n => n.tema && subscriptions.includes(n.tema));
    } else if (temaActivo) {
      filtered = filtered.filter(n => n.tema === temaActivo);
    }

    return filtered;
  }, [allNewsRaw, temaActivo, filterByInterest, subscriptions]);

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
    <TopVotedProvider>
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      <Header />
      <HeroBanner />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-6">
        <DateHeader
          fecha={fecha}
          fechasDisponibles={fechasDisponibles}
          onDateChange={setFecha}
          edicionBoletin={noticias?.edicionBoletin}
        />
        <div className="mt-4">
          <CategoryTabs activeCategory={categoria} onCategoryChange={setCategoria} />
        </div>

        {/* Tema Filter - Solo para categorías con múltiples artículos */}
        {!loading && (temasDisponibles.length > 0 || subscriptions.length > 0) &&
         categoria !== 'empresas' && categoria !== 'contrataciones' && categoria !== 'judicial' && (
          <div className="mt-4 mb-6">
            <TemaFilter
              temasDisponibles={temasDisponibles}
              temaActivo={temaActivo}
              onTemaChange={setTemaActivo}
              showInterestFilter={true}
              filterByInterest={filterByInterest}
              onInterestFilterChange={setFilterByInterest}
            />
          </div>
        )}

        {/* Secciones especiales: mostrar resumen directamente */}
        {(categoria === 'empresas' || categoria === 'contrataciones' || categoria === 'judicial') ? (
          <div className="mt-6 lg:flex lg:gap-8">
            <div className="flex-1">
              <SeccionResumen
                seccion={categoria === 'empresas' ? 'segunda' : categoria === 'contrataciones' ? 'tercera' : 'cuarta'}
                fecha={fecha}
              />
            </div>
            <aside className="hidden lg:block w-72 shrink-0 mt-6 lg:mt-0">
              <Sidebar fechasDisponibles={fechasDisponibles} />
            </aside>
          </div>
        ) : loading ? (
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
            {/* Legend */}
            <VoteLegend />

            {/* ===== ADAPTIVE LAYOUT based on article count ===== */}
            {allNews.length <= 5 ? (
              /* Pocos artículos: layout adaptativo */
              <section className="lg:flex lg:gap-8">
                <div className="flex-1">
                  <AdaptiveHeroLayout articles={allNews} />
                </div>
                <aside className="hidden lg:block w-72 shrink-0 mt-6 lg:mt-0">
                  <Sidebar fechasDisponibles={fechasDisponibles} />
                </aside>
              </section>
            ) : (
              /* 6+ artículos: layout completo de diario */
              <>
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

                  {/* Mobile: Show hero grid articles with top voted sections interspersed */}
                  <div className="lg:hidden mt-4 flex flex-col gap-4">
                    {/* First 2 news */}
                    {heroGridArticles.slice(0, 2).map((noticia, index) => (
                      <NewsCard
                        key={noticia.id}
                        noticia={noticia}
                        index={index + 1}
                      />
                    ))}

                    {/* Más apoyadas */}
                    <TopVotedSection type="apoyadas" />

                    {/* Next 2 news */}
                    {heroGridArticles.slice(2, 4).map((noticia, index) => (
                      <NewsCard
                        key={noticia.id}
                        noticia={noticia}
                        index={index + 3}
                      />
                    ))}

                    {/* Más cuestionadas */}
                    <TopVotedSection type="cuestionadas" />

                    {/* Remaining news */}
                    {heroGridArticles.slice(4).map((noticia, index) => (
                      <NewsCard
                        key={noticia.id}
                        noticia={noticia}
                        index={index + 5}
                      />
                    ))}
                  </div>
                </section>

                {/* ===== REMAINING ARTICLES + SIDEBAR ===== */}
                {remainingArticles.length > 0 && (
                  <section className="lg:flex lg:gap-8">
                    {/* Articles with varied layout */}
                    <div className="flex-1">
                      <h2 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary mb-4 pb-3 border-b border-border">
                        Más noticias del día
                      </h2>
                      <VariedNewsLayout articles={remainingArticles} startIndex={6} />
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
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-text-muted mb-2">
              {filterByInterest
                ? 'No hay noticias de tus temas de interés para esta fecha'
                : temaActivo
                ? `No hay noticias de ${TEMAS[temaActivo]?.label || temaActivo} para esta fecha`
                : 'No hay noticias para esta fecha'}
            </p>
            <p className="text-sm text-text-muted">
              {filterByInterest ? (
                <button
                  onClick={() => setFilterByInterest(false)}
                  className="text-accent hover:underline"
                >
                  Ver todas las noticias
                </button>
              ) : temaActivo ? (
                <button
                  onClick={() => setTemaActivo(null)}
                  className="text-accent hover:underline"
                >
                  Limpiar filtro de tema
                </button>
              ) : (
                'Probá seleccionando otra fecha o categoría'
              )}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      <BottomTabBar />
    </div>
    </TopVotedProvider>
  );
}

// Loading fallback for Suspense
function HomeLoading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-text-muted">Cargando Boletín Oficial...</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
