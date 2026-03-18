'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ExternalLink, Star } from 'lucide-react';
import { NoticiaPreview } from '@/lib/types';
import { CATEGORIAS, TEMAS, calcularTiempoTranscurrido, TIPO_DOCUMENTO_LABELS } from '@/lib/constants';
import { TemaIcon } from '@/components/shared/TemaIcon';
import { useUserData } from '@/contexts/UserDataContext';
import { VoteIndicator } from '@/components/feed/VoteIndicator';

// Card con imagen a la izquierda (horizontal)
function HorizontalCard({ noticia }: { noticia: NoticiaPreview }) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tema = noticia.tema ? TEMAS[noticia.tema] : null;
  const tiempoTranscurrido = calcularTiempoTranscurrido(noticia.fechaPublicacion);
  const { isSubscribed } = useUserData();
  const isSubscribedTema = noticia.tema && isSubscribed(noticia.tema);

  return (
    <article className={`flex gap-4 p-4 rounded-lg hover:shadow-md transition-all group ${
      isSubscribedTema
        ? 'bg-[#FFE455]/5 border-2 border-[#FFE455] glow-pulse'
        : 'bg-bg-surface'
    }`}>
      {/* Image */}
      <Link href={`/articulo/${noticia.slug}`} className="relative w-32 h-24 lg:w-40 lg:h-28 shrink-0 rounded-lg overflow-hidden bg-bg-warm">
        {noticia.imagen ? (
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform"
            style={{ backgroundImage: `url(${noticia.imagen})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
        )}
        {isSubscribedTema && (
          <span className="absolute top-2 right-2 p-1.5 bg-[#FFE455] rounded-full shadow">
            <Star className="w-3 h-3 text-[#7A6200] fill-[#7A6200]" />
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {/* Tags */}
        <div className="flex items-center gap-2">
          <span
            className="px-2 py-[2px] text-[9px] font-semibold tracking-[0.5px] text-white rounded"
            style={{ backgroundColor: categoria.color }}
          >
            {categoria.label}
          </span>
          {tema && (
            <span
              className="text-[9px] font-medium"
              style={{ color: tema.color }}
            >
              {tema.label}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="flex items-start gap-2">
          <Link href={`/articulo/${noticia.slug}`} className="flex-1">
            <h3 className="font-[family-name:var(--font-lora)] text-sm lg:text-base font-medium text-text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
              {noticia.titulo}
            </h3>
          </Link>
          <VoteIndicator slug={noticia.slug} />
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 mt-auto text-[10px] text-text-muted">
          <span>{tiempoTranscurrido}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {noticia.tiempoLectura} min
          </span>
        </div>
      </div>
    </article>
  );
}

// Card solo texto (sin imagen)
function TextOnlyCard({ noticia }: { noticia: NoticiaPreview }) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tiempoTranscurrido = calcularTiempoTranscurrido(noticia.fechaPublicacion);
  const tipoDoc = TIPO_DOCUMENTO_LABELS[noticia.tipoDocumento] || noticia.tipoDocumento;
  const { isSubscribed } = useUserData();
  const isSubscribedTema = noticia.tema && isSubscribed(noticia.tema);

  return (
    <article
      className={`flex flex-col gap-2 p-4 border-l-4 transition-colors rounded-r-lg ${
        isSubscribedTema
          ? 'bg-[#FFE455]/5 border-[#FFE455] glow-pulse'
          : 'hover:bg-bg-surface'
      }`}
      style={!isSubscribedTema ? { borderColor: categoria.color } : undefined}
    >
      {/* Tags */}
      <div className="flex items-center gap-2 text-[10px]">
        {isSubscribedTema && (
          <Star className="w-3.5 h-3.5 text-[#FFE455] fill-[#FFE455]" />
        )}
        <span className="font-semibold uppercase tracking-wide" style={{ color: isSubscribedTema ? '#FFE455' : categoria.color }}>
          {categoria.label}
        </span>
        <span className="text-text-muted">
          {tipoDoc} {noticia.numeroDocumento}
        </span>
      </div>

      {/* Title */}
      <div className="flex items-start gap-2">
        <Link href={`/articulo/${noticia.slug}`} className="flex-1">
          <h3 className="font-[family-name:var(--font-lora)] text-base font-medium text-text-primary leading-snug hover:text-accent transition-colors">
            {noticia.titulo}
          </h3>
        </Link>
        <VoteIndicator slug={noticia.slug} />
      </div>

      {/* Excerpt */}
      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
        {noticia.extracto}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-text-muted pt-1">
        <span>{tiempoTranscurrido}</span>
        <a
          href={noticia.urlOriginal}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-accent hover:underline font-medium"
        >
          <ExternalLink className="w-3 h-3" />
          Original
        </a>
      </div>
    </article>
  );
}

// Card destacada grande (100% width)
function FeaturedWideCard({ noticia }: { noticia: NoticiaPreview }) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tema = noticia.tema ? TEMAS[noticia.tema] : null;
  const tiempoTranscurrido = calcularTiempoTranscurrido(noticia.fechaPublicacion);
  const { isSubscribed } = useUserData();
  const isSubscribedTema = noticia.tema && isSubscribed(noticia.tema);

  return (
    <article className={`flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-5 rounded-xl hover:shadow-lg transition-all group ${
      isSubscribedTema
        ? 'bg-[#FFE455]/5 border-2 border-[#FFE455] glow-pulse'
        : 'bg-bg-surface'
    }`}>
      {/* Image */}
      <Link href={`/articulo/${noticia.slug}`} className="relative h-48 lg:h-40 lg:w-72 shrink-0 rounded-lg overflow-hidden bg-bg-warm">
        {noticia.imagen ? (
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform"
            style={{ backgroundImage: `url(${noticia.imagen})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
        )}
        <span
          className="absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-white rounded"
          style={{ backgroundColor: categoria.color }}
        >
          {categoria.label}
        </span>
        {isSubscribedTema && (
          <span className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FFE455] text-[#7A6200] rounded-full text-[10px] font-bold ">
            <Star className="w-3 h-3 fill-[#7A6200]" />
            De tu interés
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        {tema && (
          <Link
            href={`/tema/${noticia.tema}`}
            className="flex items-center gap-1 text-xs font-medium w-fit"
            style={{ color: tema.color }}
          >
            <TemaIcon iconName={tema.icon} className="w-3.5 h-3.5" />
            {tema.label}
          </Link>
        )}

        <div className="flex items-start gap-2">
          <Link href={`/articulo/${noticia.slug}`} className="flex-1">
            <h3 className="font-[family-name:var(--font-lora)] text-xl lg:text-2xl font-medium text-text-primary leading-snug group-hover:text-accent transition-colors">
              {noticia.titulo}
            </h3>
          </Link>
          <VoteIndicator slug={noticia.slug} size="md" />
        </div>

        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {noticia.extracto}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>{tiempoTranscurrido}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {noticia.tiempoLectura} min
            </span>
          </div>
          <a
            href={noticia.urlOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Original
          </a>
        </div>
      </div>
    </article>
  );
}

// Card compacta vertical (para grids)
function CompactVerticalCard({ noticia }: { noticia: NoticiaPreview }) {
  const categoria = CATEGORIAS[noticia.categoria];
  const tiempoTranscurrido = calcularTiempoTranscurrido(noticia.fechaPublicacion);
  const { isSubscribed } = useUserData();
  const isSubscribedTema = noticia.tema && isSubscribed(noticia.tema);

  return (
    <article className={`flex flex-col h-full rounded-lg overflow-hidden hover:shadow-md transition-all group ${
      isSubscribedTema
        ? 'bg-[#FFE455]/5 border-2 border-[#FFE455] glow-pulse'
        : 'bg-bg-surface'
    }`}>
      <Link href={`/articulo/${noticia.slug}`} className="relative h-28 bg-bg-warm block">
        {noticia.imagen ? (
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform"
            style={{ backgroundImage: `url(${noticia.imagen})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
        )}
        <span
          className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.5px] text-white rounded"
          style={{ backgroundColor: categoria.color }}
        >
          {categoria.label}
        </span>
        {isSubscribedTema && (
          <span className="absolute top-2 right-2 p-1 bg-[#FFE455] rounded-full shadow">
            <Star className="w-2.5 h-2.5 text-[#7A6200] fill-[#7A6200]" />
          </span>
        )}
      </Link>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start gap-1.5">
          <Link href={`/articulo/${noticia.slug}`} className="flex-1">
            <h3 className="font-[family-name:var(--font-lora)] text-sm font-medium text-text-primary leading-snug group-hover:text-accent transition-colors line-clamp-2">
              {noticia.titulo}
            </h3>
          </Link>
          <VoteIndicator slug={noticia.slug} />
        </div>

        <div className="flex items-center gap-2 mt-auto text-[10px] text-text-muted">
          <span>{tiempoTranscurrido}</span>
          <span>·</span>
          <span>{noticia.tiempoLectura} min</span>
        </div>
      </div>
    </article>
  );
}

interface VariedNewsLayoutProps {
  articles: NoticiaPreview[];
  startIndex?: number;
}

export function VariedNewsLayout({ articles, startIndex = 0 }: VariedNewsLayoutProps) {
  if (articles.length === 0) return null;

  // Crear grupos variados de artículos
  const layouts: React.JSX.Element[] = [];
  let i = 0;

  while (i < articles.length) {
    const remaining = articles.length - i;
    const patternIndex = Math.floor((startIndex + i) / 3) % 4; // Varía el patrón cada 3 artículos

    if (remaining >= 4 && patternIndex === 0) {
      // Patrón 1: 1 wide + 3 compact grid
      layouts.push(
        <div key={`pattern-${i}`} className="flex flex-col gap-4">
          <FeaturedWideCard noticia={articles[i]} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {articles.slice(i + 1, i + 4).map((n) => (
              <CompactVerticalCard key={n.id} noticia={n} />
            ))}
          </div>
        </div>
      );
      i += 4;
    } else if (remaining >= 3 && patternIndex === 1) {
      // Patrón 2: 3 text-only cards
      layouts.push(
        <div key={`pattern-${i}`} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {articles.slice(i, i + 3).map((n) => (
            <TextOnlyCard key={n.id} noticia={n} />
          ))}
        </div>
      );
      i += 3;
    } else if (remaining >= 2 && patternIndex === 2) {
      // Patrón 3: 2 horizontal cards
      layouts.push(
        <div key={`pattern-${i}`} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {articles.slice(i, i + 2).map((n) => (
            <HorizontalCard key={n.id} noticia={n} />
          ))}
        </div>
      );
      i += 2;
    } else if (remaining >= 4 && patternIndex === 3) {
      // Patrón 4: 4 compact vertical en grid
      layouts.push(
        <div key={`pattern-${i}`} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.slice(i, i + 4).map((n) => (
            <CompactVerticalCard key={n.id} noticia={n} />
          ))}
        </div>
      );
      i += 4;
    } else {
      // Fallback: horizontal cards una por una
      layouts.push(
        <HorizontalCard key={articles[i].id} noticia={articles[i]} />
      );
      i += 1;
    }
  }

  return <div className="flex flex-col gap-6">{layouts}</div>;
}

// Layout adaptativo para pocos artículos
export function AdaptiveHeroLayout({ articles }: { articles: NoticiaPreview[] }) {
  if (articles.length === 0) return null;

  // 1 artículo: solo el hero grande, ancho completo
  if (articles.length === 1) {
    return (
      <div className="w-full">
        <FeaturedWideCard noticia={articles[0]} />
      </div>
    );
  }

  // 2-3 artículos: hero + horizontales
  if (articles.length <= 3) {
    return (
      <div className="flex flex-col gap-4">
        <FeaturedWideCard noticia={articles[0]} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {articles.slice(1).map((n) => (
            <HorizontalCard key={n.id} noticia={n} />
          ))}
        </div>
      </div>
    );
  }

  // 4-5 artículos: hero + grid de 3-4
  if (articles.length <= 5) {
    return (
      <div className="flex flex-col gap-4">
        <FeaturedWideCard noticia={articles[0]} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.slice(1).map((n) => (
            <CompactVerticalCard key={n.id} noticia={n} />
          ))}
        </div>
      </div>
    );
  }

  // 6+ artículos: layout original (se manejará en page.tsx)
  return null;
}
