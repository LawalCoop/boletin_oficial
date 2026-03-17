'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Percent } from 'lucide-react';

interface Indicator {
  value: number;
  date: string;
  change?: number;
}

export function EconomicIndicators() {
  const [riesgoPais, setRiesgoPais] = useState<Indicator | null>(null);
  const [inflacion, setInflacion] = useState<Indicator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIndicators() {
      try {
        // Fetch riesgo país
        const riesgoRes = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais');
        if (riesgoRes.ok) {
          const riesgoData = await riesgoRes.json();
          if (Array.isArray(riesgoData) && riesgoData.length > 0) {
            const latest = riesgoData[riesgoData.length - 1];
            setRiesgoPais({
              value: latest.valor,
              date: latest.fecha,
            });
          }
        }

        // Fetch inflación
        const inflacionRes = await fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion');
        if (inflacionRes.ok) {
          const inflacionData = await inflacionRes.json();
          const latest = inflacionData[inflacionData.length - 1];
          const previous = inflacionData[inflacionData.length - 2];
          setInflacion({
            value: latest.valor,
            date: latest.fecha,
            change: previous ? latest.valor - previous.valor : undefined,
          });
        }
      } catch (error) {
        console.error('Error fetching indicators:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchIndicators();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4 text-sm text-text-muted animate-pulse">
        <div className="h-4 w-20 bg-bg-surface rounded"></div>
        <div className="h-4 w-20 bg-bg-surface rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 lg:gap-6">
      {/* Riesgo País */}
      {riesgoPais && (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-600" />
          <div className="flex flex-col">
            <span className="text-[10px] lg:text-xs text-text-muted uppercase tracking-wide leading-none">Riesgo País</span>
            <span className="font-semibold text-text-primary text-base lg:text-lg leading-tight">{riesgoPais.value.toLocaleString('es-AR')}</span>
          </div>
        </div>
      )}

      {/* Inflación */}
      {inflacion && (
        <div className="flex items-center gap-2">
          <Percent className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
          <div className="flex flex-col">
            <span className="text-[10px] lg:text-xs text-text-muted uppercase tracking-wide leading-none">Inflación</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-text-primary text-base lg:text-lg leading-tight">{inflacion.value.toFixed(1)}%</span>
              {inflacion.change !== undefined && (
                <span className={`flex items-center ${inflacion.change > 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {inflacion.change > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
