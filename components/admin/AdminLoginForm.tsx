'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, ShieldAlert } from 'lucide-react';

type AdminLoginFormProps = {
  next: string;
};

export function AdminLoginForm({ next }: AdminLoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, next }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'No se pudo iniciar sesión');
        return;
      }

      router.push(data.redirectTo ?? '/admin');
      router.refresh();
    } catch {
      setError('No se pudo iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-text-secondary">
          Usuario
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          disabled={isSubmitting}
          className="w-full rounded border border-border bg-bg px-4 py-3 text-text-primary outline-none transition focus:border-accent disabled:opacity-50"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
          Clave
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
          className="w-full rounded border border-border bg-bg px-4 py-3 text-text-primary outline-none transition focus:border-accent disabled:opacity-50"
        />
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded border border-status-negative/20 bg-status-negative/8 px-3 py-3 text-sm text-status-negative">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded bg-accent text-sm font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LockKeyhole className="h-4 w-4" />
        {isSubmitting ? 'Validando acceso...' : 'Entrar al panel'}
      </button>
    </form>
  );
}
