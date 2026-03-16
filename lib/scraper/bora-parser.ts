import * as cheerio from 'cheerio';
import { BoraDocumentEntry, BoraDocumentDetail, SeccionBoletin } from '@/lib/types';
import { BOLETIN_OFICIAL_BASE_URL } from '@/lib/constants';

/**
 * Parses the listing page HTML to extract document entries.
 *
 * BORA listing structure:
 *   <h5>DECRETOS</h5>
 *   <a href="/detalleAviso/primera/322375/20250312">
 *     <h6>ORGANISMO</h6>
 *     <p>Tipo Numero/Año</p>
 *     <p>REF-CODE - Descripción</p>
 *   </a>
 */
export function parseListingPage(
  html: string,
  seccion: SeccionBoletin
): BoraDocumentEntry[] {
  const $ = cheerio.load(html);
  const entries: BoraDocumentEntry[] = [];

  // Find all links that point to document details
  $('a[href*="/detalleAviso/"]').each((_, el) => {
    const $a = $(el);
    const href = $a.attr('href') || '';

    // Extract the ID from the URL: /detalleAviso/primera/322375/20250312
    const urlMatch = href.match(/\/detalleAviso\/\w+\/(\d+)\//);
    if (!urlMatch) return;

    const id = urlMatch[1];

    // Get organism from h6
    const organismo = $a.find('h6').first().text().trim();

    // Get paragraphs
    const paragraphs = $a.find('p');
    const tipoLinea = paragraphs.eq(0).text().trim(); // "Decreto 180/2025"
    const refLinea = paragraphs.eq(1).text().trim();   // "DECTO-2025-180-APN-PTE - Description"

    // Parse tipo and numero from first line
    const { tipo, numero } = parseTipoNumero(tipoLinea);

    // Parse referencia and descripcion from second line
    const dashIndex = refLinea.indexOf(' - ');
    const referencia = dashIndex > -1 ? refLinea.substring(0, dashIndex).trim() : refLinea;
    const descripcion = dashIndex > -1 ? refLinea.substring(dashIndex + 3).trim() : '';

    if (organismo || tipoLinea) {
      entries.push({
        id,
        organismo,
        tipoDocumento: tipo,
        numero,
        referencia,
        descripcion,
        urlDetalle: href.startsWith('http') ? href : `${BOLETIN_OFICIAL_BASE_URL}${href}`,
        seccion,
      });
    }
  });

  return entries;
}

/** Parses "Decreto 180/2025" or "Resolución General 5662/2025" into type and number */
function parseTipoNumero(linea: string): { tipo: string; numero: string } {
  const match = linea.match(/^(.+?)\s+(\d+\/\d+)$/);
  if (match) {
    return { tipo: match[1].trim(), numero: match[2] };
  }
  return { tipo: linea, numero: '' };
}

/**
 * Parses the detail page HTML to extract the full document.
 *
 * BORA detail structure:
 *   <h1>ORGANISMO</h1>
 *   <h2>Tipo Numero</h2>
 *   <h6>REF - Descripción</h6>
 *   <div id="detalleAviso">
 *     <p>...text paragraphs...</p>
 *   </div>
 */
export function parseDetailPage(
  html: string,
  entry: BoraDocumentEntry
): BoraDocumentDetail {
  const $ = cheerio.load(html);

  // Build encabezado from h1 + h2
  const h1 = $('h1').first().text().trim();
  const h2 = $('h2').first().text().trim();
  const encabezado = [h1, h2].filter(Boolean).join(' - ') || `${entry.tipoDocumento} ${entry.numero}`;

  // Extract full text from #detalleAviso
  const $detalle = $('#detalleAviso');
  const paragraphs: string[] = [];

  if ($detalle.length) {
    $detalle.find('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text) paragraphs.push(text);
    });
  } else {
    // Fallback: try to get all content paragraphs
    $('p').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 10) paragraphs.push(text);
    });
  }

  const textoCompleto = paragraphs.join('\n\n');

  // Parse articles from the text
  const articulos = parseArticulos(paragraphs);

  return {
    entry,
    textoCompleto,
    encabezado,
    articulos,
  };
}

/** Extracts ARTÍCULO sections from the document paragraphs */
function parseArticulos(
  paragraphs: string[]
): { numero: string; titulo: string; contenido: string }[] {
  const articulos: { numero: string; titulo: string; contenido: string }[] = [];
  const articuloRegex = /^ART[ÍI]CULO\s+(\d+)[°º]?\s*[.-]?\s*/i;

  let currentArticulo: { numero: string; contenido: string[] } | null = null;

  for (const p of paragraphs) {
    const match = p.match(articuloRegex);
    if (match) {
      // Save previous article
      if (currentArticulo) {
        articulos.push({
          numero: currentArticulo.numero,
          titulo: `Artículo ${currentArticulo.numero}`,
          contenido: currentArticulo.contenido.join('\n'),
        });
      }
      // Start new article
      currentArticulo = {
        numero: match[1],
        contenido: [p],
      };
    } else if (currentArticulo) {
      // Continue current article (stop at signature lines)
      if (isSignatureLine(p)) {
        articulos.push({
          numero: currentArticulo.numero,
          titulo: `Artículo ${currentArticulo.numero}`,
          contenido: currentArticulo.contenido.join('\n'),
        });
        currentArticulo = null;
      } else {
        currentArticulo.contenido.push(p);
      }
    }
  }

  // Save last article
  if (currentArticulo) {
    articulos.push({
      numero: currentArticulo.numero,
      titulo: `Artículo ${currentArticulo.numero}`,
      contenido: currentArticulo.contenido.join('\n'),
    });
  }

  return articulos;
}

/** Detects signature lines like "MILEI - Werthein" or "e. 12/03/2025" */
function isSignatureLine(text: string): boolean {
  return /^e\.\s+\d{2}\/\d{2}\/\d{4}/.test(text) || /^N°\s+\d+\/\d+/.test(text);
}

/** Combines entries from multiple HTML pages (initial + AJAX pagination) */
export function parseAllListings(
  htmlPages: string[],
  seccion: SeccionBoletin
): BoraDocumentEntry[] {
  const allEntries: BoraDocumentEntry[] = [];
  const seenIds = new Set<string>();

  for (const html of htmlPages) {
    const entries = parseListingPage(html, seccion);
    for (const entry of entries) {
      if (!seenIds.has(entry.id)) {
        seenIds.add(entry.id);
        allEntries.push(entry);
      }
    }
  }

  return allEntries;
}
