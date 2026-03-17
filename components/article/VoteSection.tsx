'use client';

import { useState } from 'react';
import { ThumbsUp, Minus, ThumbsDown } from 'lucide-react';
import { Votacion } from '@/lib/types';

interface VoteSectionProps {
  votacion: Votacion;
  onVote?: (tipo: 'positivo' | 'neutral' | 'negativo') => void;
}

export function VoteSection({ votacion, onVote }: VoteSectionProps) {
  const [userVote, setUserVote] = useState<'positivo' | 'neutral' | 'negativo' | null>(null);

  const total = votacion.positivos + votacion.neutrales + votacion.negativos;
  const positivePercent = total > 0 ? Math.round((votacion.positivos / total) * 100) : 0;
  const neutralPercent = total > 0 ? Math.round((votacion.neutrales / total) * 100) : 0;
  const negativePercent = total > 0 ? 100 - positivePercent - neutralPercent : 0;

  const handleVote = (tipo: 'positivo' | 'neutral' | 'negativo') => {
    setUserVote(tipo);
    onVote?.(tipo);
  };

  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto">
      {/* Vote Buttons - Larger and more prominent */}
      <div className="flex gap-3">
        <button
          onClick={() => handleVote('positivo')}
          className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 border-2 rounded-lg transition-all ${
            userVote === 'positivo'
              ? 'bg-status-positive text-white border-status-positive scale-105'
              : 'bg-white text-status-positive border-status-positive/30 hover:border-status-positive hover:bg-status-positive/5'
          }`}
        >
          <ThumbsUp className="w-6 h-6" />
          <span className="text-sm font-semibold">A favor</span>
        </button>
        <button
          onClick={() => handleVote('neutral')}
          className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 border-2 rounded-lg transition-all ${
            userVote === 'neutral'
              ? 'bg-text-muted text-white border-text-muted scale-105'
              : 'bg-white text-text-secondary border-border hover:border-text-muted hover:bg-bg-surface'
          }`}
        >
          <Minus className="w-6 h-6" />
          <span className="text-sm font-semibold">Neutro</span>
        </button>
        <button
          onClick={() => handleVote('negativo')}
          className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 border-2 rounded-lg transition-all ${
            userVote === 'negativo'
              ? 'bg-status-negative text-white border-status-negative scale-105'
              : 'bg-white text-status-negative border-status-negative/30 hover:border-status-negative hover:bg-status-negative/5'
          }`}
        >
          <ThumbsDown className="w-6 h-6" />
          <span className="text-sm font-semibold">En contra</span>
        </button>
      </div>

      {/* Results Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex h-2 rounded-full overflow-hidden bg-bg-surface">
          <div
            className="bg-status-positive transition-all duration-500"
            style={{ width: `${positivePercent}%` }}
          />
          <div
            className="bg-text-muted transition-all duration-500"
            style={{ width: `${neutralPercent}%` }}
          />
          <div
            className="bg-status-negative transition-all duration-500"
            style={{ width: `${negativePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-text-muted">
          <span>
            <span className="text-status-positive font-semibold">{positivePercent}%</span> a favor
          </span>
          <span className="text-center">
            {total.toLocaleString()} votos
          </span>
          <span>
            <span className="text-status-negative font-semibold">{negativePercent}%</span> en contra
          </span>
        </div>
      </div>
    </div>
  );
}
