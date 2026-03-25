import versionData from '@/lib/version.json';
import { GitCommit } from 'lucide-react';

export default function VersionPage() {
  const { commits, generatedAt } = versionData;

  return (
    <main className="p-6 max-w-2xl">
      <h1 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary mb-6">
        Versión
      </h1>

      <section className="bg-bg rounded-lg border border-border p-6">
        <h2 className="text-sm font-medium text-text-secondary mb-4">
          Últimos commits
        </h2>

        {commits.length === 0 ? (
          <p className="text-sm text-text-muted">
            No hay información de commits disponible.
          </p>
        ) : (
          <div className="space-y-4">
            {commits.map((commit, i) => (
              <div key={commit.hash} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    i === 0 ? 'bg-accent/10 text-accent' : 'bg-bg-surface text-text-muted'
                  }`}>
                    <GitCommit className="w-4 h-4" />
                  </div>
                  {i < commits.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-1" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-text-primary">
                    {commit.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                    <code className="bg-bg-surface px-1.5 py-0.5 rounded">
                      {commit.shortHash}
                    </code>
                    <span>{commit.author}</span>
                    <span>&middot;</span>
                    <span>{new Date(commit.date).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {generatedAt && (
          <p className="text-xs text-text-muted mt-6 pt-4 border-t border-border">
            La información de commits se genera durante el proceso de build.
            Último build: {new Date(generatedAt).toLocaleString('es-AR')}.
          </p>
        )}
      </section>
    </main>
  );
}
