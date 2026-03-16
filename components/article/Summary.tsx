'use client';

interface SummaryProps {
  resumen: string;
}

export function Summary({ resumen }: SummaryProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[10px] font-semibold text-text-muted tracking-[1.5px]">
        EN RESUMEN
      </h2>
      <p className="text-sm text-text-primary leading-[1.6]">
        {resumen}
      </p>
    </section>
  );
}
