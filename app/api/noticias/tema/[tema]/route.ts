import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { NoticiaPreview, Tema } from '@/lib/types';
import { TEMAS } from '@/lib/constants';

interface BoletinData {
  fecha: string;
  edicionBoletin: string;
  noticias: NoticiaPreview[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tema: string }> }
) {
  try {
    const { tema } = await params;

    // Validate tema
    if (!TEMAS[tema as Tema]) {
      return NextResponse.json({ error: 'Tema no válido' }, { status: 400 });
    }

    const noticiasDir = path.join(process.cwd(), 'data', 'noticias');
    const files = await fs.readdir(noticiasDir);

    const allNoticias: (NoticiaPreview & { fechaBoletin: string })[] = [];

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const filePath = path.join(noticiasDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const data: BoletinData = JSON.parse(content);

      // Filter news by tema
      const noticiasDelTema = data.noticias
        .filter(n => n.tema === tema)
        .map(n => ({ ...n, fechaBoletin: data.fecha }));

      allNoticias.push(...noticiasDelTema);
    }

    // Sort by date, newest first
    allNoticias.sort((a, b) =>
      new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
    );

    return NextResponse.json({
      tema,
      temaInfo: TEMAS[tema as Tema],
      noticias: allNoticias,
      total: allNoticias.length
    });
  } catch (error) {
    console.error('Error fetching noticias by tema:', error);
    return NextResponse.json(
      { error: 'Error al cargar noticias' },
      { status: 500 }
    );
  }
}
