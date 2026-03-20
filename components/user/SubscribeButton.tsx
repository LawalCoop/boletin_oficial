'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { Tema } from '@/lib/types';
import { TEMAS } from '@/lib/constants';
import { LoginButton } from '@/components/auth/LoginButton';

interface SubscribeButtonProps {
  tema: Tema;
  variant?: 'default' | 'compact' | 'full';
  className?: string;
}

export function SubscribeButton({ tema, variant = 'default', className = '' }: SubscribeButtonProps) {
  const { status } = useSession();
  const { isSubscribed, subscribe, unsubscribe } = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const temaInfo = TEMAS[tema];
  // Only check after mount to avoid hydration mismatch
  const subscribed = mounted ? isSubscribed(tema) : false;

  const handleClick = async () => {
    if (status !== 'authenticated') return;

    setIsLoading(true);
    try {
      if (subscribed) {
        await unsubscribe(tema);
      } else {
        await subscribe(tema);
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <button disabled className={`opacity-50 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </button>
    );
  }

  if (status !== 'authenticated') {
    if (variant === 'full') {
      return (
        <div className="bg-accent-soft rounded-lg p-4 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-accent" />
            <h3 className="font-medium text-text-primary text-sm">
              Seguir tema: {temaInfo?.label || tema}
            </h3>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Iniciá sesión para recibir notificaciones sobre este tema.
          </p>
          <LoginButton className="w-full justify-center" />
        </div>
      );
    }
    return null;
  }

  if (variant === 'full') {
    return (
      <div className="bg-accent-soft rounded-lg p-4 border border-accent/20">
        <div className="flex items-center gap-2 mb-2">
          {subscribed ? (
            <BellOff className="w-4 h-4 text-accent" />
          ) : (
            <Bell className="w-4 h-4 text-accent" />
          )}
          <h3 className="font-medium text-text-primary text-sm">
            {subscribed ? 'Siguiendo' : 'Seguir tema'}: {temaInfo?.label || tema}
          </h3>
        </div>
        <p className="text-xs text-text-secondary mb-3">
          {subscribed
            ? 'Estás recibiendo notificaciones sobre este tema.'
            : 'Recibí notificaciones cuando se publiquen nuevas normas sobre este tema.'}
        </p>
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="w-full px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ backgroundColor: subscribed ? '#6b7280' : temaInfo?.color || '#6366f1' }}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : subscribed ? (
            <>
              <BellOff className="w-4 h-4" />
              Dejar de seguir
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              Suscribirse
            </>
          )}
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-colors ${
          subscribed ? 'bg-accent text-white' : 'bg-bg-surface text-text-muted hover:bg-border/30'
        } ${className}`}
        title={subscribed ? 'Dejar de seguir tema' : 'Seguir tema'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : subscribed ? (
          <BellOff className="w-4 h-4" />
        ) : (
          <Bell className="w-4 h-4" />
        )}
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
        subscribed
          ? 'bg-gray-500 text-white hover:bg-gray-600'
          : 'text-white hover:opacity-90'
      } ${className}`}
      style={!subscribed ? { backgroundColor: temaInfo?.color || '#6366f1' } : undefined}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : subscribed ? (
        <>
          <BellOff className="w-4 h-4" />
          <span>Siguiendo</span>
        </>
      ) : (
        <>
          <Bell className="w-4 h-4" />
          <span>Seguir</span>
        </>
      )}
    </button>
  );
}
