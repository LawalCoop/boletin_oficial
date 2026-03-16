'use client';

import { useState, useEffect } from 'react';
import { Play, RefreshCw, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { JobStatus, SeccionBoletin } from '@/lib/types';
import { SECCIONES_BOLETIN } from '@/lib/constants';

export default function AdminPage() {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [seccion, setSeccion] = useState<SeccionBoletin | ''>('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobStatus[]>([]);
  const [lastTrigger, setLastTrigger] = useState<{ jobId: string; status: string } | null>(null);

  // Fetch job statuses
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/admin/trigger');
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    }
    fetchJobs();
  }, []);

  const handleTrigger = async () => {
    setLoading(true);
    setLastTrigger(null);

    try {
      const res = await fetch('/api/admin/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha,
          seccion: seccion || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLastTrigger(data);
        // Add to jobs list
        setJobs(prev => [{
          jobId: data.jobId,
          status: data.status,
          fecha,
          seccion: seccion || undefined,
        }, ...prev]);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error triggering job:', error);
      alert('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-status-positive" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 text-accent animate-spin" />;
      case 'queued':
        return <Clock className="w-4 h-4 text-text-muted" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-status-negative" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'running':
        return 'Procesando';
      case 'queued':
        return 'En cola';
      case 'failed':
        return 'Error';
      default:
        return status;
    }
  };

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
                className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:border-accent"
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
                className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:border-accent bg-white"
              >
                <option value="">Todas las secciones</option>
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
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full h-12 bg-accent text-white rounded font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Procesar Boletín
                </>
              )}
            </button>

            {/* Last Trigger Result */}
            {lastTrigger && (
              <div className="flex items-center gap-2 p-3 bg-accent-soft rounded">
                {getStatusIcon(lastTrigger.status)}
                <span className="text-sm">
                  Job <code className="bg-bg px-1 rounded">{lastTrigger.jobId}</code> creado
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Jobs List */}
        <section className="bg-bg rounded-lg border border-border p-6">
          <h2 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary mb-4">
            Historial de Procesamiento
          </h2>

          {jobs.length === 0 ? (
            <p className="text-text-muted text-sm">No hay jobs registrados</p>
          ) : (
            <div className="flex flex-col gap-2">
              {jobs.map((job) => (
                <div
                  key={job.jobId}
                  className="flex items-center justify-between p-3 bg-bg-surface rounded"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {job.fecha}
                        {job.seccion && (
                          <span className="text-text-muted"> · {SECCIONES_BOLETIN[job.seccion as SeccionBoletin]?.label}</span>
                        )}
                      </p>
                      <p className="text-xs text-text-muted">
                        {job.jobId}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      job.status === 'completed'
                        ? 'bg-status-positive/10 text-status-positive'
                        : job.status === 'running'
                        ? 'bg-accent/10 text-accent'
                        : job.status === 'failed'
                        ? 'bg-status-negative/10 text-status-negative'
                        : 'bg-bg text-text-muted'
                    }`}
                  >
                    {getStatusLabel(job.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-bg-warm border border-border rounded">
          <p className="text-sm text-text-secondary">
            <strong>Nota:</strong> Este panel es un skeleton para el equipo de workers.
            En producción, el botón "Procesar Boletín" enviará un job al sistema de
            scraping + LLM que generará los artículos automáticamente.
          </p>
        </div>
      </main>
    </div>
  );
}
