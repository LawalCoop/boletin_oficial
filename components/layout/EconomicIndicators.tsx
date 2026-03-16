'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Percent, Cloud, Sun, CloudRain, CloudSnow, CloudFog } from 'lucide-react';

interface Indicator {
  value: number;
  date: string;
  change?: number;
}

interface Weather {
  temp: number;
  code: number;
}

// Get weather icon based on WMO code
function getWeatherIcon(code: number) {
  if (code === 0) return Sun; // Clear sky
  if (code <= 3) return Cloud; // Partly cloudy
  if (code <= 49) return CloudFog; // Fog
  if (code <= 69) return CloudRain; // Rain
  if (code <= 79) return CloudSnow; // Snow
  if (code <= 99) return CloudRain; // Thunderstorm
  return Cloud;
}

export function EconomicIndicators() {
  const [riesgoPais, setRiesgoPais] = useState<Indicator | null>(null);
  const [inflacion, setInflacion] = useState<Indicator | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIndicators() {
      try {
        // Fetch riesgo país (array, get last item)
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

        // Fetch inflación (últimos datos)
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

        // Fetch weather for Buenos Aires (Open-Meteo, no API key needed)
        const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-34.61&longitude=-58.38&current=temperature_2m,weather_code&timezone=America/Argentina/Buenos_Aires');
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          setWeather({
            temp: Math.round(weatherData.current.temperature_2m),
            code: weatherData.current.weather_code,
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
        <div className="h-4 w-24 bg-bg-surface rounded"></div>
        <div className="h-4 w-24 bg-bg-surface rounded"></div>
      </div>
    );
  }

  const WeatherIcon = weather ? getWeatherIcon(weather.code) : Sun;

  return (
    <div className="flex items-center gap-4 lg:gap-6 text-sm">
      {/* Weather */}
      {weather && (
        <div className="flex items-center gap-2">
          <WeatherIcon className="w-5 h-5 text-accent" />
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase tracking-wide">Buenos Aires</span>
            <span className="font-semibold text-text-primary">{weather.temp}°C</span>
          </div>
        </div>
      )}

      {/* Riesgo País */}
      {riesgoPais && (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase tracking-wide">Riesgo País</span>
            <span className="font-semibold text-text-primary">{riesgoPais.value.toLocaleString('es-AR')}</span>
          </div>
        </div>
      )}

      {/* Inflación */}
      {inflacion && (
        <div className="flex items-center gap-2">
          <Percent className="w-4 h-4 text-red-500" />
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted uppercase tracking-wide">Inflación</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-text-primary">{inflacion.value.toFixed(1)}%</span>
              {inflacion.change !== undefined && (
                <span className={`flex items-center text-[10px] ${inflacion.change > 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {inflacion.change > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
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
