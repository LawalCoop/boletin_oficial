'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function AdminLogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    setIsSubmitting(true);

    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });
    } finally {
      router.push('/admin/login');
      router.refresh();
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-sm font-medium text-text-secondary transition hover:border-border-strong hover:text-text-primary disabled:opacity-50"
    >
      <LogOut className="h-4 w-4" />
      {isSubmitting ? 'Saliendo...' : 'Salir'}
    </button>
  );
}
