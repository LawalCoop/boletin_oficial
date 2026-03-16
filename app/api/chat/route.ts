import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const { messages, articuloContext } = await req.json();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `Sos un asistente experto en legislación argentina. Tu rol es explicar de forma clara y accesible el contenido del Boletín Oficial.

CONTEXTO DEL ARTÍCULO:
${articuloContext}

INSTRUCCIONES:
- Respondé en español argentino (usá "vos" en lugar de "tú")
- Sé conciso y directo
- Explicá términos legales de forma simple
- Si te preguntan algo que no está en el contexto, indicalo claramente
- Siempre recordá que el usuario puede verificar la información en el documento original del Boletín Oficial
- No inventes información que no esté en el contexto proporcionado
- Si la pregunta está fuera del alcance del artículo, sugerí que consulte el documento original`,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: 'Error en el chat' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
