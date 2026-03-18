'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface VoteIndicatorProps {
  slug: string;
  size?: 'sm' | 'md';
}

interface VoteData {
  score: number;
  hasVotes: boolean;
}

export function VoteIndicator({ slug, size = 'sm' }: VoteIndicatorProps) {
  const [data, setData] = useState<VoteData | null>(null);

  useEffect(() => {
    fetch(`/api/votes/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.total > 0) {
          setData({
            score: result.favor - result.contra,
            hasVotes: result.total > 0,
          });
        }
      })
      .catch(() => {});
  }, [slug]);

  if (!data) return null;

  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const containerSize = size === 'sm' ? 'p-1' : 'p-1.5';

  if (data.score > 0) {
    return (
      <span className={`${containerSize} rounded-full bg-green-100`} title="Más votos a favor">
        <TrendingUp className={`${iconSize} text-green-600`} />
      </span>
    );
  }

  if (data.score < 0) {
    return (
      <span className={`${containerSize} rounded-full bg-red-100`} title="Más votos en contra">
        <TrendingDown className={`${iconSize} text-red-600`} />
      </span>
    );
  }

  // score === 0 pero hay votos - está peleado/dividido
  if (data.hasVotes) {
    return (
      <span className={`${containerSize} rounded-full bg-yellow-100`} title="Opiniones divididas">
        <Zap className={`${iconSize} text-yellow-600`} />
      </span>
    );
  }

  return null;
}
