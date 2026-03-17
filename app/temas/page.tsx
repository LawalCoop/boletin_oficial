'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Tema } from '@/lib/types';
import { TEMAS } from '@/lib/constants';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';

// Helper to get icon component dynamically
function getIconComponent(iconName: string) {
  const pascalName = iconName.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalName];
}

// Order temas by relevance/popularity
const temasOrdenados: Tema[] = [
  'energia',
  'trabajo',
  'impuestos',
  'salud',
  'transporte',
  'finanzas',
  'comercio-exterior',
  'agro',
  'educacion',
  'seguridad',
  'justicia',
  'medio-ambiente',
  'defensa',
  'telecomunicaciones',
  'vivienda',
  'turismo',
  'cultura',
  'ciencia',
  'mineria',
  'presupuesto',
  'designaciones',
  'otros',
];

export default function TemasPage() {
  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      {/* Desktop Header */}
      <div className="hidden lg:block">
        <Header />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 bg-bg border-b border-border z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="p-1 hover:bg-bg-surface rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </Link>
          <h1 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary">
            Todos los temas
          </h1>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-b from-accent/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          {/* Breadcrumb - Desktop only */}
          <nav className="hidden lg:flex items-center gap-2 text-sm text-text-muted mb-4">
            <Link href="/" className="hover:text-text-secondary transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-text-primary">Temas</span>
          </nav>

          <h2 className="font-[family-name:var(--font-lora)] text-2xl lg:text-4xl font-medium text-text-primary mb-3">
            Explorá por tema
          </h2>
          <p className="text-text-secondary max-w-2xl">
            Navegá las noticias del Boletín Oficial organizadas por área temática.
            Encontrá rápidamente lo que te interesa: desde energía e impuestos hasta salud y trabajo.
          </p>
        </div>
      </div>

      {/* Temas Grid */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {temasOrdenados.map((tema) => {
            const temaInfo = TEMAS[tema];
            const TemaIcon = getIconComponent(temaInfo.icon);

            return (
              <Link
                key={tema}
                href={`/tema/${tema}`}
                className="group flex flex-col items-center gap-3 p-4 lg:p-6 rounded-xl border border-border bg-bg hover:border-transparent hover:shadow-lg transition-all"
                style={{
                  ['--hover-bg' as string]: `${temaInfo.color}08`,
                  ['--hover-border' as string]: `${temaInfo.color}40`,
                }}
              >
                <div
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${temaInfo.color}15` }}
                >
                  {TemaIcon && (
                    <TemaIcon
                      className="w-6 h-6 lg:w-7 lg:h-7"
                      style={{ color: temaInfo.color }}
                    />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-text-primary text-sm lg:text-base group-hover:text-accent transition-colors">
                    {temaInfo.label}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-bg-surface rounded-xl">
          <h3 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary mb-3">
            Sobre las categorías temáticas
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Cada documento del Boletín Oficial es clasificado automáticamente según su contenido.
            Esto te permite seguir los temas que te interesan sin tener que revisar todo el boletín.
            Podés suscribirte a cualquier tema para recibir alertas cuando se publiquen nuevas normas.
          </p>
        </div>
      </main>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
