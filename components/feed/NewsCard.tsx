'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Star } from 'lucide-react';
import { NoticiaPreview } from '@/lib/types';
import { CATEGORIAS, TEMAS, formatFechaCorta, TIPO_DOCUMENTO_LABELS } from '@/lib/constants';
import { TemaIcon } from '@/components/shared/TemaIcon';
import { useUserData } from '@/contexts/UserDataContext';
import { VoteIndicator } from '@/components/feed/VoteIndicator';

interface NewsCardProps {
  noticia: NoticiaPreview;
  index: number;
  highlighted?: boolean;
}

export function NewsCard({ noticia, index, highlighted = false }: NewsCardProps) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tema = noticia.tema ? TEMAS[noticia.tema] : null;
  const fechaFormateada = formatFechaCorta(noticia.fechaPublicacion.split('T')[0]);
  const tipoDoc = TIPO_DOCUMENTO_LABELS[noticia.tipoDocumento] || noticia.tipoDocumento;
  const displayNumber = String(index + 1).padStart(2, '0');
  const [mounted, setMounted] = useState(false);
  const { isSubscribed } = useUserData();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSubscribedTema = mounted && noticia.tema && isSubscribed(noticia.tema);

  return (
    <article
      className={`flex gap-4 py-5 border-t rounded-none transition-all ${
        isSubscribedTema
          ? 'border-2 border-[#FFE455] bg-[#FFE455]/5 p-4 -mx-2 shadow-sm'
          : highlighted
          ? 'bg-bg-highlight p-5 -mx-4 border-0'
          : 'border-border'
      }`}
    >
      {/* Number + Badge */}
      <div className="flex flex-col items-center gap-1">
        <span
          className={`font-[family-name:var(--font-lora)] text-3xl font-medium tracking-tight ${
            isSubscribedTema || highlighted ? 'text-[#FFE455]' : 'text-border'
          }`}
        >
          {displayNumber}
        </span>
        {isSubscribedTema && (
          <Star className="w-4 h-4 text-[#FFE455] fill-[#FFE455]" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {/* Tags Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2 py-[2px] text-[10px] font-semibold tracking-[1px] text-white rounded shrink-0"
            style={{ backgroundColor: categoria.color }}
          >
            {categoria.label}
          </span>
          {tema && (
            <Link
              href={`/tema/${noticia.tema}`}
              className="flex items-center gap-1 px-2 py-[2px] text-[10px] font-medium rounded border hover:opacity-80 transition-opacity shrink-0"
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
        <div className="flex items-start gap-2">
          <Link href={`/articulo/${noticia.slug}`} className="flex-1">
            <h3 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary leading-snug hover:text-accent transition-colors">
              {noticia.titulo}
            </h3>
          </Link>
          <VoteIndicator slug={noticia.slug} />
        </div>

        {/* Excerpt */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
          {noticia.extracto}
        </p>

        {/* Meta Row with Original Link */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-xs text-text-muted">{fechaFormateada}</span>

          {/* Link to original Boletín Oficial */}
          {noticia.urlOriginal && (
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
          )}
        </div>
      </div>
    </article>
  );
}
