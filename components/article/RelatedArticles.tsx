'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ArticuloRelacionado } from '@/lib/types';
import { CATEGORIAS } from '@/lib/constants';

interface RelatedArticlesProps {
  relacionados: ArticuloRelacionado[];
}

export function RelatedArticles({ relacionados }: RelatedArticlesProps) {
  if (relacionados.length === 0) return null;

  return (
    <section className="flex flex-col gap-[14px]">
      <h2 className="text-[10px] font-semibold text-text-muted tracking-[1.5px]">
        NOTICIAS RELACIONADAS
      </h2>
      <div className="flex flex-col">
        {relacionados.map((articulo, index) => {
          const categoria = CATEGORIAS[articulo.categoria];
          return (
            <Link
              key={index}
              href={`/articulo/${articulo.slug}`}
              className="flex items-center gap-3 py-3 border-t border-border first:border-0 group"
            >
              <div className="flex-1 flex flex-col gap-1">
                <span
                  className="text-[9px] font-semibold tracking-[1px] uppercase"
                  style={{ color: categoria.color }}
                >
                  {categoria.label}
                </span>
                <span className="text-[13px] font-medium text-text-primary group-hover:text-accent transition-colors leading-[1.3]">
                  {articulo.titulo}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
