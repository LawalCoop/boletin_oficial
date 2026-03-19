'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar, X } from 'lucide-react';
import { formatFechaCorta, MESES } from '@/lib/constants';
import { EconomicIndicators } from '@/components/layout/EconomicIndicators';
import { WeatherIndicator } from '@/components/layout/WeatherIndicator';

interface DateHeaderProps {
  fecha: string;
  fechasDisponibles: string[];
  onDateChange: (fecha: string) => void;
  edicionBoletin?: string;
}

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function DateHeader({ fecha, fechasDisponibles, onDateChange, edicionBoletin }: DateHeaderProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Calendar view state - start with the selected date's month
  const [viewYear, setViewYear] = useState(() => parseInt(fecha.split('-')[0]));
  const [viewMonth, setViewMonth] = useState(() => parseInt(fecha.split('-')[1]) - 1);

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

  // Set of available dates for quick lookup
  const availableDatesSet = useMemo(() => new Set(fechasDisponibles), [fechasDisponibles]);

  // Generate calendar days for current view month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handlePrevYear = () => {
    setViewYear(viewYear - 1);
  };

  const handleNextYear = () => {
    setViewYear(viewYear + 1);
  };

  const formatDateString = (day: number) => {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Count available dates in current view month
  const availableInCurrentMonth = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    return fechasDisponibles.filter(f => f.startsWith(prefix)).length;
  }, [fechasDisponibles, viewYear, viewMonth]);

  return (
    <>
      <div className="flex flex-col gap-3 py-2">
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
              onClick={() => {
                setViewYear(parseInt(fecha.split('-')[0]));
                setViewMonth(parseInt(fecha.split('-')[1]) - 1);
                setShowPicker(true);
              }}
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
            onClick={() => {
              setViewYear(parseInt(fecha.split('-')[0]));
              setViewMonth(parseInt(fecha.split('-')[1]) - 1);
              setShowPicker(true);
            }}
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
        <div className="lg:hidden flex items-center justify-evenly pt-6 pb-2 mt-2 border-t border-border">
          <EconomicIndicators />
          <WeatherIndicator />
        </div>
      </div>

      {/* Date Picker Modal - Calendar View */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center">
          <div className="bg-bg w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden">
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

            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevYear}
                  className="p-1.5 hover:bg-bg-surface rounded-full transition-colors"
                  title="Año anterior"
                >
                  <ChevronsLeft className="w-4 h-4 text-text-muted" />
                </button>
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-bg-surface rounded-full transition-colors"
                  title="Mes anterior"
                >
                  <ChevronLeft className="w-5 h-5 text-text-muted" />
                </button>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary">
                  {MESES[viewMonth]} {viewYear}
                </span>
                {availableInCurrentMonth > 0 ? (
                  <span className="text-[10px] text-accent font-medium">
                    {availableInCurrentMonth} {availableInCurrentMonth === 1 ? 'edición' : 'ediciones'}
                  </span>
                ) : (
                  <span className="text-[10px] text-text-muted">
                    Sin ediciones
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-bg-surface rounded-full transition-colors"
                  title="Mes siguiente"
                >
                  <ChevronRight className="w-5 h-5 text-text-muted" />
                </button>
                <button
                  onClick={handleNextYear}
                  className="p-1.5 hover:bg-bg-surface rounded-full transition-colors"
                  title="Año siguiente"
                >
                  <ChevronsRight className="w-4 h-4 text-text-muted" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="px-4 pb-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DIAS_SEMANA.map((dia) => (
                  <div key={dia} className="text-center text-xs font-medium text-text-muted py-2">
                    {dia}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="w-10 h-10" />;
                  }

                  const dateStr = formatDateString(day);
                  const isAvailable = availableDatesSet.has(dateStr);
                  const isSelected = dateStr === fecha;
                  const isToday = dateStr === hoy;

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (isAvailable) {
                          onDateChange(dateStr);
                          setShowPicker(false);
                        }
                      }}
                      disabled={!isAvailable}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-accent text-white'
                          : isToday && isAvailable
                          ? 'bg-accent-soft text-accent border-2 border-accent'
                          : isAvailable
                          ? 'bg-bg-surface text-text-primary hover:bg-border cursor-pointer'
                          : 'text-text-muted/40 cursor-not-allowed'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer info */}
            <div className="px-4 py-3 bg-bg-surface border-t border-border">
              <p className="text-xs text-text-muted text-center">
                {fechasDisponibles.length} ediciones disponibles
              </p>
              {fechasDisponibles.length > 0 && (
                <p className="text-[10px] text-text-muted text-center mt-1">
                  Desde {formatFechaCorta(fechasDisponibles[fechasDisponibles.length - 1])} hasta {formatFechaCorta(fechasDisponibles[0])}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
