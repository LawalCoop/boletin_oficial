import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/user/saved - Get user's saved articles
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savedArticles = await prisma.savedArticle.findMany({
      where: { userId: session.user.id },
      select: { articleSlug: true, articleTema: true, savedAt: true },
      orderBy: { savedAt: 'desc' },
    });

    return NextResponse.json({ savedArticles });
  } catch (error) {
    console.error('Error fetching saved articles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/saved - Save an article
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { articleSlug, articleTema } = await request.json();

    if (!articleSlug || typeof articleSlug !== 'string') {
      return NextResponse.json({ error: 'Article slug is required' }, { status: 400 });
    }

    const savedArticle = await prisma.savedArticle.upsert({
      where: {
        userId_articleSlug: {
          userId: session.user.id,
          articleSlug,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        articleSlug,
        articleTema: articleTema || null,
      },
    });

    return NextResponse.json({ savedArticle });
  } catch (error) {
    console.error('Error saving article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
