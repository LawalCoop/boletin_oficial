'use client';

import Link from 'next/link';
import { ExternalLink, Clock } from 'lucide-react';
import { NoticiaPreview } from '@/lib/types';
import { CATEGORIAS, TEMAS, calcularTiempoTranscurrido, TIPO_DOCUMENTO_LABELS } from '@/lib/constants';
import { TemaIcon } from '@/components/shared/TemaIcon';

interface NewsCardProps {
  noticia: NoticiaPreview;
  index: number;
  highlighted?: boolean;
}

export function NewsCard({ noticia, index, highlighted = false }: NewsCardProps) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tema = noticia.tema ? TEMAS[noticia.tema] : null;
  const tiempoTranscurrido = calcularTiempoTranscurrido(noticia.fechaPublicacion);
  const tipoDoc = TIPO_DOCUMENTO_LABELS[noticia.tipoDocumento] || noticia.tipoDocumento;
  const displayNumber = String(index + 1).padStart(2, '0');

  return (
    <article
      className={`flex gap-4 py-5 border-t border-border ${
        highlighted ? 'bg-bg-highlight p-5 -mx-4 border-0' : ''
      }`}
    >
      {/* Number */}
      <span
        className={`font-[family-name:var(--font-lora)] text-3xl font-medium tracking-tight ${
          highlighted ? 'text-[#D4A843]' : 'text-border'
        }`}
      >
        {displayNumber}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {/* Tags Row - No wrap to keep titles aligned across cards */}
        <div className="flex items-center gap-2 overflow-hidden">
          <span
            className="px-2 py-[2px] text-[10px] font-semibold tracking-[1px] text-white rounded"
            style={{ backgroundColor: categoria.color }}
          >
            {categoria.label}
          </span>
          {tema && (
            <Link
              href={`/tema/${noticia.tema}`}
              className="flex items-center gap-1 px-2 py-[2px] text-[10px] font-medium rounded border hover:opacity-80 transition-opacity"
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
          <span className="text-[10px] font-medium text-text-muted tracking-wide uppercase">
            {tipoDoc} {noticia.numeroDocumento}
          </span>
        </div>

        {/* Title - Link to article detail */}
        <Link href={`/articulo/${noticia.slug}`}>
          <h3 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary leading-snug hover:text-accent transition-colors">
            {noticia.titulo}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {noticia.extracto}
        </p>

        {/* Meta Row with Original Link */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>{tiempoTranscurrido}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {noticia.tiempoLectura} min
            </span>
          </div>

          {/* Link to original Boletín Oficial - Always visible */}
          <a
            href={noticia.urlOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline shrink-0"
            title="Ver documento original en el Boletín Oficial"
          >
            <ExternalLink className="w-3 h-3" />
            Original
          </a>
        </div>
      </div>
    </article>
  );
}
