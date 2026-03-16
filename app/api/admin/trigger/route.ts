import { NextRequest, NextResponse } from 'next/server';
import { TriggerRequest, TriggerResponse } from '@/lib/types';

// This is a skeleton endpoint for the workers team
// In production, this would queue a job to process the Boletín Oficial

export async function POST(request: NextRequest) {
  try {
    const body: TriggerRequest = await request.json();

    if (!body.fecha) {
      return NextResponse.json(
        { error: 'La fecha es requerida' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(body.fecha)) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Mock response - in production this would queue a real job
    const response: TriggerResponse = {
      jobId: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'queued',
    };

    console.log(`[Admin] Job queued: ${response.jobId} for fecha ${body.fecha}${body.seccion ? `, seccion ${body.seccion}` : ''}`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error triggering job:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return mock job statuses
  return NextResponse.json({
    jobs: [
      {
        jobId: 'job-mock-001',
        status: 'completed',
        fecha: '2026-03-11',
        startedAt: '2026-03-11T08:00:00Z',
        completedAt: '2026-03-11T08:05:23Z',
      },
      {
        jobId: 'job-mock-002',
        status: 'running',
        fecha: '2026-03-10',
        startedAt: '2026-03-11T07:55:00Z',
      },
    ],
  });
}
