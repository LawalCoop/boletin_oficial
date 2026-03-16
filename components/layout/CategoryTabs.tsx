'use client';

import { Categoria } from '@/lib/types';
import { Info } from 'lucide-react';

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
  const activeInfo = categories.find(c => c.key === activeCategory);

  return (
    <div className="border-b border-border">
      {/* Tabs */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="flex px-4 lg:px-0 lg:justify-center lg:gap-2 max-w-7xl mx-auto">
          {categories.map(({ key, label }) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                className={`flex items-center justify-center px-3 lg:px-5 py-[14px] whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-b-2 border-accent'
                    : 'hover:bg-bg-surface'
                }`}
              >
                <span
                  className={`text-[11px] lg:text-xs font-semibold tracking-[1.5px] ${
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

      {/* Descripción de la sección activa */}
      {activeInfo && (
        <div className="bg-bg-surface px-4 py-3 lg:py-4">
          <div className="max-w-7xl mx-auto flex items-start gap-2">
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
