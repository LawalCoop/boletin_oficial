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
    <div className="bg-[#FFE455] text-[#7A6200] px-4 py-2.5 flex items-center justify-center gap-2">
      <Star className="w-3.5 h-3.5 fill-[#7A6200]" />
      <span className="text-sm font-semibold">
        Este artículo es de tu interés: {temaInfo?.label || tema}
      </span>
    </div>
  );
}
