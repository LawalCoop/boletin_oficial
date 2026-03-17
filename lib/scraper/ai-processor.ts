import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { join } from 'path';
import { BoraDocumentDetail, Tema } from '@/lib/types';
import { TEMAS } from '@/lib/constants';

const temasValidos = Object.keys(TEMAS) as [Tema, ...Tema[]];

const articuloAISchema = z.object({
  titulo: z.string().describe(
    'Título periodístico que cuenta una historia. Enfocarse en el IMPACTO, no en el procedimiento. Máximo 80 caracteres.'
  ),
  resumen: z.string().describe(
    'Como una nota periodística completa. 5-7 oraciones que cubran: (1) El gancho - qué pasó y por qué importa, (2) El contexto - antecedentes o situación actual, (3) Los detalles clave - números, plazos, montos, (4) El impacto - cómo afecta a la gente común. Explicar términos técnicos inline usando guiones largos o paréntesis.'
  ),
  contexto: z.string().describe(
    'Explicación pedagógica del tipo de documento y el marco institucional. Enseñar al lector cómo funciona el Estado. Ejemplos: "¿Qué es un Decreto? Es una norma que firma el Presidente..." o "¿Por qué una Resolución y no un Decreto? Porque esta decisión está dentro de las competencias del Ministerio...". 2-3 oraciones educativas.'
  ),
  puntosClaves: z.array(z.object({
    titulo: z.string().describe('Concepto central en 3-5 palabras, evitar jerga'),
    descripcion: z.string().describe('2-3 oraciones autoexplicativas. Primera: qué cambia. Segunda: qué significa. Incluir definiciones inline de términos técnicos.'),
  })).describe('Los 3-4 puntos más importantes, cada uno debe ser comprensible sin leer los otros'),
  aQuienAfecta: z.array(z.object({
    grupo: z.string().describe('Nombre claro y humano del grupo (ej: "familias que pagan la luz", no "usuarios del servicio")'),
    icono: z.string().describe('Nombre de icono Lucide React (ej: building-2, users, briefcase, factory, heart-pulse, truck, shield, wheat, zap, scale, home, plane, wallet, graduation-cap)'),
    descripcion: z.string().describe('2-3 oraciones con el impacto REAL y un ejemplo concreto. ¿Cómo cambia su vida?'),
  })).describe('Grupos de personas/entidades afectadas, entre 2 y 4. Priorizar trabajadores y ciudadanos comunes.'),
  tema: z.string().describe(`Tema principal. Debe ser uno de: ${temasValidos.join(', ')}`),
  tags: z.array(z.string()).describe('Palabras clave relevantes en minúsculas, entre 2 y 6'),
  destacado: z.boolean().describe('true si la norma es de alto impacto público (afecta a mucha gente, montos grandes, cambios significativos)'),
});

export type ArticuloAIResult = z.infer<typeof articuloAISchema>;

/** Loads the methodology document to use as system prompt context */
function loadMetodologia(): string {
  try {
    const metodologiaPath = join(process.cwd(), 'docs', 'METODOLOGIA.md');
    return readFileSync(metodologiaPath, 'utf-8');
  } catch {
    console.warn('[AI] Could not load METODOLOGIA.md, using fallback prompt');
    return '';
  }
}

function buildSystemPrompt(): string {
  const metodologia = loadMetodologia();

  // If we have the methodology doc, use it as context
  if (metodologia) {
    return `Sos un periodista de entreLín[IA]s, un portal comunitario que traduce el Boletín Oficial para la ciudadanía.

Tu trabajo es transformar documentos oficiales en artículos accesibles, siguiendo nuestra metodología editorial.

=== METODOLOGÍA EDITORIAL ===
${metodologia}
=== FIN METODOLOGÍA ===

RECORDÁ SIEMPRE:
- Hablás desde la perspectiva del pueblo, no del poder
- Preguntate "¿a quién beneficia esto?" y "¿cómo afecta al trabajador común?"
- Traducí eufemismos: "optimización de recursos humanos" → "despidos"
- Explicá términos técnicos inline (usando guiones largos o paréntesis)
- Usá español argentino (vos, no tú)
- No inventes información que no esté en el texto original
- Sé periodístico y cercano, nunca burocrático`;
  }

  // Fallback if methodology doc is not available
  return `Sos un periodista de entreLín[IA]s, un portal comunitario que traduce el Boletín Oficial para la ciudadanía.

MIRADA EDITORIAL - Desde el Pueblo, Para el Pueblo:
- Hablás desde las personas afectadas por las normas, no desde quienes las escriben
- Preguntate siempre "¿a quién beneficia esto?" y respondelo honestamente
- Traducí eufemismos oficiales al lenguaje de la gente:
  * "Optimización de recursos humanos" → "Despidos en el Estado"
  * "Desregulación del mercado laboral" → "Se eliminan protecciones para trabajadores"
  * "Actualización tarifaria" → "Aumento del X% en la boleta"
  * "Reestructuración de programas sociales" → "Recorte en [programa]"

INSTRUCCIONES:
- Usá español argentino (vos, no tú)
- Título: Periodístico, cuenta qué pasó. Enfocate en el IMPACTO, no en el procedimiento.
- Resumen: 3-4 oraciones como el primer párrafo de un diario. Gancho + contexto + dato duro.
- Puntos clave: Concretos y autoexplicativos. Incluir definiciones inline de términos técnicos.
- Grupos afectados: Nombres humanos ("familias", "trabajadores"), no burocráticos ("usuarios del servicio").
- Destacado: true solo para normas de alto impacto público.
- No inventes información que no esté en el texto original.
- Explicá siglas y jerga la primera vez que aparecen.`;
}

// Cache the system prompt to avoid reading the file multiple times
let cachedSystemPrompt: string | null = null;

function getSystemPrompt(): string {
  if (!cachedSystemPrompt) {
    cachedSystemPrompt = buildSystemPrompt();
  }
  return cachedSystemPrompt;
}

/** Processes a single document with AI to generate structured content */
export async function processWithAI(doc: BoraDocumentDetail): Promise<ArticuloAIResult> {
  const userPrompt = `Transformá este documento del Boletín Oficial en un artículo para entreLín[IA]s.

ORGANISMO: ${doc.entry.organismo}
TIPO: ${doc.entry.tipoDocumento} ${doc.entry.numero}
REFERENCIA: ${doc.entry.referencia}

TEXTO COMPLETO:
${doc.textoCompleto.substring(0, 8000)}

Recordá: ¿A quién beneficia? ¿Cómo afecta al ciudadano común? Traducí la jerga oficial.`;

  console.log(`[AI] Processing: ${doc.entry.tipoDocumento} ${doc.entry.numero} - ${doc.entry.organismo}`);
  console.log(`[AI] Text length: ${doc.textoCompleto.length} chars`);

  try {
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: articuloAISchema,
      system: getSystemPrompt(),
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
