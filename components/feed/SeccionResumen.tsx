'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, TrendingUp, TrendingDown, Building2, FileText, Scale, AlertCircle } from 'lucide-react';

interface ArticuloResumen {
  slug: string;
  titulo: string;
  imagen: string;
  urlOriginal: string;
  contenidoIA: {
    titulo: string;
    resumen: string;
    contexto?: string;
    puntosClaves: Array<{ titulo: string; descripcion: string }>;
  };
  textoOriginal: {
    articulos: Array<{ numero: string; titulo: string; contenido: string }>;
  };
}

interface SeccionResumenProps {
  seccion: 'segunda' | 'tercera' | 'cuarta';
  fecha: string;
}

const SECCION_CONFIG = {
  segunda: {
    titulo: 'Resumen de Sociedades',
    subtitulo: 'Segunda Sección del Boletín Oficial',
    icon: Building2,
    color: '#64748B',
    slugPrefix: 'resumen-sociedades',
  },
  tercera: {
    titulo: 'Resumen de Licitaciones',
    subtitulo: 'Tercera Sección del Boletín Oficial',
    icon: FileText,
    color: '#71717A',
    slugPrefix: 'resumen-licitaciones',
  },
  cuarta: {
    titulo: 'Resumen de Edictos Judiciales',
    subtitulo: 'Cuarta Sección del Boletín Oficial',
    icon: Scale,
    color: '#1F2937',
    slugPrefix: 'resumen-edictos-judiciales',
  },
};

export function SeccionResumen({ seccion, fecha }: SeccionResumenProps) {
  const [articulo, setArticulo] = useState<ArticuloResumen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = SECCION_CONFIG[seccion];
  const Icon = config.icon;

  useEffect(() => {
    async function fetchResumen() {
      setLoading(true);
      setError(null);

      // Construir el slug basado en la fecha
      const [year, month, day] = fecha.split('-');
      const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                     'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      const mes = meses[parseInt(month) - 1];
      const slug = `${config.slugPrefix}-${day}-${mes}-${year}`;

      try {
        const res = await fetch(`/api/noticias/${slug}`);
        if (!res.ok) {
          throw new Error('No hay resumen disponible para esta fecha');
        }
        const data = await res.json();
        setArticulo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el resumen');
      } finally {
        setLoading(false);
      }
    }

    fetchResumen();
  }, [fecha, config.slugPrefix]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-8 bg-bg-surface rounded w-2/3" />
        <div className="h-48 bg-bg-surface rounded" />
        <div className="h-32 bg-bg-surface rounded" />
      </div>
    );
  }

  if (error || !articulo) {
    return (
      <div className="bg-bg-surface rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-text-muted mx-auto mb-4" />
        <h3 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary mb-2">
          {config.titulo}
        </h3>
        <p className="text-text-muted">
          No hay resumen disponible para esta fecha.
        </p>
        <p className="text-sm text-text-muted mt-2">
          Los resúmenes se generan al procesar cada edición del Boletín Oficial.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: config.color }} />
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-lora)] text-xl lg:text-2xl font-medium text-text-primary">
            {articulo.contenidoIA.titulo}
          </h2>
          <p className="text-sm text-text-muted">{config.subtitulo}</p>
        </div>
      </div>

      {/* Imagen */}
      {articulo.imagen && (
        <div
          className="w-full h-48 lg:h-64 rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${articulo.imagen})` }}
        />
      )}

      {/* Resumen */}
      <div className="bg-bg-surface rounded-xl p-5 lg:p-6">
        <p className="text-text-secondary leading-relaxed whitespace-pre-line">
          {articulo.contenidoIA.resumen}
        </p>
      </div>

      {/* Contexto educativo */}
      {articulo.contenidoIA.contexto && (
        <div className="bg-accent/5 border-l-4 border-accent rounded-r-xl p-5">
          <p className="text-sm text-text-secondary leading-relaxed">
            📚 {articulo.contenidoIA.contexto}
          </p>
        </div>
      )}

      {/* Puntos clave */}
      <div className="flex flex-col gap-4">
        <h3 className="font-[family-name:var(--font-lora)] text-lg font-medium text-text-primary">
          Lo más importante
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {articulo.contenidoIA.puntosClaves.map((punto, i) => (
            <div key={i} className="bg-bg-surface rounded-xl p-5">
              <h4 className="font-semibold text-text-primary mb-2">{punto.titulo}</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{punto.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Datos del Boletín */}
      <div className="bg-bg-warm rounded-xl p-5">
        <h3 className="font-medium text-text-primary mb-3">Datos oficiales</h3>
        <div className="flex flex-col gap-2">
          {articulo.textoOriginal.articulos.map((art, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-accent font-semibold text-sm">{art.titulo}:</span>
              <span className="text-sm text-text-secondary">{art.contenido}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Link al original */}
      <a
        href={articulo.urlOriginal}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
      >
        <ExternalLink className="w-4 h-4" />
        Ver sección completa en el Boletín Oficial
      </a>
    </div>
  );
}
