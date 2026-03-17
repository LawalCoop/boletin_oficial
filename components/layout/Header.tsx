'use client';

import { ScrollText, Search, Bell, Home, Bookmark, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CountrySelector } from './CountrySelector';

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/buscar', label: 'Buscar', icon: Search },
  { href: '/guardados', label: 'Guardados', icon: Bookmark },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-bg border-b border-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 lg:h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <ScrollText className="w-6 h-6 lg:w-7 lg:h-7 text-accent" />
          <div className="flex flex-col">
            <span className="font-[family-name:var(--font-lora)] text-[22px] lg:text-[26px] font-medium text-text-primary tracking-tight leading-none">
              entreLín<span className="text-accent">[IA]</span>s
            </span>
            <span className="hidden sm:block text-[10px] lg:text-xs text-text-muted tracking-wider mt-0.5">
              ciudadanIA informada
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-accent bg-accent-soft'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Country Selector */}
          <CountrySelector />

          {/* Search - visible on mobile, hidden on desktop (in nav) */}
          <button className="p-2 lg:hidden rounded-lg hover:bg-bg-surface transition-colors" aria-label="Buscar">
            <Search className="w-[22px] h-[22px] text-text-muted" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-bg-surface transition-colors relative" aria-label="Notificaciones">
            <Bell className="w-[22px] h-[22px] text-text-muted" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>

          {/* Profile - desktop only */}
          <Link
            href="/perfil"
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-bg-surface transition-colors"
          >
            <div className="w-8 h-8 bg-bg-surface rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-text-muted" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
