import {
  SeccionBoletin,
  BoraDocumentEntry,
  BoraDocumentDetail,
  PipelineEvent,
} from '@/lib/types';
import { fetchAllListings, fetchDocumentDetailWithDelay } from './bora-client';
import { parseAllListings, parseDetailPage } from './bora-parser';
import { processWithAI, ArticuloAIResult } from './ai-processor';
import { saveAll } from './json-writer';

export type PipelineCallback = (event: PipelineEvent) => void;

/** Runs the full scraping + AI + save pipeline for a given date and section */
export async function runPipeline(
  fecha: string,
  seccion: SeccionBoletin,
  onEvent: PipelineCallback
): Promise<void> {
  // Step 1: Fetch & parse listing
  console.log(`[Pipeline] Starting for fecha=${fecha}, seccion=${seccion}`);
  const htmlPages = await fetchAllListings(seccion, fecha);
  console.log(`[Pipeline] Fetched ${htmlPages.length} HTML pages`);
  const entries: BoraDocumentEntry[] = parseAllListings(htmlPages, seccion);
  console.log(`[Pipeline] Found ${entries.length} document entries`);

  if (entries.length === 0) {
    console.log('[Pipeline] No entries found, finishing');
    onEvent({ type: 'complete', total: 0, success: 0, failed: 0 });
    return;
  }

  // Demo limit: only process 5 docs to stay within Gemini free tier (15 req/min, 1500 req/day).
  // With sequential processing, natural API latency provides enough spacing between requests.
  const maxEntries = 5;
  if (entries.length > maxEntries) {
    console.log(`[Pipeline] Limiting from ${entries.length} to ${maxEntries} entries (demo mode)`);
    entries.splice(maxEntries);
  }

  entries.forEach((e, i) => console.log(`[Pipeline] Entry ${i + 1}: ${e.tipoDocumento} ${e.numero} - ${e.organismo} (id: ${e.id})`));
  onEvent({ type: 'start', total: entries.length });

  // Step 2: Scrape each document detail (sequential with delay)
  const docs: BoraDocumentDetail[] = [];
  const failedScraping: string[] = [];

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const docName = `${entry.tipoDocumento} ${entry.numero} - ${entry.organismo}`;
    onEvent({ type: 'scraping', current: i + 1, total: entries.length, doc: docName });

    try {
      console.log(`[Pipeline] Scraping detail: ${entry.urlDetalle}`);
      const html = await fetchDocumentDetailWithDelay(entry.urlDetalle);
      console.log(`[Pipeline] Detail HTML length: ${html.length} chars`);
      const detail = parseDetailPage(html, entry);
      console.log(`[Pipeline] Parsed: encabezado="${detail.encabezado}", text=${detail.textoCompleto.length} chars, articulos=${detail.articulos.length}`);

      // Skip documents with no meaningful text
      if (detail.textoCompleto.trim().length < 50) {
        console.log(`[Pipeline] Skipping ${entry.id}: text too short (${detail.textoCompleto.trim().length} chars)`);
        onEvent({ type: 'error', doc: docName, error: 'Documento sin texto suficiente' });
        failedScraping.push(entry.id);
        continue;
      }

      docs.push(detail);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      onEvent({ type: 'error', doc: docName, error: `Scraping falló: ${msg}` });
      failedScraping.push(entry.id);
    }
  }

  // Step 3: Process with AI sequentially — one at a time is enough for free tier rate limits.
  // With 5 docs max, natural API latency (~2-4s each) keeps us well under 15 req/min.
  const aiResults = new Map<string, ArticuloAIResult>();
  const failedAI: string[] = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const docName = `${doc.entry.tipoDocumento} ${doc.entry.numero} - ${doc.entry.organismo}`;
    onEvent({ type: 'processing', current: i + 1, total: docs.length, doc: docName });

    try {
      const result = await processWithAI(doc);
      aiResults.set(doc.entry.id, result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      onEvent({ type: 'error', doc: docName, error: `IA falló: ${msg}` });
      failedAI.push(doc.entry.id);
    }

  }

  // Step 4: Save to disk
  console.log(`[Pipeline] AI done. Success: ${aiResults.size}, Failed: ${failedAI.length}`);
  const successDocs = docs.filter((d) => aiResults.has(d.entry.id));
  console.log(`[Pipeline] Saving ${successDocs.length} articles to disk...`);
  const slugs = await saveAll(successDocs, aiResults, fecha);
  console.log(`[Pipeline] Saved ${slugs.length} articles: ${slugs.join(', ')}`);

  for (const slug of slugs) {
    onEvent({ type: 'saved', slug });
  }

  // Step 5: Report completion
  const totalFailed = failedScraping.length + failedAI.length;
  onEvent({
    type: 'complete',
    total: entries.length,
    success: slugs.length,
    failed: totalFailed,
  });
}
