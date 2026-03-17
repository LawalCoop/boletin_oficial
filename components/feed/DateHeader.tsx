'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';
import { formatFechaCorta, MESES, parseFechaLocal } from '@/lib/constants';
import { EconomicIndicators } from '@/components/layout/EconomicIndicators';
import { WeatherIndicator } from '@/components/layout/WeatherIndicator';

interface DateHeaderProps {
  fecha: string;
  fechasDisponibles: string[];
  onDateChange: (fecha: string) => void;
  edicionBoletin?: string;
}

export function DateHeader({ fecha, fechasDisponibles, onDateChange, edicionBoletin }: DateHeaderProps) {
  const [showPicker, setShowPicker] = useState(false);

  const fechaFormateada = formatFechaCorta(fecha);
  // Get today's date in local timezone (not UTC)
  const now = new Date();
  const hoy = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const esHoy = fecha === hoy;

  // Get current index in available dates
  const currentIndex = fechasDisponibles.indexOf(fecha);
  const canGoPrev = currentIndex < fechasDisponibles.length - 1;
  const canGoNext = currentIndex > 0;

  const handlePrevDay = () => {
    if (canGoPrev) {
      onDateChange(fechasDisponibles[currentIndex + 1]);
    }
  };

  const handleNextDay = () => {
    if (canGoNext) {
      onDateChange(fechasDisponibles[currentIndex - 1]);
    }
  };

  // Group dates by month for picker
  const datesByMonth = fechasDisponibles.reduce((acc, date) => {
    const [year, month] = date.split('-');
    const key = `${year}-${month}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(date);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <>
      <div className="flex flex-col gap-3 py-3">
        {/* Desktop: Indicators left, Date center, Weather right */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:items-center">
          {/* Left: Economic indicators */}
          <div className="flex justify-start">
            <EconomicIndicators />
          </div>

          {/* Center: Date selector */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handlePrevDay}
              disabled={!canGoPrev}
              className={`p-2 hover:bg-bg-surface rounded-full transition-colors ${!canGoPrev ? 'opacity-30 cursor-not-allowed' : ''}`}
              aria-label="Día anterior"
            >
              <ChevronLeft className="w-6 h-6 text-text-muted" />
            </button>

            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-bg-surface rounded-lg transition-colors"
            >
              <Calendar className="w-6 h-6 text-accent" />
              <div className="flex flex-col items-center">
                <span className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary">
                  {esHoy ? `Hoy, ${fechaFormateada}` : fechaFormateada}
                </span>
                {edicionBoletin && (
                  <span className="text-xs text-text-muted">
                    Edición N° {edicionBoletin}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={handleNextDay}
              disabled={!canGoNext}
              className={`p-2 hover:bg-bg-surface rounded-full transition-colors ${!canGoNext ? 'opacity-30 cursor-not-allowed' : ''}`}
              aria-label="Día siguiente"
            >
              <ChevronRight className="w-6 h-6 text-text-muted" />
            </button>
          </div>

          {/* Right: Weather */}
          <div className="flex justify-end">
            <WeatherIndicator />
          </div>
        </div>

        {/* Mobile: Date centered */}
        <div className="lg:hidden flex items-center justify-center gap-2">
          <button
            onClick={handlePrevDay}
            disabled={!canGoPrev}
            className={`p-1.5 hover:bg-bg-surface rounded-full transition-colors ${!canGoPrev ? 'opacity-30 cursor-not-allowed' : ''}`}
            aria-label="Día anterior"
          >
            <ChevronLeft className="w-5 h-5 text-text-muted" />
          </button>

          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-bg-surface rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5 text-accent" />
            <div className="flex flex-col items-center">
              <span className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary">
                {esHoy ? `Hoy, ${fechaFormateada}` : fechaFormateada}
              </span>
              {edicionBoletin && (
                <span className="text-[10px] text-text-muted">
                  Edición N° {edicionBoletin}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={handleNextDay}
            disabled={!canGoNext}
            className={`p-1.5 hover:bg-bg-surface rounded-full transition-colors ${!canGoNext ? 'opacity-30 cursor-not-allowed' : ''}`}
            aria-label="Día siguiente"
          >
            <ChevronRight className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Mobile: Indicators + Weather in separate row */}
        <div className="lg:hidden flex items-center justify-between py-2 border-t border-border">
          <EconomicIndicators />
          <WeatherIndicator />
        </div>
      </div>

      {/* Date Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center">
          <div className="bg-bg w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[70vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary">
                Seleccionar fecha
              </h2>
              <button
                onClick={() => setShowPicker(false)}
                className="p-1 hover:bg-bg-surface rounded-full"
              >
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            {/* Dates List */}
            <div className="overflow-y-auto max-h-[50vh] p-4">
              {Object.entries(datesByMonth)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([monthKey, dates]) => {
                  const [year, month] = monthKey.split('-');
                  const monthName = MESES[parseInt(month) - 1];

                  return (
                    <div key={monthKey} className="mb-4">
                      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                        {monthName} {year}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {dates.sort((a, b) => b.localeCompare(a)).map((date) => {
                          const isSelected = date === fecha;
                          const { day } = parseFechaLocal(date);
                          const isToday = date === hoy;

                          return (
                            <button
                              key={date}
                              onClick={() => {
                                onDateChange(date);
                                setShowPicker(false);
                              }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                isSelected
                                  ? 'bg-accent text-white'
                                  : isToday
                                  ? 'bg-accent-soft text-accent border-2 border-accent'
                                  : 'bg-bg-surface text-text-primary hover:bg-border'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

              {fechasDisponibles.length === 0 && (
                <p className="text-center text-text-muted py-8">
                  No hay fechas disponibles
                </p>
              )}
            </div>

            {/* Footer info */}
            <div className="px-4 py-3 bg-bg-surface border-t border-border">
              <p className="text-xs text-text-muted text-center">
                Mostrando {fechasDisponibles.length} ediciones disponibles del Boletín Oficial
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
