import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { NoticiasDia, Categoria } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    // Get today's date in local timezone (not UTC)
    const now = new Date();
    const todayLocal = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const fecha = searchParams.get('fecha') || todayLocal;
    const categoriaParam = searchParams.get('categoria');

    const filePath = path.join(process.cwd(), 'data', 'noticias', `${fecha}.json`);

    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data: NoticiasDia = JSON.parse(fileContent);

      // Filter by category if specified (ignore 'todos')
      if (categoriaParam && categoriaParam !== 'todos') {
        const categoria = categoriaParam as Categoria;
        data.noticias = data.noticias.filter(n => n.categoria === categoria);
      }

      return NextResponse.json(data);
    } catch {
      // Return empty data if file doesn't exist
      return NextResponse.json({
        fecha,
        generadoEn: new Date().toISOString(),
        noticias: [],
      });
    }
  } catch (error) {
    console.error('Error fetching noticias:', error);
    return NextResponse.json(
      { error: 'Error al obtener noticias' },
      { status: 500 }
    );
  }
}
