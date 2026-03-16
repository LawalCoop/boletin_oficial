'use client';

import Link from 'next/link';
import { ExternalLink, Clock } from 'lucide-react';
import { NoticiaPreview } from '@/lib/types';
import { CATEGORIAS, TEMAS, calcularTiempoTranscurrido, TIPO_DOCUMENTO_LABELS } from '@/lib/constants';
import { TemaIcon } from '@/components/shared/TemaIcon';

interface HeroCardProps {
  noticia: NoticiaPreview;
}

export function HeroCard({ noticia }: HeroCardProps) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tema = noticia.tema ? TEMAS[noticia.tema] : null;
  const tiempoTranscurrido = calcularTiempoTranscurrido(noticia.fechaPublicacion);
  const tipoDoc = TIPO_DOCUMENTO_LABELS[noticia.tipoDocumento] || noticia.tipoDocumento;

  return (
    <article className="border border-border rounded-lg overflow-hidden bg-bg hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Hero Image */}
      <div className="relative h-[200px] lg:h-[220px] bg-bg-surface">
        {noticia.imagen ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${noticia.imagen})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
        )}
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 lg:p-5 flex flex-col gap-3 flex-1">
        {/* Tags Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2 py-1 text-[11px] font-semibold tracking-[1px] text-white rounded"
            style={{ backgroundColor: categoria.color }}
          >
            {categoria.label}
          </span>
          {tema && (
            <Link
              href={`/tema/${noticia.tema}`}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border hover:opacity-80 transition-opacity"
              style={{
                color: tema.color,
                borderColor: tema.color,
                backgroundColor: `${tema.color}10`
              }}
            >
              <TemaIcon iconName={tema.icon} className="w-3.5 h-3.5" />
              {tema.label}
            </Link>
          )}
          <span className="text-[11px] font-medium text-text-muted tracking-wide uppercase">
            {tipoDoc} {noticia.numeroDocumento}
          </span>
        </div>

        {/* Title - Link to article detail */}
        <Link href={`/articulo/${noticia.slug}`} className="flex-1">
          <h2 className="font-[family-name:var(--font-lora)] text-xl lg:text-2xl font-medium text-text-primary leading-tight hover:text-accent transition-colors line-clamp-3">
            {noticia.titulo}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {noticia.extracto}
        </p>

        {/* Meta Row */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>{tiempoTranscurrido}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {noticia.tiempoLectura} min
            </span>
          </div>

          {/* Link to original Boletín Oficial */}
          <a
            href={noticia.urlOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            Ver original
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
