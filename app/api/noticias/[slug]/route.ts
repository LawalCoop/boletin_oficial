import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Articulo } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Try to find the article by slug in the articulos directory
    const articulosDir = path.join(process.cwd(), 'data', 'articulos');

    try {
      const files = await fs.readdir(articulosDir);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(articulosDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const articulo: Articulo = JSON.parse(content);

          if (articulo.slug === slug || articulo.id === slug) {
            return NextResponse.json(articulo);
          }
        }
      }

      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    } catch {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching articulo:', error);
    return NextResponse.json(
      { error: 'Error al obtener artículo' },
      { status: 500 }
    );
  }
}
