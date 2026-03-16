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
  const positivePercent = Math.round((votacion.positivos / total) * 100);
  const neutralPercent = Math.round((votacion.neutrales / total) * 100);
  const negativePercent = 100 - positivePercent - neutralPercent;

  const handleVote = (tipo: 'positivo' | 'neutral' | 'negativo') => {
    setUserVote(tipo);
    onVote?.(tipo);
  };

  return (
    <section className="flex flex-col gap-4 bg-bg-surface p-5 border border-border rounded">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-lora)] text-[15px] font-medium text-text-primary">
          ¿Qué opinas de esta medida?
        </h2>
        <span className="text-[10px] font-medium text-text-muted">
          {total.toLocaleString()} votos
        </span>
      </div>

      {/* Vote Bar */}
      <div className="flex flex-col gap-[6px]">
        <div className="flex h-[6px] rounded-full overflow-hidden">
          <div
            className="bg-status-positive vote-bar"
            style={{ width: `${positivePercent}%` }}
          />
          <div
            className="bg-status-neutral vote-bar"
            style={{ width: `${neutralPercent}%` }}
          />
          <div
            className="bg-status-negative vote-bar"
            style={{ width: `${negativePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-status-positive font-medium">{positivePercent}% A favor</span>
          <span className="text-status-neutral font-medium">{neutralPercent}% Neutro</span>
          <span className="text-status-negative font-medium">{negativePercent}% En contra</span>
        </div>
      </div>

      {/* Vote Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleVote('positivo')}
          className={`flex-1 flex items-center justify-center gap-[6px] h-10 border rounded transition-colors ${
            userVote === 'positivo'
              ? 'bg-status-positive text-white border-status-positive'
              : 'bg-white text-status-positive border-status-positive hover:bg-status-positive/5'
          }`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm font-medium">A favor</span>
        </button>
        <button
          onClick={() => handleVote('neutral')}
          className={`flex-1 flex items-center justify-center gap-[6px] h-10 border rounded transition-colors ${
            userVote === 'neutral'
              ? 'bg-border-strong text-white border-border-strong'
              : 'bg-white text-text-secondary border-border-strong hover:bg-bg-surface'
          }`}
        >
          <Minus className="w-4 h-4" />
          <span className="text-sm font-medium">Neutro</span>
        </button>
        <button
          onClick={() => handleVote('negativo')}
          className={`flex-1 flex items-center justify-center gap-[6px] h-10 border rounded transition-colors ${
            userVote === 'negativo'
              ? 'bg-status-negative text-white border-status-negative'
              : 'bg-white text-status-negative border-status-negative hover:bg-status-negative/5'
          }`}
        >
          <ThumbsDown className="w-4 h-4" />
          <span className="text-sm font-medium">En contra</span>
        </button>
      </div>
    </section>
  );
}
