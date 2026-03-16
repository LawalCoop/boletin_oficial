'use client';

import { PuntoClave } from '@/lib/types';

interface KeyPointsProps {
  puntosClaves: PuntoClave[];
}

export function KeyPoints({ puntosClaves }: KeyPointsProps) {
  return (
    <div className="flex flex-col gap-6">
      {puntosClaves.map((punto, index) => (
        <article key={index} className="flex flex-col gap-2">
          {/* Point number and title */}
          <div className="flex items-baseline gap-3">
            <span className="font-[family-name:var(--font-lora)] text-2xl lg:text-3xl font-medium text-accent/30 leading-none">
              {index + 1}
            </span>
            <h3 className="font-[family-name:var(--font-lora)] text-base lg:text-lg font-medium text-text-primary leading-tight">
              {punto.titulo}
            </h3>
          </div>
          {/* Description - now with more space for longer text */}
          <p className="text-sm lg:text-base text-text-secondary leading-[1.7] pl-9 lg:pl-11">
            {punto.descripcion}
          </p>
        </article>
      ))}
    </div>
  );
}
