import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { NoticiaPreview } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase().trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const noticiasDir = path.join(process.cwd(), 'data', 'noticias');
    const files = await fs.readdir(noticiasDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const allResults: NoticiaPreview[] = [];

    for (const file of jsonFiles) {
      try {
        const content = await fs.readFile(path.join(noticiasDir, file), 'utf-8');
        const data = JSON.parse(content);

        if (data.noticias && Array.isArray(data.noticias)) {
          const matches = data.noticias.filter((n: NoticiaPreview) => {
            const titulo = n.titulo?.toLowerCase() || '';
            const extracto = n.extracto?.toLowerCase() || '';
            return titulo.includes(query) || extracto.includes(query);
          });
          allResults.push(...matches);
        }
      } catch {
        // Skip invalid files
      }
    }

    // Remove duplicates by slug and sort by date
    const uniqueResults = allResults.reduce((acc, curr) => {
      if (!acc.find(r => r.slug === curr.slug)) {
        acc.push(curr);
      }
      return acc;
    }, [] as NoticiaPreview[]);

    uniqueResults.sort((a, b) =>
      new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime()
    );

    return NextResponse.json({
      results: uniqueResults.slice(0, 50),
      total: uniqueResults.length
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Error en la búsqueda' }, { status: 500 });
  }
}
