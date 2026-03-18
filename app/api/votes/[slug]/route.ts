import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/votes/[slug] - Get vote counts for an article (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const articleSlug = decodeURIComponent(slug);

    const votes = await prisma.vote.groupBy({
      by: ['vote'],
      where: { articleSlug },
      _count: true,
    });

    const counts = {
      favor: 0,
      neutro: 0,
      contra: 0,
      total: 0,
    };

    votes.forEach((v) => {
      if (v.vote === 1) counts.favor = v._count;
      else if (v.vote === 0) counts.neutro = v._count;
      else if (v.vote === -1) counts.contra = v._count;
      counts.total += v._count;
    });

    return NextResponse.json(counts);
  } catch (error) {
    console.error('Error fetching vote counts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
