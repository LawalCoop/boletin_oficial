'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Percent } from 'lucide-react';

interface Indicator {
  value: number;
  date: string;
  change?: number;
  interanual?: number;
  month?: string;
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

        // Fetch inflación mensual e interanual
        const [inflacionRes, interanualRes] = await Promise.all([
          fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacion'),
          fetch('https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual'),
        ]);

        if (inflacionRes.ok) {
          const inflacionData = await inflacionRes.json();
          const latest = inflacionData[inflacionData.length - 1];

          // Get interanual from API
          let interanual: number | undefined;
          if (interanualRes.ok) {
            const interanualData = await interanualRes.json();
            const latestInteranual = interanualData[interanualData.length - 1];
            interanual = latestInteranual?.valor;
          }

          // Get month name from date (format: YYYY-MM-DD)
          const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          const monthIndex = parseInt(latest.fecha.split('-')[1], 10) - 1;
          const monthName = months[monthIndex];

          setInflacion({
            value: latest.valor,
            date: latest.fecha,
            interanual,
            month: monthName,
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
            <span className="text-[10px] lg:text-xs text-text-muted uppercase tracking-wide leading-none">
              Inflación {inflacion.month}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-text-primary text-base lg:text-lg leading-tight">{inflacion.value.toFixed(1)}%</span>
              {inflacion.interanual !== undefined && (
                <span className="text-[10px] lg:text-xs text-text-muted">
                  ({inflacion.interanual.toFixed(1)}% anual)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
