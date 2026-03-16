'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, BellOff, Clock, ExternalLink, TrendingUp, Calendar } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { NoticiaPreview, Tema } from '@/lib/types';
import { TEMAS, formatFechaCorta, TIPO_DOCUMENTO_LABELS, CATEGORIAS } from '@/lib/constants';
import { Header } from '@/components/layout/Header';
import { BottomTabBar } from '@/components/layout/BottomTabBar';

interface TemaPageData {
  tema: string;
  temaInfo: { label: string; icon: string; color: string };
  noticias: (NoticiaPreview & { fechaBoletin: string })[];
  total: number;
}

// Helper to get icon component dynamically
function getIconComponent(iconName: string) {
  const pascalName = iconName.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalName];
}

// Other themes to show in sidebar
const otherTemas: Tema[] = ['energia', 'transporte', 'finanzas', 'trabajo', 'salud', 'comercio-exterior', 'impuestos', 'agro'];

export default function TemaPage({ params }: { params: Promise<{ tema: string }> }) {
  const resolvedParams = use(params);
  const tema = resolvedParams.tema as Tema;
  const [data, setData] = useState<TemaPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/noticias/tema/${tema}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Error fetching tema data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [tema]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="hidden lg:block">
          <Header />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      </div>
    );
  }

  if (!data || !TEMAS[tema]) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="hidden lg:block">
          <Header />
        </div>
        <div className="px-4 py-8 text-center">
          <p className="text-text-secondary">Tema no encontrado</p>
          <Link href="/" className="text-accent hover:underline mt-4 inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const TemaIcon = getIconComponent(data.temaInfo.icon);

  // Group news by date
  const noticiasPorFecha = data.noticias.reduce((acc, noticia) => {
    const fecha = noticia.fechaBoletin;
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(noticia);
    return acc;
  }, {} as Record<string, (NoticiaPreview & { fechaBoletin: string })[]>);

  const fechasOrdenadas = Object.keys(noticiasPorFecha).sort((a, b) => b.localeCompare(a));

  // Filter other themes excluding current one
  const relatedTemas = otherTemas.filter(t => t !== tema).slice(0, 6);

  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 bg-bg border-b border-border z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-1 hover:bg-bg-surface rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </Link>
          <div className="flex-1 flex items-center gap-2">
            {TemaIcon && (
              <TemaIcon
                className="w-5 h-5"
                style={{ color: data.temaInfo.color }}
              />
            )}
            <h1 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary">
              {data.temaInfo.label}
            </h1>
          </div>
        </div>
      </header>

      {/* Theme Hero */}
      <div
        className="border-b border-border"
        style={{ backgroundColor: `${data.temaInfo.color}08` }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
          {/* Breadcrumb - Desktop only */}
          <nav className="hidden lg:flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-text-secondary transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span>Temas</span>
            <span>/</span>
            <span className="text-text-primary">{data.temaInfo.label}</span>
          </nav>

          <div className="flex items-start justify-between gap-4 lg:gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                <div
                  className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${data.temaInfo.color}20` }}
                >
                  {TemaIcon && (
                    <TemaIcon
                      className="w-6 h-6 lg:w-8 lg:h-8"
                      style={{ color: data.temaInfo.color }}
                    />
                  )}
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-lora)] text-xl lg:text-3xl font-medium text-text-primary">
                    {data.temaInfo.label}
                  </h2>
                  <p className="text-sm lg:text-base text-text-muted">
                    {data.total} {data.total === 1 ? 'noticia' : 'noticias'} publicadas
                  </p>
                </div>
              </div>
              <p className="text-sm lg:text-base text-text-secondary max-w-2xl">
                Todas las novedades del Boletín Oficial relacionadas con {data.temaInfo.label.toLowerCase()}.
                Decretos, resoluciones y disposiciones que impactan en este sector.
              </p>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={() => setSubscribed(!subscribed)}
              className={`flex items-center gap-2 px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium text-sm lg:text-base transition-all shrink-0 ${
                subscribed
                  ? 'bg-bg border border-border text-text-secondary'
                  : 'text-white shadow-lg hover:shadow-xl'
              }`}
              style={!subscribed ? { backgroundColor: data.temaInfo.color } : undefined}
            >
              {subscribed ? (
                <>
                  <BellOff className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Suscripto</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Suscribirse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto lg:flex lg:gap-8 lg:px-8 lg:py-8">
        {/* News List */}
        <main className="flex-1 px-4 lg:px-0">
          {data.noticias.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-text-secondary">No hay noticias de este tema todavía.</p>
            </div>
          ) : (
            fechasOrdenadas.map(fecha => (
              <div key={fecha}>
                {/* Date Header */}
                <div className="py-3 lg:py-4 border-b border-border flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-text-muted hidden lg:block" />
                  <span className="text-xs lg:text-sm font-medium text-text-muted uppercase tracking-wide">
                    {formatFechaCorta(fecha)}
                  </span>
                  <span className="text-xs text-text-muted hidden lg:inline">
                    · {noticiasPorFecha[fecha].length} {noticiasPorFecha[fecha].length === 1 ? 'noticia' : 'noticias'}
                  </span>
                </div>

                {/* News Items - Grid on desktop */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                  {noticiasPorFecha[fecha].map((noticia, index) => {
                    const categoria = CATEGORIAS[noticia.categoria];
                    const tipoDoc = TIPO_DOCUMENTO_LABELS[noticia.tipoDocumento] || noticia.tipoDocumento;

                    return (
                      <article
                        key={noticia.id}
                        className="flex gap-[14px] py-4 border-b border-border hover:bg-bg-surface/50 lg:px-3 lg:-mx-3 lg:rounded-lg transition-colors"
                      >
                        {/* Number */}
                        <span className="font-[family-name:var(--font-lora)] text-2xl font-medium tracking-tight text-border">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Content */}
                        <div className="flex flex-col gap-[6px] flex-1 min-w-0">
                          {/* Tags Row */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="px-2 py-[2px] text-[9px] lg:text-[10px] font-semibold tracking-[1px] text-white rounded"
                              style={{ backgroundColor: categoria.color }}
                            >
                              {categoria.label}
                            </span>
                            <span className="text-[9px] lg:text-[10px] font-medium text-text-muted tracking-wide uppercase">
                              {tipoDoc} {noticia.numeroDocumento}
                            </span>
                          </div>

                          {/* Title */}
                          <Link href={`/articulo/${noticia.slug}`}>
                            <h3 className="font-[family-name:var(--font-lora)] text-[15px] lg:text-base font-medium text-text-primary leading-[1.3] hover:text-accent transition-colors">
                              {noticia.titulo}
                            </h3>
                          </Link>

                          {/* Excerpt */}
                          <p className="text-xs lg:text-sm text-text-secondary leading-[1.4] line-clamp-2">
                            {noticia.extracto}
                          </p>

                          {/* Meta Row */}
                          <div className="flex items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-[6px] text-[10px] lg:text-xs text-text-muted">
                              <span>{formatFechaCorta(noticia.fechaPublicacion)}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-[10px] h-[10px] lg:w-3 lg:h-3" />
                                {noticia.tiempoLectura} min
                              </span>
                            </div>

                            <a
                              href={noticia.urlOriginal}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[10px] lg:text-xs font-medium text-accent hover:underline shrink-0"
                            >
                              <ExternalLink className="w-[10px] h-[10px] lg:w-3 lg:h-3" />
                              Original
                            </a>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </main>

        {/* Sidebar - Desktop only */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-20 flex flex-col gap-6">
            {/* Related Themes */}
            <div className="bg-bg-surface rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-accent" />
                <h3 className="font-[family-name:var(--font-lora)] text-base font-medium text-text-primary">
                  Otros temas
                </h3>
              </div>
              <div className="flex flex-col gap-2">
                {relatedTemas.map((t) => {
                  const temaInfo = TEMAS[t];
                  const TIcon = getIconComponent(temaInfo.icon);
                  return (
                    <Link
                      key={t}
                      href={`/tema/${t}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg transition-colors group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${temaInfo.color}15` }}
                      >
                        {TIcon && (
                          <TIcon
                            className="w-4 h-4"
                            style={{ color: temaInfo.color }}
                          />
                        )}
                      </div>
                      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                        {temaInfo.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/temas"
                className="block mt-3 text-xs text-accent hover:underline text-center"
              >
                Ver todos los temas
              </Link>
            </div>

            {/* Stats Card */}
            <div className="bg-bg-surface rounded-lg p-4">
              <h3 className="font-[family-name:var(--font-lora)] text-base font-medium text-text-primary mb-4">
                Estadísticas
              </h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-muted">Total de noticias</dt>
                  <dd className="font-medium text-text-primary">{data.total}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Fechas cubiertas</dt>
                  <dd className="font-medium text-text-primary">{fechasOrdenadas.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Última actualización</dt>
                  <dd className="font-medium text-text-primary">
                    {fechasOrdenadas[0] ? formatFechaCorta(fechasOrdenadas[0]) : '-'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Subscribe CTA */}
            <div
              className="rounded-lg p-4 border"
              style={{
                backgroundColor: `${data.temaInfo.color}08`,
                borderColor: `${data.temaInfo.color}30`
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4" style={{ color: data.temaInfo.color }} />
                <h3 className="font-medium text-text-primary text-sm">
                  Alertas de {data.temaInfo.label}
                </h3>
              </div>
              <p className="text-xs text-text-secondary mb-3">
                Recibí notificaciones cuando se publiquen nuevas normas sobre este tema.
              </p>
              <button
                onClick={() => setSubscribed(!subscribed)}
                className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  subscribed
                    ? 'bg-bg border border-border text-text-secondary'
                    : 'text-white'
                }`}
                style={!subscribed ? { backgroundColor: data.temaInfo.color } : undefined}
              >
                {subscribed ? 'Suscripto' : 'Suscribirse'}
              </button>
            </div>

            {/* Footer */}
            <div className="text-xs text-text-muted">
              <p>
                Fuente:{' '}
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
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
}
