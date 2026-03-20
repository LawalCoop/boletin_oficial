'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { LoginButton } from '@/components/auth/LoginButton';

interface VoteSectionProps {
  slug: string;
}

interface VoteCounts {
  favor: number;
  neutro: number;
  contra: number;
  total: number;
}

export function VoteSection({ slug }: VoteSectionProps) {
  const { data: session, status } = useSession();
  const { getVote, vote, removeVote } = useUserData();
  const [counts, setCounts] = useState<VoteCounts>({ favor: 0, neutro: 0, contra: 0, total: 0 });
  const [isVoting, setIsVoting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only get vote after mount to avoid hydration mismatch
  const userVote = mounted ? getVote(slug) : undefined;

  useEffect(() => {
    fetch(`/api/votes/${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then(setCounts)
      .catch(console.error);
  }, [slug]);

  const handleVote = async (value: 1 | 0 | -1) => {
    if (!session || isVoting) return;

    setIsVoting(true);
    try {
      const prevVote = userVote;

      if (prevVote === value) {
        // Remove vote if clicking the same
        await removeVote(slug);
        setCounts((prev) => ({
          ...prev,
          favor: prev.favor - (value === 1 ? 1 : 0),
          neutro: prev.neutro - (value === 0 ? 1 : 0),
          contra: prev.contra - (value === -1 ? 1 : 0),
          total: prev.total - 1,
        }));
      } else {
        await vote(slug, value);
        setCounts((prev) => {
          const newCounts = { ...prev };
          // Remove previous vote
          if (prevVote === 1) newCounts.favor--;
          else if (prevVote === 0) newCounts.neutro--;
          else if (prevVote === -1) newCounts.contra--;
          else newCounts.total++; // First vote

          // Add new vote
          if (value === 1) newCounts.favor++;
          else if (value === 0) newCounts.neutro++;
          else if (value === -1) newCounts.contra++;

          return newCounts;
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const total = counts.total;
  const positivePercent = total > 0 ? Math.round((counts.favor / total) * 100) : 0;
  const neutralPercent = total > 0 ? Math.round((counts.neutro / total) * 100) : 0;
  const negativePercent = total > 0 ? 100 - positivePercent - neutralPercent : 0;

  // Wait for client-side hydration to avoid mismatch
  if (!mounted || status === 'loading') {
    return (
      <div className="bg-bg-surface rounded-lg p-4 animate-pulse">
        <div className="h-5 bg-bg rounded w-48 mb-3" />
        <div className="flex gap-2">
          <div className="flex-1 h-16 bg-bg rounded" />
          <div className="flex-1 h-16 bg-bg rounded" />
          <div className="flex-1 h-16 bg-bg rounded" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-bg-surface rounded-lg p-4">
        <h3 className="font-[family-name:var(--font-lora)] text-base font-medium text-text-primary mb-3">
          ¿Qué te parece esta norma?
        </h3>
        <p className="text-sm text-text-muted mb-3">
          Iniciá sesión para votar y ver qué opina la comunidad.
        </p>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="bg-bg-surface rounded-lg p-4">
      <h3 className="font-[family-name:var(--font-lora)] text-base font-medium text-text-primary mb-3">
        ¿Qué te parece esta norma?
      </h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleVote(1)}
          disabled={isVoting}
          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg border-2 transition-all ${
            userVote === 1
              ? 'bg-status-positive text-white border-status-positive scale-105'
              : 'bg-white border-status-positive/30 text-status-positive hover:border-status-positive hover:bg-status-positive/5'
          }`}
        >
          <ThumbsUp className={`w-5 h-5 ${userVote === 1 ? 'fill-white' : ''}`} />
          <span className="text-xs font-medium">A favor</span>
        </button>

        <button
          onClick={() => handleVote(0)}
          disabled={isVoting}
          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg border-2 transition-all ${
            userVote === 0
              ? 'bg-text-muted text-white border-text-muted scale-105'
              : 'bg-white border-border text-text-secondary hover:border-text-muted hover:bg-bg-surface'
          }`}
        >
          <Minus className="w-5 h-5" />
          <span className="text-xs font-medium">Neutro</span>
        </button>

        <button
          onClick={() => handleVote(-1)}
          disabled={isVoting}
          className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg border-2 transition-all ${
            userVote === -1
              ? 'bg-status-negative text-white border-status-negative scale-105'
              : 'bg-white border-status-negative/30 text-status-negative hover:border-status-negative hover:bg-status-negative/5'
          }`}
        >
          <ThumbsDown className={`w-5 h-5 ${userVote === -1 ? 'fill-white' : ''}`} />
          <span className="text-xs font-medium">En contra</span>
        </button>
      </div>

      {total > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex h-2 rounded-full overflow-hidden bg-bg">
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
              {total.toLocaleString()} voto{total !== 1 ? 's' : ''}
            </span>
            <span>
              <span className="text-status-negative font-semibold">{negativePercent}%</span> en contra
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
