'use client';

import { useState, useRef } from 'react';
import { Play, RefreshCw, CheckCircle, AlertCircle, ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { SeccionBoletin, PipelineEvent } from '@/lib/types';
import { SECCIONES_BOLETIN } from '@/lib/constants';

interface LogEntry {
  id: number;
  type: 'info' | 'success' | 'error';
  message: string;
  timestamp: string;
}

export default function AdminPage() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [seccion, setSeccion] = useState<SeccionBoletin | ''>('');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number; phase: string } | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<{ success: number; failed: number; total: number } | null>(null);
  const logIdRef = useRef(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = (type: LogEntry['type'], message: string) => {
    const entry: LogEntry = {
      id: logIdRef.current++,
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [...prev, entry]);
    setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleTrigger = async () => {
    setRunning(true);
    setLogs([]);
    setProgress(null);
    setResult(null);
    logIdRef.current = 0;

    addLog('info', `Iniciando procesamiento del boletín ${fecha}...`);

    try {
      const res = await fetch('/api/admin/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha,
          seccion: seccion || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        addLog('error', `Error: ${errorData.error}`);
        setRunning(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        addLog('error', 'No se pudo obtener el stream de respuesta');
        setRunning(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          try {
            const event: PipelineEvent = JSON.parse(line.slice(6));
            handleEvent(event);
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      addLog('error', `Error de conexión: ${msg}`);
    } finally {
      setRunning(false);
    }
  };

  const handleEvent = (event: PipelineEvent) => {
    switch (event.type) {
      case 'start':
        addLog('info', `Encontrados ${event.total} documentos para procesar`);
        setProgress({ current: 0, total: event.total, phase: 'Scraping' });
        break;
      case 'scraping':
        addLog('info', `Scraping ${event.current}/${event.total}: ${event.doc}`);
        setProgress({ current: event.current, total: event.total, phase: 'Scraping' });
        break;
      case 'processing':
        addLog('info', `Procesando con IA ${event.current}/${event.total}: ${event.doc}`);
        setProgress({ current: event.current, total: event.total, phase: 'Procesando con IA' });
        break;
      case 'saved':
        addLog('success', `Guardado: ${event.slug}`);
        break;
      case 'error':
        addLog('error', `${event.doc}: ${event.error}`);
        break;
      case 'complete':
        setResult({ success: event.success, failed: event.failed, total: event.total });
        if (event.success > 0) {
          addLog('success', `Completado: ${event.success} artículos generados, ${event.failed} fallidos de ${event.total} total`);
        } else if (event.total === 0) {
          addLog('info', 'No se encontraron documentos para esa fecha/sección');
        } else {
          addLog('error', `Completado con errores: ${event.failed} fallidos de ${event.total}`);
        }
        break;
    }
  };

  const progressPercent = progress
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-bg-surface">
      {/* Header */}
      <header className="bg-bg border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary">
              Panel de Administración
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        {/* Trigger Section */}
        <section className="bg-bg rounded-lg border border-border p-6 mb-6">
          <h2 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary mb-4">
            Procesar Boletín Oficial
          </h2>

          <div className="flex flex-col gap-4">
            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Fecha del Boletín
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                disabled={running}
                className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:border-accent disabled:opacity-50"
              />
            </div>

            {/* Section Select */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Sección (opcional)
              </label>
              <select
                value={seccion}
                onChange={(e) => setSeccion(e.target.value as SeccionBoletin | '')}
                disabled={running}
                className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:border-accent bg-white disabled:opacity-50"
              >
                <option value="">Primera Sección (default)</option>
                {Object.entries(SECCIONES_BOLETIN).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label} - {value.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleTrigger}
              disabled={running}
              className="flex items-center justify-center gap-2 w-full h-12 bg-accent text-white rounded font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  {progress ? `${progress.phase} ${progress.current}/${progress.total}...` : 'Iniciando...'}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Procesar Boletín
                </>
              )}
            </button>

            {/* Progress Bar */}
            {running && progress && (
              <div className="w-full bg-bg-surface rounded-full h-2 overflow-hidden">
                <div
                  className="bg-accent h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            {/* Result Summary */}
            {result && !running && (
              <div className={`flex items-center gap-2 p-3 rounded ${
                result.success > 0 ? 'bg-status-positive/10' : 'bg-status-negative/10'
              }`}>
                {result.success > 0 ? (
                  <CheckCircle className="w-5 h-5 text-status-positive" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-status-negative" />
                )}
                <span className="text-sm font-medium">
                  {result.success} artículos generados
                  {result.failed > 0 && `, ${result.failed} fallidos`}
                  {' '}de {result.total} documentos
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Log Panel */}
        {logs.length > 0 && (
          <section className="bg-bg rounded-lg border border-border p-6">
            <h2 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Log de procesamiento
            </h2>

            <div className="max-h-96 overflow-y-auto space-y-1 font-mono text-xs">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex gap-2 py-1 px-2 rounded ${
                    log.type === 'error'
                      ? 'bg-status-negative/5 text-status-negative'
                      : log.type === 'success'
                      ? 'bg-status-positive/5 text-status-positive'
                      : 'text-text-secondary'
                  }`}
                >
                  <span className="text-text-muted shrink-0">{log.timestamp}</span>
                  <span>{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
