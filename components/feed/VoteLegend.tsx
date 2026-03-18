'use client';

import { TrendingUp, TrendingDown, Zap, Star } from 'lucide-react';

export function VoteLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-4 text-[10px] lg:text-xs text-text-muted">
      <div className="flex items-center gap-1.5">
        <span className="p-1 rounded-full bg-[#FFD700]/20">
          <Star className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />
        </span>
        <span>De tu interés</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="p-1 rounded-full bg-green-100">
          <TrendingUp className="w-3 h-3 text-green-600" />
        </span>
        <span>Más apoyada</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="p-1 rounded-full bg-red-100">
          <TrendingDown className="w-3 h-3 text-red-600" />
        </span>
        <span>Más cuestionada</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="p-1 rounded-full bg-yellow-100">
          <Zap className="w-3 h-3 text-yellow-600" />
        </span>
        <span>Dividida</span>
      </div>
    </div>
  );
}
