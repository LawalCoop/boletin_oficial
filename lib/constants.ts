import { Categoria, SeccionBoletin, Tema } from './types';

export const CATEGORIAS: Record<Categoria, { color: string; label: string; bgColor: string }> = {
  nacional: { color: '#0066CC', label: 'NACIONAL', bgColor: '#0066CC' },
  provincial: { color: '#7C3AED', label: 'PROVINCIAL', bgColor: '#7C3AED' },
  municipal: { color: '#D97706', label: 'MUNICIPAL', bgColor: '#D97706' },
  empresas: { color: '#059669', label: 'EMPRESAS', bgColor: '#059669' },
  contrataciones: { color: '#DC2626', label: 'CONTRATACIONES', bgColor: '#DC2626' },
  judicial: { color: '#4B5563', label: 'JUDICIAL', bgColor: '#4B5563' },
};

// Categorías temáticas con iconos de Lucide
export const TEMAS: Record<Tema, { label: string; icon: string; color: string }> = {
  'energia': { label: 'Energía', icon: 'zap', color: '#F59E0B' },
  'transporte': { label: 'Transporte', icon: 'truck', color: '#6366F1' },
  'salud': { label: 'Salud', icon: 'heart-pulse', color: '#EF4444' },
  'educacion': { label: 'Educación', icon: 'graduation-cap', color: '#8B5CF6' },
  'trabajo': { label: 'Trabajo', icon: 'briefcase', color: '#3B82F6' },
  'comercio-exterior': { label: 'Comercio Exterior', icon: 'ship', color: '#0EA5E9' },
  'impuestos': { label: 'Impuestos', icon: 'receipt', color: '#10B981' },
  'seguridad': { label: 'Seguridad', icon: 'shield', color: '#64748B' },
  'medio-ambiente': { label: 'Medio Ambiente', icon: 'leaf', color: '#22C55E' },
  'agro': { label: 'Agro', icon: 'wheat', color: '#84CC16' },
  'mineria': { label: 'Minería', icon: 'mountain', color: '#78716C' },
  'telecomunicaciones': { label: 'Telecomunicaciones', icon: 'wifi', color: '#06B6D4' },
  'finanzas': { label: 'Finanzas', icon: 'landmark', color: '#14B8A6' },
  'justicia': { label: 'Justicia', icon: 'scale', color: '#A855F7' },
  'defensa': { label: 'Defensa', icon: 'shield-check', color: '#475569' },
  'cultura': { label: 'Cultura', icon: 'palette', color: '#EC4899' },
  'ciencia': { label: 'Ciencia', icon: 'flask-conical', color: '#7C3AED' },
  'vivienda': { label: 'Vivienda', icon: 'home', color: '#F97316' },
  'turismo': { label: 'Turismo', icon: 'plane', color: '#0891B2' },
  'designaciones': { label: 'Designaciones', icon: 'user-check', color: '#6B7280' },
  'presupuesto': { label: 'Presupuesto', icon: 'wallet', color: '#059669' },
  'otros': { label: 'Otros', icon: 'file-text', color: '#9CA3AF' },
};

export const SECCIONES_BOLETIN: Record<SeccionBoletin, { label: string; descripcion: string }> = {
  primera: { label: 'Primera Sección', descripcion: 'Decretos, Resoluciones, Disposiciones' },
  segunda: { label: 'Segunda Sección', descripcion: 'Sociedades' },
  tercera: { label: 'Tercera Sección', descripcion: 'Licitaciones' },
  cuarta: { label: 'Cuarta Sección', descripcion: 'Edictos Judiciales' },
};

// Mapeo de sección del Boletín a categoría del portal
export const SECCION_TO_CATEGORIA: Record<SeccionBoletin, Categoria> = {
  primera: 'nacional',
  segunda: 'empresas',
  tercera: 'contrataciones',
  cuarta: 'judicial',
};

export const BOLETIN_OFICIAL_BASE_URL = 'https://www.boletinoficial.gob.ar';

export const TIPO_DOCUMENTO_LABELS: Record<string, string> = {
  decreto: 'Decreto',
  resolucion: 'Resolución',
  disposicion: 'Disposición',
  ordenanza: 'Ordenanza',
  edicto: 'Edicto',
  licitacion: 'Licitación',
};

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Parse date string "YYYY-MM-DD" or ISO "YYYY-MM-DDTHH:mm:ssZ" without timezone issues
export function parseFechaLocal(fecha: string): { year: number; month: number; day: number } {
  // Extract just the date part (first 10 chars) to handle ISO dates
  const datePart = fecha.substring(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);
  return { year, month: month - 1, day }; // month is 0-indexed
}

export function formatFechaCorta(fecha: string): string {
  const { month, day } = parseFechaLocal(fecha);
  const mes = MESES[month];
  return `${day} de ${mes}`;
}

export function formatFechaCompleta(fecha: string): string {
  const { year, month, day } = parseFechaLocal(fecha);
  const mes = MESES[month];
  return `${day} de ${mes} de ${year}`;
}

export function calcularTiempoTranscurrido(fecha: string): string {
  const ahora = new Date();
  const publicacion = new Date(fecha);
  const diff = ahora.getTime() - publicacion.getTime();

  const minutos = Math.floor(diff / (1000 * 60));
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutos < 60) return `Hace ${minutos} min`;
  if (horas < 24) return `Hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  if (dias < 7) return `Hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
  return formatFechaCorta(fecha);
}
