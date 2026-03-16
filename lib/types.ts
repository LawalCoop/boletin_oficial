// Types for the BoletínAI application

// Categoría principal (jurisdicción/origen)
export type Categoria = 'nacional' | 'provincial' | 'municipal' | 'empresas' | 'contrataciones' | 'judicial';

// Categoría temática (materia/tema del documento)
export type Tema =
  | 'energia'
  | 'transporte'
  | 'salud'
  | 'educacion'
  | 'trabajo'
  | 'comercio-exterior'
  | 'impuestos'
  | 'seguridad'
  | 'medio-ambiente'
  | 'agro'
  | 'mineria'
  | 'telecomunicaciones'
  | 'finanzas'
  | 'justicia'
  | 'defensa'
  | 'cultura'
  | 'ciencia'
  | 'vivienda'
  | 'turismo'
  | 'designaciones'
  | 'presupuesto'
  | 'otros';

export type SeccionBoletin = 'primera' | 'segunda' | 'tercera' | 'cuarta';
export type TipoDocumento = 'decreto' | 'resolucion' | 'disposicion' | 'ordenanza' | 'edicto' | 'licitacion' | 'comunicacion' | 'acordada' | 'ley' | 'decision_administrativa';

export interface NoticiaPreview {
  id: string;
  slug: string;
  categoria: Categoria;
  // Categoría temática - para agrupar por tema
  tema: Tema;
  seccionBoletin: SeccionBoletin;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  titulo: string;
  extracto: string;
  imagen?: string;
  fuente: string;
  tiempoLectura: number;
  fechaPublicacion: string;
  destacado?: boolean;
  tags: string[];
  // Link directo al Boletín Oficial - SIEMPRE presente
  urlOriginal: string;
}

export interface NoticiasDia {
  fecha: string;
  generadoEn: string;
  edicionBoletin?: string;
  noticias: NoticiaPreview[];
}

export interface PuntoClave {
  titulo: string;
  descripcion: string;
}

export interface GrupoAfectado {
  grupo: string;
  icono: string;
  descripcion: string;
}

export interface ArticuloOriginal {
  numero: string;
  titulo: string;
  contenido: string;
}

export interface ArticuloRelacionado {
  slug: string;
  titulo: string;
  categoria: Categoria;
}

export interface Votacion {
  positivos: number;
  neutrales: number;
  negativos: number;
}

export interface Articulo {
  id: string;
  slug: string;
  metadata: {
    categoria: Categoria;
    tema: Tema;
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
    organismoEmisor: string;
    // Link directo al documento en el Boletín Oficial - SIEMPRE presente
    urlOriginal: string;
    // Fecha de publicación en el Boletín Oficial
    fechaBoletinOficial: string;
    // Número de edición del Boletín
    numeroEdicion?: string;
  };
  contenidoIA: {
    titulo: string;
    resumen: string;
    puntosClaves: PuntoClave[];
    aQuienAfecta: GrupoAfectado[];
  };
  textoOriginal: {
    encabezado: string;
    articulos: ArticuloOriginal[];
  };
  votacion: Votacion;
  relacionados: ArticuloRelacionado[];
  imagen?: string;
  fechaPublicacion: string;
  tiempoLectura: number;
  tags?: string[];
}

// Chat types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Admin types
export interface TriggerRequest {
  fecha: string;
  seccion?: SeccionBoletin;
}

export interface TriggerResponse {
  jobId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
}

export interface JobStatus {
  jobId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  fecha: string;
  seccion?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

// Pipeline types
export interface BoraDocumentEntry {
  id: string;
  organismo: string;
  tipoDocumento: string;
  numero: string;
  referencia: string;
  descripcion: string;
  urlDetalle: string;
  seccion: SeccionBoletin;
}

export interface BoraDocumentDetail {
  entry: BoraDocumentEntry;
  textoCompleto: string;
  encabezado: string;
  articulos: { numero: string; titulo: string; contenido: string }[];
}

export type PipelineEvent =
  | { type: 'start'; total: number }
  | { type: 'scraping'; current: number; total: number; doc: string }
  | { type: 'processing'; current: number; total: number; doc: string }
  | { type: 'saved'; slug: string }
  | { type: 'error'; doc: string; error: string }
  | { type: 'complete'; total: number; success: number; failed: number };
