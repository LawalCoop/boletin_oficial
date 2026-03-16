'use client';

import * as LucideIcons from 'lucide-react';
import { GrupoAfectado } from '@/lib/types';

// Helper to get icon component dynamically
function getIconComponent(iconName: string) {
  const pascalName = iconName.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[pascalName];
  return Icon || LucideIcons.Users;
}

interface ImpactSectionProps {
  grupos: GrupoAfectado[];
}

export function ImpactSection({ grupos }: ImpactSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      {grupos.map((grupo, index) => {
        const Icon = getIconComponent(grupo.icono);
        return (
          <article
            key={index}
            className="flex flex-col gap-3 bg-bg-surface border border-border rounded-lg p-4 lg:p-5"
          >
            {/* Header with icon and group name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-[family-name:var(--font-lora)] text-base lg:text-lg font-medium text-text-primary">
                {grupo.grupo}
              </h3>
            </div>
            {/* Description - more space for longer narrative text */}
            <p className="text-sm lg:text-base text-text-secondary leading-[1.7]">
              {grupo.descripcion}
            </p>
          </article>
        );
      })}
    </div>
  );
}
