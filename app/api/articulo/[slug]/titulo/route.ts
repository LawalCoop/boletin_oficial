import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const articleSlug = decodeURIComponent(slug);

    const fs = await import('fs/promises');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'articulos', `${articleSlug}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    const articulo = JSON.parse(content);

    return NextResponse.json({ titulo: articulo.contenidoIA.titulo });
  } catch {
    return NextResponse.json({ titulo: null }, { status: 404 });
  }
}
