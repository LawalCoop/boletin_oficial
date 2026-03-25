'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Newspaper, GitCommit } from 'lucide-react';
import { AdminLogoutButton } from '@/components/admin/AdminLogoutButton';

const navItems = [
  { href: '/admin', label: 'Boletín Oficial', icon: Newspaper },
  { href: '/admin/version', label: 'Versión', icon: GitCommit },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-bg-surface flex">
      {/* Sidebar */}
      <aside className="w-56 bg-bg border-r border-border flex flex-col shrink-0">
        <div className="h-14 flex items-center gap-3 px-4 border-b border-border">
          <Link href="/" className="text-text-muted hover:text-text-primary">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary">
            Admin
          </span>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:bg-bg-surface hover:text-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
