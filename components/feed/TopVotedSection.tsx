'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopArticle {
  slug: string;
  score: number;
  totalVotes: number;
}

interface TopVotedData {
  topFavor: TopArticle[];
  topContra: TopArticle[];
  titles: Record<string, string>;
  loading: boolean;
}

const TopVotedContext = createContext<TopVotedData | null>(null);

export function TopVotedProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<{ topFavor: TopArticle[]; topContra: TopArticle[] } | null>(null);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/votes/top')
      .then((res) => res.json())
      .then((d) => {
        if (d.topFavor && d.topContra) {
          setData(d);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data || !data.topFavor || !data.topContra) return;

    const allSlugs = [...data.topFavor, ...data.topContra].map((a) => a.slug);
    const uniqueSlugs = [...new Set(allSlugs)];

    Promise.all(
      uniqueSlugs.map(async (slug) => {
        try {
          const res = await fetch(`/api/articulo/${encodeURIComponent(slug)}/titulo`);
          if (res.ok) {
            const { titulo } = await res.json();
            return { slug, titulo };
          }
        } catch {
          // Ignore errors
        }
        return { slug, titulo: slug };
      })
    ).then((results) => {
      const titlesMap: Record<string, string> = {};
      results.forEach((r) => {
        titlesMap[r.slug] = r.titulo;
      });
      setTitles(titlesMap);
    });
  }, [data]);

  return (
    <TopVotedContext.Provider
      value={{
        topFavor: data?.topFavor || [],
        topContra: data?.topContra || [],
        titles,
        loading,
      }}
    >
      {children}
    </TopVotedContext.Provider>
  );
}

function useTopVoted() {
  return useContext(TopVotedContext);
}

function RankBadge({ rank, color }: { rank: number; color: 'cyan' | 'red' }) {
  const bgColor = color === 'cyan' ? 'bg-cyan-500' : 'bg-red-500';

  return (
    <span className={`w-5 h-5 rounded-full ${bgColor} flex items-center justify-center text-white text-[10px] font-bold`}>
      {rank}
    </span>
  );
}

interface TopVotedSectionProps {
  type?: 'apoyadas' | 'cuestionadas' | 'both';
}

export function TopVotedSection({ type = 'both' }: TopVotedSectionProps) {
  const data = useTopVoted();

  if (!data || data.loading) return null;
  if (data.topFavor.length === 0 && data.topContra.length === 0) return null;

  const showApoyadas = (type === 'both' || type === 'apoyadas') && data.topFavor.length > 0;
  const showCuestionadas = (type === 'both' || type === 'cuestionadas') && data.topContra.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Más apoyadas */}
      {showApoyadas && (
        <div className="bg-bg-surface rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            <h3 className="font-medium text-cyan-700 text-sm">Más apoyadas</h3>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {data.topFavor.slice(0, 5).map((article, index) => (
              <Link
                key={article.slug}
                href={`/articulo/${article.slug}`}
                className="flex items-start gap-2 group"
              >
                <RankBadge rank={index + 1} color="cyan" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {data.titles[article.slug] || article.slug}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3 text-cyan-500" />
                    <span className="text-[10px] font-medium text-cyan-600">+{article.score}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Más cuestionadas */}
      {showCuestionadas && (
        <div className="bg-bg-surface rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <h3 className="font-medium text-red-700 text-sm">Más cuestionadas</h3>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {data.topContra.slice(0, 5).map((article, index) => (
              <Link
                key={article.slug}
                href={`/articulo/${article.slug}`}
                className="flex items-start gap-2 group"
              >
                <RankBadge rank={index + 1} color="red" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-primary group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {data.titles[article.slug] || article.slug}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingDown className="w-3 h-3 text-red-500" />
                    <span className="text-[10px] font-medium text-red-600">{article.score}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
