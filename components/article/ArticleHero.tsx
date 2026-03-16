'use client';

import { ArrowLeft, Share2, Bookmark, MoreVertical, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Articulo } from '@/lib/types';
import { CATEGORIAS, TEMAS, calcularTiempoTranscurrido, TIPO_DOCUMENTO_LABELS } from '@/lib/constants';
import { TemaIcon } from '@/components/shared/TemaIcon';

interface ArticleHeroProps {
  articulo: Articulo;
}

export function ArticleHero({ articulo }: ArticleHeroProps) {
  const categoria = CATEGORIAS[articulo.metadata.categoria];
  const tema = articulo.metadata.tema ? TEMAS[articulo.metadata.tema] : null;
  const tiempoTranscurrido = calcularTiempoTranscurrido(articulo.fechaPublicacion);
  const tipoDoc = TIPO_DOCUMENTO_LABELS[articulo.metadata.tipoDocumento] || articulo.metadata.tipoDocumento;

  return (
    <>
      {/* Mobile Navigation - Only visible on mobile */}
      <nav className="lg:hidden flex items-center justify-between h-[52px] px-5 border-b border-border bg-bg sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-[6px]">
          <ArrowLeft className="w-[22px] h-[22px] text-text-primary" />
          <span className="text-sm font-medium text-text-primary">Feed</span>
        </Link>
        <div className="flex items-center gap-4">
          <button aria-label="Compartir">
            <Share2 className="w-5 h-5 text-text-muted" />
          </button>
          <button aria-label="Guardar">
            <Bookmark className="w-5 h-5 text-text-muted" />
          </button>
          <button aria-label="Más opciones">
            <MoreVertical className="w-5 h-5 text-text-muted" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-[340px] lg:h-[400px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-bg-surface"
          style={articulo.imagen ? { backgroundImage: `url(${articulo.imagen})` } : undefined}
        >
          {!articulo.imagen && (
            <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-0">
          <div className="lg:max-w-7xl lg:mx-auto lg:px-8 lg:pb-10">
            <div className="flex flex-col gap-3 lg:max-w-3xl">
              {/* Breadcrumb - Desktop only */}
              <nav className="hidden lg:flex items-center gap-2 text-sm text-white/70 mb-2">
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
                <span>/</span>
                <span>{categoria.label}</span>
                {tema && (
                  <>
                    <span>/</span>
                    <Link
                      href={`/tema/${articulo.metadata.tema}`}
                      className="hover:text-white transition-colors"
                    >
                      {tema.label}
                    </Link>
                  </>
                )}
              </nav>

              {/* Tag Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="px-2 py-[3px] text-[10px] lg:text-[11px] font-semibold tracking-[1px] text-white rounded"
                  style={{ backgroundColor: categoria.color }}
                >
                  {categoria.label}
                </span>
                {tema && (
                  <Link
                    href={`/tema/${articulo.metadata.tema}`}
                    className="flex items-center gap-1 px-2 py-[3px] text-[10px] lg:text-[11px] font-medium rounded border border-white/30 text-white hover:bg-white/10 transition-colors"
                  >
                    {tema && <TemaIcon iconName={tema.icon} className="w-3 h-3" />}
                    {tema.label}
                  </Link>
                )}
                <span className="text-[11px] lg:text-xs text-white/80">
                  {tiempoTranscurrido} · {articulo.tiempoLectura} min lectura
                </span>
              </div>

              {/* Title */}
              <h1 className="font-[family-name:var(--font-lora)] text-[22px] lg:text-3xl xl:text-4xl font-medium text-white leading-[1.2] tracking-tight">
                {articulo.contenidoIA.titulo}
              </h1>

              {/* Document Info with Link to Original */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] lg:text-sm text-white/70">
                  {tipoDoc} {articulo.metadata.numeroDocumento}
                </span>
                <span className="text-white/50">·</span>
                <span className="text-[11px] lg:text-sm text-white/70">
                  {articulo.metadata.organismoEmisor}
                </span>
                <span className="text-white/50 hidden lg:inline">·</span>
                <a
                  href={articulo.metadata.urlOriginal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] lg:text-sm font-medium text-white hover:underline"
                >
                  Ver en Boletín Oficial
                  <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
