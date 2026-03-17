'use client';

import { useState } from 'react';
import { Categoria } from '@/lib/types';
import { Info, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface CategoryTabsProps {
  activeCategory: Categoria | 'todos';
  onCategoryChange: (category: Categoria | 'todos') => void;
}

// Categorías basadas en las secciones del Boletín Oficial con descripciones amigables
const categories: {
  key: Categoria | 'todos';
  label: string;
  descripcion: string;
  seccion?: string;
}[] = [
  {
    key: 'todos',
    label: 'TODOS',
    descripcion: 'Todo lo publicado hoy en el Boletín Oficial: leyes, decretos, licitaciones y más.'
  },
  {
    key: 'nacional',
    label: 'NACIONAL',
    seccion: 'Primera Sección',
    descripcion: 'Decisiones del Gobierno Nacional: decretos presidenciales, resoluciones de ministerios y nuevas leyes que afectan a todo el país.'
  },
  {
    key: 'empresas',
    label: 'EMPRESAS',
    seccion: 'Segunda Sección',
    descripcion: 'Novedades del mundo empresarial: creación de sociedades, cambios de autoridades, fusiones y disoluciones de empresas.'
  },
  {
    key: 'contrataciones',
    label: 'CONTRATACIONES',
    seccion: 'Tercera Sección',
    descripcion: 'Oportunidades de negocio con el Estado: licitaciones públicas, concursos de precios y contrataciones abiertas.'
  },
  {
    key: 'judicial',
    label: 'JUDICIAL',
    seccion: 'Cuarta Sección',
    descripcion: 'Avisos de la Justicia: edictos judiciales, notificaciones de juicios, sucesiones y citaciones legales.'
  },
];

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeInfo = categories.find(c => c.key === activeCategory);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Mobile: Collapsible dropdown */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-bg-surface"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-text-muted" />
            <span className="text-xs font-medium text-text-muted">Sección</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-accent uppercase">{activeInfo?.label}</span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {mobileOpen && (
          <div className="border-t border-border bg-bg divide-y divide-border">
            {categories.map(({ key, label }) => {
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    onCategoryChange(key);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop: Horizontal tabs */}
      <div className="hidden lg:block overflow-x-auto no-scrollbar border-b border-border">
        <div className="flex justify-center gap-1">
          {categories.map(({ key, label }) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                className={`flex items-center justify-center px-5 py-3 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-b-2 border-accent bg-accent/5'
                    : 'hover:bg-bg-surface'
                }`}
              >
                <span
                  className={`text-xs font-semibold tracking-[1.5px] ${
                    isActive ? 'text-accent' : 'text-text-muted'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Descripción de la sección activa - solo desktop */}
      {activeInfo && (
        <div className="hidden lg:block bg-bg-surface px-4 py-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="flex flex-col gap-0.5">
              {activeInfo.seccion && (
                <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">
                  {activeInfo.seccion} del Boletín Oficial
                </span>
              )}
              <p className="text-sm text-text-secondary leading-relaxed">
                {activeInfo.descripcion}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
