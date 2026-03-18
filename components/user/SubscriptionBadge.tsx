'use client';

import { Star } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { Tema } from '@/lib/types';

interface SubscriptionBadgeProps {
  tema?: Tema;
  className?: string;
}

export function SubscriptionBadge({ tema, className = '' }: SubscriptionBadgeProps) {
  const { isSubscribed } = useUserData();

  if (!tema || !isSubscribed(tema)) {
    return null;
  }

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      title="Tema al que estás suscrito"
    >
      <Star className="w-4 h-4 text-[#FFE455] fill-[#FFE455]" />
    </span>
  );
}
