'use client';

import { Building2, TrendingUp, Users, Scale, FileText, Landmark } from 'lucide-react';
import { GrupoAfectado } from '@/lib/types';

const iconMap: Record<string, React.ElementType> = {
  'building-2': Building2,
  'trending-up': TrendingUp,
  'users': Users,
  'scale': Scale,
  'file-text': FileText,
  'landmark': Landmark,
};

interface ImpactSectionProps {
  grupos: GrupoAfectado[];
}

export function ImpactSection({ grupos }: ImpactSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[10px] font-semibold text-text-muted tracking-[1.5px]">
        ¿A QUIÉN AFECTA?
      </h2>
      <div className="flex flex-wrap gap-[10px]">
        {grupos.map((grupo, index) => {
          const Icon = iconMap[grupo.icono] || Users;
          return (
            <div
              key={index}
              className="flex-1 min-w-[140px] flex flex-col gap-1 bg-bg-surface p-[10px_12px] border border-border rounded"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-accent" />
                <span className="text-xs font-semibold text-text-primary">
                  {grupo.grupo}
                </span>
              </div>
              <p className="text-[11px] text-text-secondary leading-[1.4]">
                {grupo.descripcion}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
