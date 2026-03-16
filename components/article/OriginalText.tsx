'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';
import { Articulo } from '@/lib/types';

interface OriginalTextProps {
  articulo: Articulo;
}

export function OriginalText({ articulo }: OriginalTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[10px] font-semibold text-text-muted tracking-[1.5px]">
          TEXTO ORIGINAL DEL BOLETÍN
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] font-medium text-accent"
        >
          {isExpanded ? 'Colapsar' : 'Expandir'}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Content Card */}
      <div className="bg-bg-warm border border-border rounded overflow-hidden">
        {/* Card Header with Link to Original */}
        <div className="flex items-center justify-between gap-2 px-[14px] py-3 border-b border-border bg-white/50">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-text-primary">
              {articulo.textoOriginal.encabezado}
            </span>
          </div>
          <a
            href={articulo.metadata.urlOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium text-accent hover:underline"
            title="Ver documento completo en el Boletín Oficial"
          >
            Ver completo
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Articles List */}
        {articulo.textoOriginal.articulos.map((art, index) => (
          <div
            key={index}
            className={`border-b border-border last:border-0 ${
              !isExpanded && index > 1 ? 'hidden' : ''
            }`}
          >
            <button
              onClick={() => toggleSection(index)}
              className="flex items-center justify-between w-full px-[14px] py-3 text-left hover:bg-white/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-accent">
                  Art. {art.numero}
                </span>
                <span className="text-xs text-text-primary">
                  {art.titulo}
                </span>
              </div>
              {expandedSections.has(index) ? (
                <ChevronUp className="w-4 h-4 text-text-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-muted" />
              )}
            </button>
            {expandedSections.has(index) && (
              <div className="px-[14px] pb-3">
                <p className="text-xs text-text-secondary leading-[1.6] whitespace-pre-wrap">
                  {art.contenido}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Show more button */}
        {!isExpanded && articulo.textoOriginal.articulos.length > 2 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-center gap-[6px] w-full px-[14px] py-3 text-xs font-medium text-accent hover:bg-white/30 transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
            Ver {articulo.textoOriginal.articulos.length - 2} secciones más
          </button>
        )}
      </div>

      {/* Direct link to full document */}
      <a
        href={articulo.metadata.urlOriginal}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-accent hover:underline"
      >
        <ExternalLink className="w-4 h-4" />
        Ver documento completo en Boletín Oficial
      </a>
    </section>
  );
}
