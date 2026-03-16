'use client';

import Link from 'next/link';
import { ExternalLink, Share2, Bookmark, Printer, FileText, Bell } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Articulo } from '@/lib/types';
import { TEMAS, CATEGORIAS } from '@/lib/constants';

interface ArticleSidebarProps {
  articulo: Articulo;
}

// Helper to get icon component dynamically
function getIconComponent(iconName: string) {
  const pascalName = iconName.split('-').map(part =>
    part.charAt(0).toUpperCase() + part.slice(1)
  ).join('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (LucideIcons as any)[pascalName];
}

export function ArticleSidebar({ articulo }: ArticleSidebarProps) {
  const tema = articulo.metadata.tema ? TEMAS[articulo.metadata.tema] : null;
  const categoria = CATEGORIAS[articulo.metadata.categoria];
  const TemaIcon = tema ? getIconComponent(tema.icon) : null;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: articulo.contenidoIA.titulo,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado al portapapeles');
    }
  };

  return (
    <div className="sticky top-20 flex flex-col gap-6">
      {/* Document Info Card */}
      <div className="bg-bg-surface rounded-lg p-4">
        <h3 className="font-[family-name:var(--font-lora)] text-base font-medium text-text-primary mb-4">
          Información del documento
        </h3>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-text-muted text-xs uppercase tracking-wide mb-1">Tipo</dt>
            <dd className="text-text-primary">{articulo.metadata.tipoDocumento}</dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs uppercase tracking-wide mb-1">Número</dt>
            <dd className="text-text-primary">{articulo.metadata.numeroDocumento}</dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs uppercase tracking-wide mb-1">Organismo</dt>
            <dd className="text-text-primary">{articulo.metadata.organismoEmisor}</dd>
          </div>
          <div>
            <dt className="text-text-muted text-xs uppercase tracking-wide mb-1">Categoría</dt>
            <dd>
              <span
                className="inline-block px-2 py-1 text-xs font-semibold text-white rounded"
                style={{ backgroundColor: categoria.color }}
              >
                {categoria.label}
              </span>
            </dd>
          </div>
          {tema && (
            <div>
              <dt className="text-text-muted text-xs uppercase tracking-wide mb-1">Tema</dt>
              <dd>
                <Link
                  href={`/tema/${articulo.metadata.tema}`}
                  className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded border hover:opacity-80 transition-opacity"
                  style={{
                    color: tema.color,
                    borderColor: tema.color,
                    backgroundColor: `${tema.color}10`
                  }}
                >
                  {TemaIcon && <TemaIcon className="w-3 h-3" />}
                  {tema.label}
                </Link>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Actions Card */}
      <div className="bg-bg-surface rounded-lg p-4">
        <h3 className="font-[family-name:var(--font-lora)] text-base font-medium text-text-primary mb-4">
          Acciones
        </h3>
        <div className="flex flex-col gap-2">
          <a
            href={articulo.metadata.urlOriginal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Ver documento original</span>
            <ExternalLink className="w-3 h-3 ml-auto" />
          </a>
          <button
            onClick={handleShare}
            className="flex items-center gap-3 px-3 py-2.5 bg-bg border border-border rounded-lg hover:bg-border/20 transition-colors"
          >
            <Share2 className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-primary">Compartir</span>
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 bg-bg border border-border rounded-lg hover:bg-border/20 transition-colors">
            <Bookmark className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-primary">Guardar</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-3 px-3 py-2.5 bg-bg border border-border rounded-lg hover:bg-border/20 transition-colors"
          >
            <Printer className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-primary">Imprimir</span>
          </button>
        </div>
      </div>

      {/* Subscribe to Theme */}
      {tema && (
        <div className="bg-accent-soft rounded-lg p-4 border border-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4 text-accent" />
            <h3 className="font-medium text-text-primary text-sm">
              Seguir tema: {tema.label}
            </h3>
          </div>
          <p className="text-xs text-text-secondary mb-3">
            Recibí notificaciones cuando se publiquen nuevas normas sobre este tema.
          </p>
          <button
            className="w-full px-3 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: tema.color }}
          >
            Suscribirse
          </button>
        </div>
      )}

      {/* Related Tags */}
      {articulo.tags && articulo.tags.length > 0 && (
        <div>
          <h3 className="text-xs text-text-muted uppercase tracking-wide mb-2">
            Etiquetas
          </h3>
          <div className="flex flex-wrap gap-2">
            {articulo.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-bg-surface text-text-secondary rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
