'use client';

import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudFog, MapPin } from 'lucide-react';

interface Weather {
  temp: number;
  code: number;
  city: string;
}

// Get weather icon based on WMO code
function getWeatherIcon(code: number) {
  if (code === 0) return Sun;
  if (code <= 3) return Cloud;
  if (code <= 49) return CloudFog;
  if (code <= 69) return CloudRain;
  if (code <= 79) return CloudSnow;
  if (code <= 99) return CloudRain;
  return Cloud;
}

export function WeatherIndicator() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Get location - use API in prod (Vercel headers), direct call in local
        let lat = -34.61;
        let lon = -58.38;
        let city = 'Buenos Aires';

        try {
          const isLocal = window.location.hostname === 'localhost';

          if (isLocal) {
            // In local dev, call ip-api.com directly from browser (no API key needed)
            const geoRes = await fetch('http://ip-api.com/json/?fields=status,city,lat,lon');
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              if (geoData.status === 'success' && geoData.lat && geoData.lon) {
                lat = geoData.lat;
                lon = geoData.lon;
                city = geoData.city || 'Tu ubicación';
              }
            }
          } else {
            // In production, use our API (Vercel geo headers)
            const geoRes = await fetch('/api/geo');
            if (geoRes.ok) {
              const geoData = await geoRes.json();
              lat = geoData.latitude;
              lon = geoData.longitude;
              city = geoData.city;
            }
          }
        } catch {
          // Fallback to Buenos Aires if geolocation fails
        }

        // Fetch weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
        );
        if (weatherRes.ok) {
          const weatherData = await weatherRes.json();
          setWeather({
            temp: Math.round(weatherData.current.temperature_2m),
            code: weatherData.current.weather_code,
            city: city,
          });
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-muted animate-pulse">
        <div className="h-4 w-16 bg-bg-surface rounded"></div>
      </div>
    );
  }

  if (!weather) return null;

  const WeatherIcon = getWeatherIcon(weather.code);

  return (
    <div className="flex items-center gap-2">
      <WeatherIcon className="w-6 h-6 lg:w-7 lg:h-7 text-accent" />
      <div className="flex flex-col">
        <span className="text-[10px] lg:text-xs text-text-muted uppercase tracking-wide leading-none flex items-center gap-0.5">
          <MapPin className="w-3 h-3" />
          {weather.city}
        </span>
        <span className="font-semibold text-text-primary text-base lg:text-lg leading-tight">{weather.temp}°C</span>
      </div>
    </div>
  );
}
