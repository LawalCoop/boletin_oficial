import { promises as fs } from 'fs';
import path from 'path';
import {
  Articulo,
  NoticiaPreview,
  NoticiasDia,
  BoraDocumentDetail,
  Tema,
  TipoDocumento,
  SeccionBoletin,
} from '@/lib/types';
import { SECCION_TO_CATEGORIA } from '@/lib/constants';
import { ArticuloAIResult } from './ai-processor';

const DATA_DIR = path.join(process.cwd(), 'data');
const ARTICULOS_DIR = path.join(DATA_DIR, 'articulos');
const NOTICIAS_DIR = path.join(DATA_DIR, 'noticias');

/** Maps tema to a default image path */
const TEMA_IMAGE_MAP: Record<string, string> = {
  'energia': '/images/articulos/energia.jpg',
  'transporte': '/images/articulos/rutas.jpg',
  'salud': '/images/articulos/salud.jpg',
  'impuestos': '/images/articulos/afip.jpg',
  'agro': '/images/articulos/agro.jpg',
  'telecomunicaciones': '/images/articulos/telecomunicaciones.jpg',
  'finanzas': '/images/articulos/bolsa.jpg',
  'justicia': '/images/articulos/justicia.jpg',
  'defensa': '/images/articulos/defensa.jpg',
  'cultura': '/images/articulos/cine.jpg',
  'presupuesto': '/images/articulos/presupuesto.jpg',
  'designaciones': '/images/articulos/funcionarios.jpg',
  'comercio-exterior': '/images/articulos/exportaciones.jpg',
  'seguridad': '/images/articulos/casa-rosada.jpg',
  'medio-ambiente': '/images/articulos/agro.jpg',
  'trabajo': '/images/articulos/industria.jpg',
  'vivienda': '/images/articulos/casa-rosada.jpg',
  'turismo': '/images/articulos/rutas.jpg',
  'ciencia': '/images/articulos/industria.jpg',
  'educacion': '/images/articulos/casa-rosada.jpg',
  'mineria': '/images/articulos/industria.jpg',
  'otros': '/images/articulos/casa-rosada.jpg',
};

function getImageForTema(tema: Tema): string {
  return TEMA_IMAGE_MAP[tema] || '/images/articulos/casa-rosada.jpg';
}

/** Generates a URL-friendly slug from the AI-generated title */
function generateSlug(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '')    // Remove special chars
    .replace(/\s+/g, '-')            // Replace spaces with hyphens
    .replace(/-+/g, '-')             // Collapse multiple hyphens
    .replace(/^-|-$/g, '')           // Trim hyphens
    .substring(0, 80);               // Limit length
}

/** Maps BORA document type string to our TipoDocumento */
function mapTipoDocumento(tipo: string): TipoDocumento {
  const lower = tipo.toLowerCase();
  if (lower.includes('decreto')) return 'decreto';
  if (lower.includes('resolución general') || lower.includes('resolucion general')) return 'resolucion';
  if (lower.includes('resolución') || lower.includes('resolucion')) return 'resolucion';
  if (lower.includes('disposición') || lower.includes('disposicion')) return 'disposicion';
  if (lower.includes('comunicación') || lower.includes('comunicacion')) return 'comunicacion';
  if (lower.includes('acordada')) return 'acordada';
  if (lower.includes('ley')) return 'ley';
  if (lower.includes('decisión administrativa') || lower.includes('decision administrativa')) return 'decision_administrativa';
  if (lower.includes('edicto')) return 'edicto';
  if (lower.includes('licitación') || lower.includes('licitacion')) return 'licitacion';
  return 'resolucion'; // Default fallback
}

/** Calculates reading time based on word count */
function calcularTiempoLectura(texto: string): number {
  const words = texto.split(/\s+/).length;
  return Math.max(2, Math.ceil(words / 200));
}

