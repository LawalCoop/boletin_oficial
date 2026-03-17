'use client';

import { Tema } from '@/lib/types';
import { TEMAS } from '@/lib/constants';
import * as LucideIcons from 'lucide-react';
import { X } from 'lucide-react';

interface TemaFilterProps {
  temasDisponibles: Tema[];
  temaActivo: Tema | null;
  onTemaChange: (tema: Tema | null) => void;
}

// Helper to get icon component dynamically
function getIconComponent(iconName: string) {
  const pascalName = iconName.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalName];
}

export function TemaFilter({ temasDisponibles, temaActivo, onTemaChange }: TemaFilterProps) {
  if (temasDisponibles.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
        Filtrar por tema
      </span>
      <div className="flex flex-wrap gap-2">
        {temasDisponibles.map((tema) => {
          const temaInfo = TEMAS[tema];
          if (!temaInfo) return null;

          const TemaIcon = getIconComponent(temaInfo.icon);
          const isActive = temaActivo === tema;

          return (
            <button
              key={tema}
              onClick={() => onTemaChange(isActive ? null : tema)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'text-white shadow-md'
                  : 'bg-bg-surface text-text-secondary hover:bg-border/30'
              }`}
              style={isActive ? { backgroundColor: temaInfo.color } : undefined}
            >
              {TemaIcon && (
                <TemaIcon
                  className="w-3.5 h-3.5"
                  style={!isActive ? { color: temaInfo.color } : undefined}
                />
              )}
              <span>{temaInfo.label}</span>
              {isActive && <X className="w-3 h-3 ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
