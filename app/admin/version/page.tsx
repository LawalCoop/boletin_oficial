import { GitCommit } from 'lucide-react';

export default function VersionPage() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || '';
  const shortSha = sha.slice(0, 7);
  const message = process.env.VERCEL_GIT_COMMIT_MESSAGE || 'local';
  const author = process.env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN || 'dev';

  return (
    <main className="p-6 max-w-2xl">
      <h1 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary mb-6">
        Versión
      </h1>

      <section className="bg-bg rounded-lg border border-border p-6">
        <h2 className="text-sm font-medium text-text-secondary mb-4">
          Último deploy
        </h2>

        {shortSha ? (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-accent/10 text-accent">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {message}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                <code className="bg-bg-surface px-1.5 py-0.5 rounded">
                  {shortSha}
                </code>
                <span>{author}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            Información de versión no disponible (entorno local).
          </p>
        )}

        <p className="text-xs text-text-muted mt-6 pt-4 border-t border-border">
          La información de versión se obtiene del deploy en Vercel.
        </p>
      </section>
    </main>
  );
}
