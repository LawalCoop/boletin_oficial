import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { BoraDocumentDetail, Tema } from '@/lib/types';
import { TEMAS } from '@/lib/constants';

const temasValidos = Object.keys(TEMAS) as [Tema, ...Tema[]];

const articuloAISchema = z.object({
  titulo: z.string().describe(
    'Título claro y accesible. Fórmula: [Organismo] + [verbo pasado] + [acción principal]. Máximo 100 caracteres.'
  ),
  resumen: z.string().describe(
    'Resumen de 2-3 oraciones respondiendo: qué se hizo, quién lo hizo, por qué importa.'
  ),
  puntosClaves: z.array(z.object({
    titulo: z.string().describe('Concepto principal en 2-4 palabras'),
    descripcion: z.string().describe('Explicación en 1-2 oraciones'),
  })).describe('Los 3-4 puntos más importantes del documento'),
  aQuienAfecta: z.array(z.object({
    grupo: z.string().describe('Nombre del grupo afectado'),
    icono: z.string().describe('Nombre de icono Lucide React (ej: building-2, users, briefcase, factory, heart-pulse, truck, shield, wheat, zap, scale, home, plane, wallet, graduation-cap)'),
    descripcion: z.string().describe('Cómo les afecta específicamente'),
  })).describe('Grupos de personas/entidades afectadas por esta norma, entre 2 y 4'),
  tema: z.string().describe(`Tema principal. Debe ser uno de: ${temasValidos.join(', ')}`),
  tags: z.array(z.string()).describe('Palabras clave relevantes en minúsculas, entre 2 y 6'),
  destacado: z.boolean().describe('true si la norma es de alto impacto público (afecta a mucha gente, montos grandes, cambios significativos)'),
});

export type ArticuloAIResult = z.infer<typeof articuloAISchema>;

const SYSTEM_PROMPT = `Sos un experto en legislación argentina y periodismo. Tu tarea es transformar documentos del Boletín Oficial en artículos accesibles para ciudadanos comunes.

INSTRUCCIONES:
- Usá español argentino (vos, no tú)
- Título: [Organismo] + [verbo pasado] + [acción]. Verbos: creó, estableció, actualizó, modificó, derogó, autorizó, designó, etc.
- Resumen: 2-3 oraciones claras. Qué se hizo, quién, por qué importa.
- Puntos clave: Lo más concreto posible (números, plazos, montos, obligaciones).
- Grupos afectados: Identificá quiénes se ven impactados y cómo.
- Tema: Clasificá según el área temática principal.
- Destacado: true solo para normas de alto impacto público.
- No inventes información que no esté en el texto original.
- Evitá jerga legal innecesaria.`;

/** Processes a single document with AI to generate structured content */
export async function processWithAI(doc: BoraDocumentDetail): Promise<ArticuloAIResult> {
  const userPrompt = `Transformá este documento del Boletín Oficial en un artículo accesible:

ORGANISMO: ${doc.entry.organismo}
TIPO: ${doc.entry.tipoDocumento} ${doc.entry.numero}
REFERENCIA: ${doc.entry.referencia}

TEXTO COMPLETO:
${doc.textoCompleto.substring(0, 8000)}`;

  console.log(`[AI] Processing: ${doc.entry.tipoDocumento} ${doc.entry.numero} - ${doc.entry.organismo}`);
  console.log(`[AI] Text length: ${doc.textoCompleto.length} chars`);

  try {
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: articuloAISchema,
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
    });

    console.log(`[AI] Success: "${object.titulo}" | tema: ${object.tema} | tags: ${object.tags.join(', ')}`);

    // Validate tema is one of our known values, fallback to 'otros'
    const temaValid = temasValidos.includes(object.tema as Tema);
    if (!temaValid) {
      console.log(`[AI] Invalid tema "${object.tema}", falling back to "otros"`);
    }

    return {
      ...object,
      tema: temaValid ? (object.tema as Tema) : 'otros',
    } as ArticuloAIResult;
  } catch (error) {
    console.error(`[AI] Failed for: ${doc.entry.tipoDocumento} ${doc.entry.numero}`);
    console.error(`[AI] Error:`, error);
    if (error instanceof Error) {
      console.error(`[AI] Message: ${error.message}`);
      console.error(`[AI] Cause:`, (error as unknown as Record<string, unknown>).cause);
    }
    throw error;
  }
}

/** Processes documents in batches to avoid rate limits */
export async function processInBatches(
  docs: BoraDocumentDetail[],
  batchSize: number = 5,
  onProgress?: (current: number, total: number, doc: string) => void
): Promise<Map<string, ArticuloAIResult>> {
  const results = new Map<string, ArticuloAIResult>();

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    const promises = batch.map(async (doc, batchIndex) => {
      const index = i + batchIndex;
      const docName = `${doc.entry.tipoDocumento} ${doc.entry.numero} - ${doc.entry.organismo}`;
      onProgress?.(index + 1, docs.length, docName);

      try {
        const result = await processWithAI(doc);
        results.set(doc.entry.id, result);
      } catch (error) {
        console.error(`AI processing failed for ${doc.entry.id}:`, error);
        throw error;
      }
    });

    await Promise.all(promises);
  }

  return results;
}
