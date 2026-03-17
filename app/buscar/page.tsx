'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import { NewsCard } from '@/components/feed/NewsCard';
import { NoticiaPreview } from '@/lib/types';
import { Search, X } from 'lucide-react';

export default function BuscarPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NoticiaPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en títulos y descripciones..."
            className="w-full pl-12 pr-12 py-4 bg-bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-lg"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-border/30 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-bg-surface rounded-lg animate-pulse" />
            ))}
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">
              No se encontraron resultados para &quot;{query}&quot;
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="flex flex-col">
            <p className="text-sm text-text-muted mb-4">
              {results.length} resultado{results.length !== 1 ? 's' : ''}
            </p>
            {results.map((noticia, index) => (
              <NewsCard key={noticia.slug} noticia={noticia} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted">
              Escribí al menos 2 caracteres para buscar
            </p>
          </div>
        )}
      </main>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
