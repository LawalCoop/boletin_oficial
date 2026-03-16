import { NextRequest } from 'next/server';
import { SeccionBoletin, PipelineEvent } from '@/lib/types';
import { runPipeline } from '@/lib/scraper/pipeline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.fecha) {
      return new Response(JSON.stringify({ error: 'La fecha es requerida' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.fecha)) {
      return new Response(JSON.stringify({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fecha: string = body.fecha;
    const secciones: SeccionBoletin[] = body.seccion
      ? [body.seccion]
      : ['primera'];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: PipelineEvent) => {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        };

        try {
          for (const seccion of secciones) {
            await runPipeline(fecha, seccion, sendEvent);
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Error desconocido';
          sendEvent({ type: 'error', doc: 'pipeline', error: msg });
          sendEvent({ type: 'complete', total: 0, success: 0, failed: 1 });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error triggering pipeline:', error);
    return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
