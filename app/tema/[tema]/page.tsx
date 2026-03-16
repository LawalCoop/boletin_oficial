'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, BellOff, Clock, ExternalLink } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { NoticiaPreview, Tema } from '@/lib/types';
import { TEMAS, formatFechaCorta, TIPO_DOCUMENTO_LABELS, CATEGORIAS } from '@/lib/constants';

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (!data || !TEMAS[tema]) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-text-secondary">Tema no encontrado</p>
        <Link href="/" className="text-accent hover:underline mt-4 inline-block">
          Volver al inicio
        </Link>
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

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 bg-bg border-b border-border z-10">
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
        className="px-4 py-6 border-b border-border"
        style={{ backgroundColor: `${data.temaInfo.color}08` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${data.temaInfo.color}20` }}
              >
                {TemaIcon && (
                  <TemaIcon
                    className="w-6 h-6"
                    style={{ color: data.temaInfo.color }}
                  />
                )}
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary">
                  {data.temaInfo.label}
                </h2>
                <p className="text-sm text-text-muted">
                  {data.total} {data.total === 1 ? 'noticia' : 'noticias'}
                </p>
              </div>
            </div>
            <p className="text-sm text-text-secondary">
              Todas las novedades del Boletín Oficial relacionadas con {data.temaInfo.label.toLowerCase()}.
            </p>
          </div>

          {/* Subscribe Button */}
          <button
            onClick={() => setSubscribed(!subscribed)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              subscribed
                ? 'bg-bg border border-border text-text-secondary'
                : 'text-white'
            }`}
            style={!subscribed ? { backgroundColor: data.temaInfo.color } : undefined}
          >
            {subscribed ? (
              <>
                <BellOff className="w-4 h-4" />
                <span className="hidden sm:inline">Suscripto</span>
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Suscribirse</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* News List */}
      <div className="px-4">
        {data.noticias.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-text-secondary">No hay noticias de este tema todavía.</p>
          </div>
        ) : (
          fechasOrdenadas.map(fecha => (
            <div key={fecha}>
              {/* Date Header */}
              <div className="py-3 border-b border-border">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  {formatFechaCorta(fecha)}
                </span>
              </div>

              {/* News Items */}
              {noticiasPorFecha[fecha].map((noticia, index) => {
                const categoria = CATEGORIAS[noticia.categoria];
                const tipoDoc = TIPO_DOCUMENTO_LABELS[noticia.tipoDocumento] || noticia.tipoDocumento;

                return (
                  <article
                    key={noticia.id}
                    className="flex gap-[14px] py-4 border-b border-border"
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
                          className="px-2 py-[2px] text-[9px] font-semibold tracking-[1px] text-white rounded"
                          style={{ backgroundColor: categoria.color }}
                        >
                          {categoria.label}
                        </span>
                        <span className="text-[9px] font-medium text-text-muted tracking-wide uppercase">
                          {tipoDoc} {noticia.numeroDocumento}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/articulo/${noticia.slug}`}>
                        <h3 className="font-[family-name:var(--font-lora)] text-[15px] font-medium text-text-primary leading-[1.3] hover:text-accent transition-colors">
                          {noticia.titulo}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-xs text-text-secondary leading-[1.4] line-clamp-2">
                        {noticia.extracto}
                      </p>

                      {/* Meta Row */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-[6px] text-[10px] text-text-muted">
                          <span>{formatFechaCorta(noticia.fechaPublicacion)}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-[10px] h-[10px]" />
                            {noticia.tiempoLectura} min
                          </span>
                        </div>

                        <a
                          href={noticia.urlOriginal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-[10px] font-medium text-accent hover:underline shrink-0"
                        >
                          <ExternalLink className="w-[10px] h-[10px]" />
                          Original
                        </a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
