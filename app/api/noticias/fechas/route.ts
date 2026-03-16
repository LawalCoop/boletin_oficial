import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const noticiasDir = path.join(process.cwd(), 'data', 'noticias');

    try {
      const files = await fs.readdir(noticiasDir);

      // Get all JSON files and extract dates
      const fechas = files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''))
        .sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)

      return NextResponse.json({ fechas });
    } catch {
      // Return empty array if directory doesn't exist
      return NextResponse.json({ fechas: [] });
    }
  } catch (error) {
    console.error('Error listing fechas:', error);
    return NextResponse.json(
      { error: 'Error al obtener fechas disponibles' },
      { status: 500 }
    );
  }
}
