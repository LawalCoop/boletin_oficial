'use client';

import { Sparkles, ExternalLink } from 'lucide-react';
import { Articulo } from '@/lib/types';

interface AIBannerProps {
  articulo: Articulo;
}

export function AIBanner({ articulo }: AIBannerProps) {
  return (
    <div className="flex gap-[10px] bg-accent-soft p-[12px_14px] rounded">
      <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <div className="flex flex-col gap-[2px]">
        <span className="text-xs font-semibold text-accent">
          Resumen generado con IA
        </span>
        <p className="text-[11px] text-text-secondary leading-[1.45]">
          Este artículo fue generado automáticamente a partir del {' '}
          <a
            href={articulo.metadata.urlOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-accent hover:underline"
          >
            {articulo.textoOriginal.encabezado}
            <ExternalLink className="w-[10px] h-[10px]" />
          </a>
          {' '}publicado en el Boletín Oficial. Verificá siempre con la fuente original.
        </p>
      </div>
    </div>
  );
}
