'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';
import {
  FileText,
  Bot,
  Smartphone,
  ArrowRight,
  Sparkles,
  Users,
  Heart,
  Scale,
  Eye,
  BookOpen,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  Zap,
  Shield,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-bg pb-20 lg:pb-0">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-b from-accent/10 to-transparent border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          <h1 className="font-[family-name:var(--font-lora)] text-4xl lg:text-5xl font-medium text-text-primary leading-tight">
            ¿Por qué existe <span className="text-accent">entreLín[IA]s</span>?
          </h1>
          <p className="mt-4 text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto">
            Porque el Gobierno Nacional publica cientos de normas cada día en un lenguaje que nadie entiende.
            Y eso no está bien.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* El Problema */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary">
              El problema
            </h2>
          </div>
          <div className="bg-bg-surface rounded-xl p-6 lg:p-8">
            <p className="text-text-secondary leading-relaxed text-lg">
              El <strong>Boletín Oficial</strong> publica diariamente cientos de normas en lenguaje técnico-legal
              que resulta inaccesible para la mayoría de los ciudadanos. Términos como &ldquo;Visto&rdquo;, &ldquo;Considerando&rdquo;,
              y referencias a leyes anteriores dificultan la comprensión del <strong>impacto real</strong> de cada norma.
            </p>
            <div className="mt-6 p-4 bg-bg rounded-lg border border-border font-mono text-sm text-text-muted">
              <p>&ldquo;VISTO el Expediente N° EX-2025-12345678-APN-SE#MEC, la Ley N° 24.065,
              el Decreto N° 134 de fecha 16 de diciembre de 2015, y CONSIDERANDO:
              Que mediante la Ley N° 24.065 se estableció...&rdquo;</p>
            </div>
            <p className="mt-4 text-sm text-text-muted text-center">
              ☝️ Así empieza una norma típica. ¿Quién tiene tiempo de descifrar esto?
            </p>
          </div>
        </section>

        {/* La Solución */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary">
              Nuestra solución
            </h2>
          </div>
          <p className="text-text-secondary leading-relaxed text-lg mb-8">
            Transformamos cada documento oficial en contenido <strong>claro y periodístico</strong>.
            No solo informamos: <strong>aprendemos juntos</strong>. Nosotros también vamos descubriendo
            cómo funciona el Estado, qué es el Boletín Oficial, y cómo nos afectan las normas.
          </p>

          {/* Flujo visual */}
          <div className="bg-gradient-to-r from-gray-50 to-accent/5 rounded-xl p-6 lg:p-8">
            <h3 className="text-center text-sm font-medium text-text-muted uppercase tracking-wide mb-8">
              Cómo funciona
            </h3>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8">
              {/* Paso 1 */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-500" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-text-primary block">Boletín Oficial</span>
                  <span className="text-xs text-text-muted">Lenguaje técnico/legal</span>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-accent rotate-90 lg:rotate-0" />

              {/* Paso 2 */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center relative">
                  <Bot className="w-10 h-10 text-accent" />
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-accent block">IA procesa</span>
                  <span className="text-xs text-text-muted">Traduce, clasifica, resume</span>
                </div>
              </div>

              <ArrowRight className="w-6 h-6 text-accent rotate-90 lg:rotate-0" />

              {/* Paso 3 */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-20 h-20 rounded-2xl bg-accent/30 flex items-center justify-center">
                  <Smartphone className="w-10 h-10 text-accent" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-accent block">entreLín[IA]s</span>
                  <span className="text-xs text-text-muted">Claro y accesible</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Principios */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary">
              Nuestros principios
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-bg-surface rounded-xl p-5">
              <BookOpen className="w-6 h-6 text-accent mb-3" />
              <h3 className="font-semibold text-text-primary mb-2">Aprendemos juntos</h3>
              <p className="text-sm text-text-secondary">Descubrimos junto al lector cómo funciona el Estado.</p>
            </div>
            <div className="bg-bg-surface rounded-xl p-5">
              <MessageSquare className="w-6 h-6 text-accent mb-3" />
              <h3 className="font-semibold text-text-primary mb-2">Periodístico y cercano</h3>
              <p className="text-sm text-text-secondary">Contamos historias, no listamos datos fríos.</p>
            </div>
            <div className="bg-bg-surface rounded-xl p-5">
              <Target className="w-6 h-6 text-accent mb-3" />
              <h3 className="font-semibold text-text-primary mb-2">Simple sin ser simplista</h3>
              <p className="text-sm text-text-secondary">Lenguaje claro, pero con profundidad.</p>
            </div>
            <div className="bg-bg-surface rounded-xl p-5">
              <Zap className="w-6 h-6 text-accent mb-3" />
              <h3 className="font-semibold text-text-primary mb-2">Contextual</h3>
              <p className="text-sm text-text-secondary">Cada artículo es una oportunidad de entender algo más sobre el Estado.</p>
            </div>
          </div>
        </section>

        {/* Mirada Editorial */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Eye className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary">
              Nuestra mirada: desde el pueblo, para el pueblo
            </h2>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 lg:p-8 mb-6">
            <p className="text-text-secondary leading-relaxed">
              <strong>entreLín[IA]s</strong> no es un medio neutral ni pretende serlo. Tenemos una mirada
              <strong> cooperativa y comunitaria</strong>: hablamos desde las personas que van a ser afectadas
              por las normas, no desde quienes las escriben.
            </p>
          </div>

          {/* Ejemplos de traducción */}
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
            Cómo traducimos
          </h3>
          <div className="space-y-3">
            {[
              { oficial: 'Optimización de recursos humanos', nuestro: 'Despidos en el Estado' },
              { oficial: 'Desregulación del mercado laboral', nuestro: 'Se eliminan protecciones para trabajadores' },
              { oficial: 'Actualización tarifaria', nuestro: 'Aumento del X% en la boleta de luz' },
              { oficial: 'Incentivos a la inversión', nuestro: 'Beneficios fiscales para empresas' },
            ].map((ejemplo, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-bg-surface rounded-lg">
                <span className="text-sm text-text-muted line-through flex-1">{ejemplo.oficial}</span>
                <ArrowRight className="w-4 h-4 text-accent hidden sm:block" />
                <span className="text-sm font-medium text-text-primary flex-1">{ejemplo.nuestro}</span>
              </div>
            ))}
          </div>

          {/* Lo que NO hacemos */}
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-red-600 mb-3">
                <XCircle className="w-4 h-4" /> Lo que NO hacemos
              </h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• No usamos lenguaje panfletario</li>
                <li>• No hacemos militancia partidaria</li>
                <li>• No hacemos amarillismo</li>
                <li>• No inventamos datos</li>
              </ul>
            </div>
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold text-green-600 mb-3">
                <CheckCircle className="w-4 h-4" /> Lo que SÍ hacemos
              </h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Preguntamos &ldquo;¿a quién beneficia esto?&rdquo;</li>
                <li>• Usamos lenguaje cotidiano</li>
                <li>• Damos contexto histórico</li>
                <li>• Señalamos contradicciones</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Verificabilidad */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary">
              Siempre verificable
            </h2>
          </div>
          <div className="bg-bg-surface rounded-xl p-6">
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span><strong>Link al original:</strong> Cada artículo tiene link directo al Boletín Oficial</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span><strong>Texto sin modificar:</strong> El texto legal original está disponible íntegro</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span><strong>Transparencia:</strong> Aclaramos que el contenido es generado con IA</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span><strong>Código abierto:</strong> Todo el código está disponible públicamente</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Quiénes somos */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary">
              Quiénes somos
            </h2>
          </div>
          <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-6 lg:p-8 text-center">
            <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="font-[family-name:var(--font-lora)] text-xl font-medium text-text-primary mb-3">
              Cooperativa de Tecnología Lawal
            </h3>
            <p className="text-text-secondary max-w-lg mx-auto mb-6">
              Somos una cooperativa de trabajo que cree en la tecnología como herramienta
              de transformación social. Hacemos software libre porque creemos que el conocimiento
              debe ser accesible para todos.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="https://lawal.coop"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Conocenos
              </a>
              <a
                href="https://github.com/LawalCoop/boletin_oficial"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-bg border border-border text-text-primary rounded-lg text-sm font-medium hover:bg-bg-surface transition-colors"
              >
                Ver código fuente
              </a>
            </div>
          </div>
        </section>

        {/* IA al servicio de la ciudadanía */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-600" />
            </div>
            <h2 className="font-[family-name:var(--font-lora)] text-2xl font-medium text-text-primary">
              IA al servicio de la ciudadanía
            </h2>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-accent/5 rounded-xl p-6 lg:p-8 mb-6">
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              Vivimos en un mundo donde las grandes tecnológicas usan IA para extraer valor de nosotros:
              nuestros datos, nuestra atención, nuestro comportamiento. <strong>Nosotros proponemos lo contrario.</strong>
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white/50 rounded-lg p-5 border border-red-200">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-red-700">El modelo extractivo</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Nosotros como datos al servicio de la IA. Nuestro comportamiento alimenta algoritmos
                  que nos manipulan para consumir más, comprar más, scrollear más.
                </p>
              </div>

              <div className="bg-white/50 rounded-lg p-5 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-green-700">Nuestro modelo</span>
                </div>
                <p className="text-sm text-text-secondary">
                  La IA al servicio de las personas. Usamos tecnología para democratizar
                  el acceso a información pública que ya es nuestra por derecho.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-bg-surface rounded-lg">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-1">Datos abiertos, no privados</h4>
                <p className="text-sm text-text-secondary">
                  El Boletín Oficial es información pública. No estamos extrayendo datos privados de nadie.
                  Estamos haciendo accesible lo que ya pertenece a la ciudadanía.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-bg-surface rounded-lg">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-1">Transparencia total</h4>
                <p className="text-sm text-text-secondary">
                  No hay algoritmos ocultos decidiendo qué mostrarte. No hay perfilado.
                  No vendemos datos. El código es abierto para que cualquiera pueda auditarlo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-bg-surface rounded-lg">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-1">Tecnología que empodera</h4>
                <p className="text-sm text-text-secondary">
                  Queremos que la gente entienda qué hace el Gobierno Nacional. Un ciudadano informado
                  es un ciudadano que puede participar, cuestionar y exigir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cierre */}
        <section className="text-center pb-8 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium">
            <Heart className="w-4 h-4" />
            Hecho con convicción
          </div>
        </section>

      </main>

      <Footer />
      <BottomTabBar />
    </div>
  );
}
