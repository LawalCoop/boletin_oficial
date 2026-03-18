'use client';

import Link from 'next/link';
import { ExternalLink, Clock, Star } from 'lucide-react';
import { NoticiaPreview } from '@/lib/types';
import { CATEGORIAS, TEMAS, calcularTiempoTranscurrido, TIPO_DOCUMENTO_LABELS } from '@/lib/constants';
import { TemaIcon } from '@/components/shared/TemaIcon';
import { useUserData } from '@/contexts/UserDataContext';
import { VoteIndicator } from '@/components/feed/VoteIndicator';

interface HeroCardProps {
  noticia: NoticiaPreview;
}

export function HeroCard({ noticia }: HeroCardProps) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tema = noticia.tema ? TEMAS[noticia.tema] : null;
  const tiempoTranscurrido = calcularTiempoTranscurrido(noticia.fechaPublicacion);
  const tipoDoc = TIPO_DOCUMENTO_LABELS[noticia.tipoDocumento] || noticia.tipoDocumento;
  const { isSubscribed } = useUserData();
  const isSubscribedTema = noticia.tema && isSubscribed(noticia.tema);

  return (
    <article className={`rounded-lg overflow-hidden bg-bg hover:shadow-lg transition-all h-full flex flex-col ${
      isSubscribedTema
        ? 'border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.5)] ring-2 ring-[#FFD700]/20'
        : 'border border-border'
    }`}>
      {/* Hero Image */}
      <div className="relative h-[220px] lg:h-[260px] bg-bg-surface">
        {/* Subscribed badge overlay */}
        {isSubscribedTema && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FFD700] text-black rounded-full text-xs font-bold shadow-[0_0_15px_rgba(255,215,0,0.6)]">
            <Star className="w-3.5 h-3.5 fill-black" />
            <span>De tu interés</span>
          </div>
        )}
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
      <div className={`p-4 lg:p-5 flex flex-col gap-3 flex-1 ${isSubscribedTema ? 'bg-[#FFD700]/5' : ''}`}>
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
        <div className="flex items-start gap-2 flex-1">
          <Link href={`/articulo/${noticia.slug}`} className="flex-1">
            <h2 className="font-[family-name:var(--font-lora)] text-xl lg:text-2xl font-medium text-text-primary leading-tight hover:text-accent transition-colors line-clamp-3">
              {noticia.titulo}
            </h2>
          </Link>
          <VoteIndicator slug={noticia.slug} size="md" />
        </div>

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
