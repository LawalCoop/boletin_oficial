'use client';

import { FileText, Bot, Smartphone, ArrowRight, Sparkles } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="bg-gradient-to-b from-accent/5 to-transparent border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Title and tagline */}
          <div className="text-center lg:text-left">
            <h1 className="font-[family-name:var(--font-lora)] text-3xl sm:text-4xl lg:text-[42px] font-medium text-text-primary leading-[1.15]">
              El Boletín Oficial, <span className="text-accent">de un pantallazo</span>
            </h1>
            <p className="mt-2 text-base sm:text-lg text-text-secondary">
              Usamos la IA para traducir la burocracia en lenguaje cotidiano.
            </p>
          </div>

          {/* Right: Flow schema - animated */}
          <div className="flex items-center justify-center lg:justify-end gap-3 sm:gap-4 lg:gap-6 overflow-x-auto pb-2 lg:pb-0 shrink-0">
            {/* Boletín Oficial */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 animate-[fadeIn_0.5s_ease-out_0.1s_both]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <FileText className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-gray-500" />
              </div>
              <div className="text-center">
                <span className="text-[10px] sm:text-xs text-text-muted font-medium block">
                  Boletín Oficial
                </span>
                <span className="text-[9px] sm:text-[10px] text-text-muted/70 hidden sm:block">
                  PDFs y jerga legal
                </span>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent/50 shrink-0 animate-[fadeIn_0.5s_ease-out_0.3s_both,pulse_2s_ease-in-out_infinite]" />

            {/* IA */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 animate-[fadeIn_0.5s_ease-out_0.5s_both]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 relative">
                <Bot className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-accent animate-[bounce_3s_ease-in-out_infinite]" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-pulse" />
              </div>
              <div className="text-center">
                <span className="text-[10px] sm:text-xs font-medium text-accent block">
                  IA procesa
                </span>
                <span className="text-[9px] sm:text-[10px] text-text-muted/70 hidden sm:block">
                  traduce y clasifica
                </span>
              </div>
            </div>

            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-accent/50 shrink-0 animate-[fadeIn_0.5s_ease-out_0.7s_both,pulse_2s_ease-in-out_infinite]" />

            {/* entreLín[IA]s */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 animate-[fadeIn_0.5s_ease-out_0.9s_both]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
                <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-accent" />
              </div>
              <div className="text-center">
                <span className="text-[10px] sm:text-xs font-medium text-accent block">
                  entreLín[IA]s
                </span>
                <span className="text-[9px] sm:text-[10px] text-text-muted/70 hidden sm:block">
                  claro y accesible
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