/** Generates a unique document ID, preferring the BORA entry ID (from the URL, always unique) */
function generateId(boraId: string, tipo: string, numero: string): string {
  if (boraId) return `bora-${boraId}`;
  const tipoShort = tipo.toLowerCase().replace(/[^a-z]/g, '').substring(0, 6);
  const numClean = numero.replace(/\//g, '-');
  return `${tipoShort}-${numClean}`;
}

/** Builds the full Articulo object */
export function buildArticulo(
  doc: BoraDocumentDetail,
  aiResult: ArticuloAIResult,
  fecha: string
): Articulo {
  const slug = generateSlug(aiResult.titulo);
  const tipoDocumento = mapTipoDocumento(doc.entry.tipoDocumento);
  const categoria = SECCION_TO_CATEGORIA[doc.entry.seccion];

  return {
    id: generateId(doc.entry.id, doc.entry.tipoDocumento, doc.entry.numero),
    slug,
    metadata: {
      categoria,
      tema: aiResult.tema,
      tipoDocumento,
      numeroDocumento: doc.entry.numero,
      organismoEmisor: doc.entry.organismo,
      urlOriginal: doc.entry.urlDetalle,
      fechaBoletinOficial: fecha,
    },
    contenidoIA: {
      titulo: aiResult.titulo,
      resumen: aiResult.resumen,
      puntosClaves: aiResult.puntosClaves,
      aQuienAfecta: aiResult.aQuienAfecta,
    },
    textoOriginal: {
      encabezado: doc.encabezado,
      articulos: doc.articulos,
    },
    votacion: { positivos: 0, neutrales: 0, negativos: 0 },
    relacionados: [],
    imagen: getImageForTema(aiResult.tema),
    fechaPublicacion: `${fecha}T08:00:00Z`,
    tiempoLectura: calcularTiempoLectura(doc.textoCompleto),
    tags: aiResult.tags,
  };
}

/** Builds a NoticiaPreview from an Articulo */
function buildPreview(articulo: Articulo, aiResult: ArticuloAIResult): NoticiaPreview {
  return {
    id: articulo.id,
    slug: articulo.slug,
    categoria: articulo.metadata.categoria,
    tema: articulo.metadata.tema,
    seccionBoletin: 'primera' as SeccionBoletin,
    tipoDocumento: articulo.metadata.tipoDocumento,
    numeroDocumento: articulo.metadata.numeroDocumento,
    titulo: articulo.contenidoIA.titulo,
    extracto: articulo.contenidoIA.resumen,
    imagen: articulo.imagen,
    fuente: 'Boletín Oficial - Primera Sección',
    tiempoLectura: articulo.tiempoLectura,
    fechaPublicacion: articulo.fechaPublicacion,
    destacado: aiResult.destacado,
    tags: articulo.tags || [],
    urlOriginal: articulo.metadata.urlOriginal,
  };
}

/** Writes a single article JSON and returns the Articulo */
export async function writeArticulo(articulo: Articulo): Promise<void> {
  await fs.mkdir(ARTICULOS_DIR, { recursive: true });
  const filePath = path.join(ARTICULOS_DIR, `${articulo.slug}.json`);
  await fs.writeFile(filePath, JSON.stringify(articulo, null, 2), 'utf-8');
}

/** Writes the daily news index file */
export async function writeNoticiasDia(
  fecha: string,
  articulos: Articulo[],
  aiResults: Map<string, ArticuloAIResult>,
  docIdToEntryId: Map<string, string>
): Promise<void> {
  await fs.mkdir(NOTICIAS_DIR, { recursive: true });

  const noticias: NoticiaPreview[] = articulos.map((art) => {
    const entryId = docIdToEntryId.get(art.id) || '';
    const aiResult = aiResults.get(entryId);
    return buildPreview(art, aiResult || {
      titulo: art.contenidoIA.titulo,
      resumen: art.contenidoIA.resumen,
      puntosClaves: art.contenidoIA.puntosClaves,
      aQuienAfecta: art.contenidoIA.aQuienAfecta,
      tema: art.metadata.tema,
      tags: art.tags || [],
      destacado: false,
    });
  });

  const noticiasDia: NoticiasDia = {
    fecha,
    generadoEn: new Date().toISOString(),
    noticias,
  };

  const filePath = path.join(NOTICIAS_DIR, `${fecha}.json`);
  await fs.writeFile(filePath, JSON.stringify(noticiasDia, null, 2), 'utf-8');
}

/** Saves all articles and the daily index. Returns the list of slugs. */
export async function saveAll(
  docs: BoraDocumentDetail[],
  aiResults: Map<string, ArticuloAIResult>,
  fecha: string
): Promise<string[]> {
  const articulos: Articulo[] = [];
  const docIdToEntryId = new Map<string, string>();
  const slugs: string[] = [];

  for (const doc of docs) {
    const aiResult = aiResults.get(doc.entry.id);
    if (!aiResult) continue;

    const articulo = buildArticulo(doc, aiResult, fecha);

    // Ensure unique slugs
    let slug = articulo.slug;
    let counter = 1;
    while (slugs.includes(slug)) {
      slug = `${articulo.slug}-${counter}`;
      counter++;
    }
    articulo.slug = slug;

    docIdToEntryId.set(articulo.id, doc.entry.id);
    articulos.push(articulo);
    slugs.push(slug);

    await writeArticulo(articulo);
  }

  await writeNoticiasDia(fecha, articulos, aiResults, docIdToEntryId);

  return slugs;
}
