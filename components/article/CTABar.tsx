'use client';

import { FileText, ArrowUpRight } from 'lucide-react';
import { Articulo } from '@/lib/types';
import { TIPO_DOCUMENTO_LABELS } from '@/lib/constants';

interface CTABarProps {
  articulo: Articulo;
}

export function CTABar({ articulo }: CTABarProps) {
  const tipoDoc = TIPO_DOCUMENTO_LABELS[articulo.metadata.tipoDocumento] || articulo.metadata.tipoDocumento;

  return (
    <div className="sticky bottom-0 bg-bg border-t border-border px-6 pt-3 pb-[34px]">
      <a
        href={articulo.metadata.urlOriginal}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full h-11 bg-accent text-white rounded hover:bg-accent/90 transition-colors"
      >
        <FileText className="w-4 h-4" />
        <span className="text-[13px] font-semibold">
          Ver {tipoDoc} Completo en Boletín Oficial
        </span>
        <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  );
}
