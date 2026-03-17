'use client';

import { Star } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { Tema } from '@/lib/types';
import { TEMAS } from '@/lib/constants';

interface SubscribedBannerProps {
  tema?: Tema;
}

export function SubscribedBanner({ tema }: SubscribedBannerProps) {
  const { isSubscribed } = useUserData();

  if (!tema || !isSubscribed(tema)) {
    return null;
  }

  const temaInfo = TEMAS[tema];

  return (
    <div className="bg-gradient-to-r from-[#FFD700] via-[#FFDF00] to-[#FFD700] text-black px-4 py-3 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.6)]">
      <Star className="w-4 h-4 fill-black" />
      <span className="text-sm font-bold tracking-wide">
        Este artículo es de tu interés: {temaInfo?.label || tema}
      </span>
      <Star className="w-4 h-4 fill-black" />
    </div>
  );
}
