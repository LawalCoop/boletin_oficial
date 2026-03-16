'use client';

import Link from 'next/link';
import { ExternalLink, Clock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { NoticiaPreview } from '@/lib/types';
import { CATEGORIAS, TEMAS, calcularTiempoTranscurrido, TIPO_DOCUMENTO_LABELS } from '@/lib/constants';

interface HeroCardProps {
  noticia: NoticiaPreview;
}

// Helper to get icon component dynamically
function getIconComponent(iconName: string) {
  const pascalName = iconName.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalName];
}

export function HeroCard({ noticia }: HeroCardProps) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tema = noticia.tema ? TEMAS[noticia.tema] : null;
  const tiempoTranscurrido = calcularTiempoTranscurrido(noticia.fechaPublicacion);
  const tipoDoc = TIPO_DOCUMENTO_LABELS[noticia.tipoDocumento] || noticia.tipoDocumento;

  const TemaIcon = tema ? getIconComponent(tema.icon) : null;

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
      <div className="p-4 lg:p-5 flex flex-col gap-[10px] flex-1">
        {/* Tags Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2 py-[3px] text-[10px] font-semibold tracking-[1px] text-white rounded"
            style={{ backgroundColor: categoria.color }}
          >
            {categoria.label}
          </span>
          {tema && (
            <Link
              href={`/tema/${noticia.tema}`}
              className="flex items-center gap-1 px-2 py-[3px] text-[10px] font-medium rounded border hover:opacity-80 transition-opacity"
              style={{
                color: tema.color,
                borderColor: tema.color,
                backgroundColor: `${tema.color}10`
              }}
            >
              {TemaIcon && <TemaIcon className="w-3 h-3" />}
              {tema.label}
            </Link>
          )}
          <span className="text-[10px] font-medium text-text-muted tracking-wide uppercase">
            {tipoDoc} {noticia.numeroDocumento}
          </span>
        </div>

        {/* Title - Link to article detail */}
        <Link href={`/articulo/${noticia.slug}`} className="flex-1">
          <h2 className="font-[family-name:var(--font-lora)] text-lg lg:text-xl font-medium text-text-primary leading-[1.25] hover:text-accent transition-colors line-clamp-3">
            {noticia.titulo}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-[13px] text-text-secondary leading-[1.45] line-clamp-2">
          {noticia.extracto}
        </p>

        {/* Meta Row */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <span>{tiempoTranscurrido}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {noticia.tiempoLectura} min
            </span>
          </div>

          {/* Link to original Boletín Oficial */}
          <a
            href={noticia.urlOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
          >
            Ver original
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
