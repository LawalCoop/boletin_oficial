import { SeccionBoletin } from '@/lib/types';
import { BOLETIN_OFICIAL_BASE_URL } from '@/lib/constants';

const USER_AGENT = 'BoletinAI/1.0 (scraper educativo; contacto@boletinai.ar)';
const DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Formats a date string (YYYY-MM-DD) to BORA's format (YYYYMMDD) */
function formatDateForBora(fecha: string): string {
  return fecha.replace(/-/g, '');
}

/** Fetches the listing page HTML for a given section and date */
export async function fetchSeccionListing(
  seccion: SeccionBoletin,
  fecha: string
): Promise<string> {
  const boraDate = formatDateForBora(fecha);
  const url = `${BOLETIN_OFICIAL_BASE_URL}/seccion/${seccion}/${boraDate}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`Error fetching listing ${url}: ${res.status} ${res.statusText}`);
  }

  return res.text();
}

/** Fetches additional pages via the AJAX pagination endpoint */
export async function fetchSeccionPage(
  page: number,
  ultimoRubro: string = ''
): Promise<{ html: string; hayMasDatos: boolean; siguientePagina: number; ultimoRubro: string }> {
  const url = `${BOLETIN_OFICIAL_BASE_URL}/seccion/actualizar/0?pag=${page}&id_rubro=&ult_rubro_bsq=${encodeURIComponent(ultimoRubro)}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`Error fetching page ${page}: ${res.status}`);
  }

  const data = await res.json();
  return {
    html: data.html || '',
    hayMasDatos: data.hay_mas_datos || false,
    siguientePagina: data.sig_pag || page + 1,
    ultimoRubro: data.ult_rubro || '',
  };
}

/** Fetches the detail page HTML for a specific document */
export async function fetchDocumentDetail(urlDetalle: string): Promise<string> {
  const url = urlDetalle.startsWith('http')
    ? urlDetalle
    : `${BOLETIN_OFICIAL_BASE_URL}${urlDetalle}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`Error fetching detail ${url}: ${res.status} ${res.statusText}`);
  }

  return res.text();
}

/** Fetches all documents for a section+date with pagination and delay between requests */
export async function fetchAllListings(
  seccion: SeccionBoletin,
  fecha: string
): Promise<string[]> {
  const htmlPages: string[] = [];

  // First page is the main listing
  const firstPage = await fetchSeccionListing(seccion, fecha);
  htmlPages.push(firstPage);

  // Fetch additional pages via AJAX
  let page = 2;
  let ultimoRubro = '';
  let hayMas = true;

  while (hayMas) {
    await sleep(DELAY_MS);
    try {
      const result = await fetchSeccionPage(page, ultimoRubro);
      if (result.html.trim()) {
        htmlPages.push(result.html);
      }
      hayMas = result.hayMasDatos;
      page = result.siguientePagina;
      ultimoRubro = result.ultimoRubro;
    } catch {
      // If pagination fails, we still have the first page
      break;
    }
  }

  return htmlPages;
}

/** Fetches document detail with delay */
export async function fetchDocumentDetailWithDelay(urlDetalle: string): Promise<string> {
  await sleep(DELAY_MS);
  return fetchDocumentDetail(urlDetalle);
}
