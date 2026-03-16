'use client';

import { PuntoClave } from '@/lib/types';

interface KeyPointsProps {
  puntosClaves: PuntoClave[];
}

export function KeyPoints({ puntosClaves }: KeyPointsProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[10px] font-semibold text-text-muted tracking-[1.5px]">
        PUNTOS CLAVE
      </h2>
      <div className="flex flex-col gap-4">
        {puntosClaves.map((punto, index) => (
          <div key={index} className="flex gap-3">
            <span className="font-[family-name:var(--font-lora)] text-xl font-medium text-accent tracking-tight shrink-0">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-[6px]">
              <h3 className="font-[family-name:var(--font-lora)] text-[15px] font-medium text-text-primary">
                {punto.titulo}
              </h3>
              <p className="text-[13px] text-text-secondary leading-[1.5]">
                {punto.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
