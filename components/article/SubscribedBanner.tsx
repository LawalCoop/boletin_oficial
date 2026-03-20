'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { Tema } from '@/lib/types';
import { TEMAS } from '@/lib/constants';

interface SubscribedBannerProps {
  tema?: Tema;
}

export function SubscribedBanner({ tema }: SubscribedBannerProps) {
  const { isSubscribed } = useUserData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted || !tema || !isSubscribed(tema)) {
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
