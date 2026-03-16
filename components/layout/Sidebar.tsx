'use client';

import Link from 'next/link';
import { Calendar, TrendingUp, Bell } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { TEMAS, formatFechaCorta } from '@/lib/constants';
import { Tema } from '@/lib/types';

interface SidebarProps {
  fechasDisponibles: string[];
}

// Helper to get icon component dynamically
function getIconComponent(iconName: string) {
  const pascalName = iconName.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalName];
}

// Top themes to show
const topTemas: Tema[] = ['energia', 'transporte', 'finanzas', 'trabajo', 'salud', 'comercio-exterior'];

export function Sidebar({ fechasDisponibles }: SidebarProps) {
  return (
    <div className="sticky top-20 flex flex-col gap-6">
      {/* Trending Topics */}
      <div className="bg-bg-surface rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-accent" />
          <h3 className="font-[family-name:var(--font-lora)] text-base font-medium text-text-primary">
            Temas del momento
          </h3>
        </div>
        <div className="flex flex-col gap-2">
          {topTemas.map((tema) => {
            const temaInfo = TEMAS[tema];
            const TemaIcon = getIconComponent(temaInfo.icon);
            return (
              <Link
                key={tema}
                href={`/tema/${tema}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg transition-colors group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${temaInfo.color}15` }}
                >
                  {TemaIcon && (
                    <TemaIcon
                      className="w-4 h-4"
                      style={{ color: temaInfo.color }}
                    />
                  )}
                </div>
                <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                  {temaInfo.label}
                </span>
              </Link>
            );
          })}
        </div>
        <Link
          href="/temas"
          className="block mt-3 text-xs text-accent hover:underline text-center"
        >
          Ver todos los temas
        </Link>
      </div>

      {/* Recent Editions */}
      <div className="bg-bg-surface rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-accent" />
          <h3 className="font-[family-name:var(--font-lora)] text-base font-medium text-text-primary">
            Ediciones recientes
          </h3>
        </div>
        <div className="flex flex-col gap-1">
          {fechasDisponibles.slice(0, 5).map((fecha) => (
            <button
              key={fecha}
              className="text-left px-3 py-2 text-sm text-text-secondary hover:bg-bg hover:text-text-primary rounded-lg transition-colors"
            >
              {formatFechaCorta(fecha)}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-accent-soft rounded-lg p-4 border border-accent/20">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-accent" />
          <h3 className="font-medium text-text-primary text-sm">
            Newsletter diario
          </h3>
        </div>
        <p className="text-xs text-text-secondary mb-3">
          Recibí un resumen diario del Boletín Oficial en tu email.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="tu@email.com"
            className="flex-1 px-3 py-2 text-xs bg-bg border border-border rounded-lg focus:outline-none focus:border-accent"
          />
          <button className="px-3 py-2 text-xs font-medium bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
            Suscribir
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-text-muted space-y-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/sobre" className="hover:text-text-secondary">Sobre nosotros</Link>
          <Link href="/contacto" className="hover:text-text-secondary">Contacto</Link>
          <Link href="/privacidad" className="hover:text-text-secondary">Privacidad</Link>
          <Link href="/terminos" className="hover:text-text-secondary">Términos</Link>
        </div>
        <p className="pt-2">
          Powered by AI. Fuente:{' '}
          <a
            href="https://www.boletinoficial.gob.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Boletín Oficial
          </a>
        </p>
      </div>
    </div>
  );
}
