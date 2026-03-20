'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Bookmark, Loader2 } from 'lucide-react';
import { useUserData } from '@/contexts/UserDataContext';
import { Tema } from '@/lib/types';

interface SaveArticleButtonProps {
  slug: string;
  tema?: Tema;
  variant?: 'default' | 'icon';
  className?: string;
}

export function SaveArticleButton({ slug, tema, variant = 'default', className = '' }: SaveArticleButtonProps) {
  const { status } = useSession();
  const { isSaved, saveArticle, unsaveArticle } = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only check after mount to avoid hydration mismatch
  const saved = mounted ? isSaved(slug) : false;

  // Return skeleton until mounted to avoid hydration mismatch
  if (!mounted) {
    if (variant === 'icon') {
      return (
        <div className={`p-2 rounded-lg bg-bg-surface animate-pulse ${className}`}>
          <div className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-3 px-3 py-2.5 bg-bg border border-border rounded-lg animate-pulse ${className}`}>
        <div className="w-4 h-4 bg-bg-surface rounded" />
        <div className="w-16 h-4 bg-bg-surface rounded" />
      </div>
    );
  }

  const handleClick = async () => {
    if (status !== 'authenticated') {
      signIn('google');
      return;
    }

    setIsLoading(true);
    try {
      if (saved) {
        await unsaveArticle(slug);
      } else {
        await saveArticle(slug, tema);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-colors ${
          saved ? 'bg-accent text-white' : 'bg-bg-surface text-text-muted hover:bg-border/30'
        } ${className}`}
        title={saved ? 'Quitar de guardados' : 'Guardar artículo'}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-3 px-3 py-2.5 bg-bg border border-border rounded-lg hover:bg-border/20 transition-colors ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-text-secondary" />
      ) : (
        <Bookmark className={`w-4 h-4 ${saved ? 'text-accent fill-accent' : 'text-text-secondary'}`} />
      )}
      <span className="text-sm text-text-primary">
        {saved ? 'Guardado' : 'Guardar'}
      </span>
    </button>
  );
}
