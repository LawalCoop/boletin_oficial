'use client';

import { Home, Search, Bookmark, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/buscar', icon: Search, label: 'Buscar' },
  { href: '/guardados', icon: Bookmark, label: 'Guardados' },
  { href: '/perfil', icon: User, label: 'Perfil' },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg border-t border-border z-50 lg:hidden">
      <div className="flex justify-around items-center h-20 pb-[34px] pt-3">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1"
            >
              <Icon
                className={`w-[22px] h-[22px] ${
                  isActive ? 'text-text-primary' : 'text-text-muted'
                }`}
              />
              <span
                className={`text-[10px] ${
                  isActive ? 'font-bold text-text-primary' : 'font-medium text-text-muted'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
