'use client';

import { BookOpen } from 'lucide-react';

interface SummaryProps {
  resumen: string;
  contexto?: string;
}

export function Summary({ resumen, contexto }: SummaryProps) {
  return (
    <article className="flex flex-col gap-6">
      {/* Lead paragraph - the main summary like a news article */}
      <p className="font-[family-name:var(--font-lora)] text-lg lg:text-xl text-text-primary leading-[1.7] lg:leading-[1.8]">
        {resumen}
      </p>

      {/* Educational context box */}
      {contexto && (
        <div className="bg-accent-soft border-l-4 border-accent rounded-r-lg p-4 lg:p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-semibold text-accent tracking-wide uppercase">
              Para entender mejor
            </h3>
          </div>
          <p className="text-sm lg:text-base text-text-secondary leading-[1.7]">
            {contexto}
          </p>
        </div>
      )}
    </article>
  );
}
