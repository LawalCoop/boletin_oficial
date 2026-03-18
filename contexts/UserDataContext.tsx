'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Tema } from '@/lib/types';

type VoteValue = 1 | 0 | -1 | null;

interface UserDataContextType {
  subscriptions: Tema[];
  savedSlugs: string[];
  votes: Record<string, VoteValue>;
  isLoading: boolean;
  isSubscribed: (tema: Tema) => boolean;
  isSaved: (slug: string) => boolean;
  getVote: (slug: string) => VoteValue;
  subscribe: (tema: Tema) => Promise<void>;
  unsubscribe: (tema: Tema) => Promise<void>;
  saveArticle: (slug: string, tema?: Tema) => Promise<void>;
  unsaveArticle: (slug: string) => Promise<void>;
  vote: (slug: string, value: 1 | 0 | -1) => Promise<void>;
  removeVote: (slug: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [subscriptions, setSubscriptions] = useState<Tema[]>([]);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, VoteValue>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (status !== 'authenticated' || !session?.user) {
      setSubscriptions([]);
      setSavedSlugs([]);
      setVotes({});
      return;
    }

    setIsLoading(true);
    try {
      const [subsRes, savedRes, votesRes] = await Promise.all([
        fetch('/api/user/subscriptions'),
        fetch('/api/user/saved'),
        fetch('/api/user/votes'),
      ]);

      if (subsRes.ok) {
        const { subscriptions: subs } = await subsRes.json();
        setSubscriptions(subs.map((s: { tema: Tema }) => s.tema));
      }

      if (savedRes.ok) {
        const { savedArticles } = await savedRes.json();
        setSavedSlugs(savedArticles.map((s: { articleSlug: string }) => s.articleSlug));
      }

      if (votesRes.ok) {
        const { votes: userVotes } = await votesRes.json();
        const votesMap: Record<string, VoteValue> = {};
        userVotes.forEach((v: { articleSlug: string; vote: number }) => {
          votesMap[v.articleSlug] = v.vote as VoteValue;
        });
        setVotes(votesMap);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const isSubscribed = useCallback((tema: Tema) => subscriptions.includes(tema), [subscriptions]);
  const isSaved = useCallback((slug: string) => savedSlugs.includes(slug), [savedSlugs]);
  const getVote = useCallback((slug: string): VoteValue => votes[slug] ?? null, [votes]);

  const subscribe = useCallback(async (tema: Tema) => {
    try {
      const res = await fetch('/api/user/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema }),
      });

      if (res.ok) {
        setSubscriptions(prev => [...prev, tema]);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  }, []);

  const unsubscribe = useCallback(async (tema: Tema) => {
    try {
      const res = await fetch(`/api/user/subscriptions/${tema}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSubscriptions(prev => prev.filter(t => t !== tema));
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      throw error;
    }
  }, []);

  const saveArticle = useCallback(async (slug: string, tema?: Tema) => {
    try {
      const res = await fetch('/api/user/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleSlug: slug, articleTema: tema }),
      });

      if (res.ok) {
        setSavedSlugs(prev => [...prev, slug]);
      }
    } catch (error) {
      console.error('Error saving article:', error);
      throw error;
    }
  }, []);

  const unsaveArticle = useCallback(async (slug: string) => {
    try {
      const res = await fetch(`/api/user/saved/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSavedSlugs(prev => prev.filter(s => s !== slug));
      }
    } catch (error) {
      console.error('Error removing saved article:', error);
      throw error;
    }
  }, []);

  const vote = useCallback(async (slug: string, value: 1 | 0 | -1) => {
    try {
      const res = await fetch('/api/user/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleSlug: slug, vote: value }),
      });

      if (res.ok) {
        setVotes(prev => ({ ...prev, [slug]: value }));
      }
    } catch (error) {
      console.error('Error voting:', error);
      throw error;
    }
  }, []);

  const removeVote = useCallback(async (slug: string) => {
    try {
      const res = await fetch(`/api/user/votes/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setVotes(prev => {
          const newVotes = { ...prev };
          delete newVotes[slug];
          return newVotes;
        });
      }
    } catch (error) {
      console.error('Error removing vote:', error);
      throw error;
    }
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        subscriptions,
        savedSlugs,
        votes,
        isLoading,
        isSubscribed,
        isSaved,
        getVote,
        subscribe,
        unsubscribe,
        saveArticle,
        unsaveArticle,
        vote,
        removeVote,
        refresh: fetchUserData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}
