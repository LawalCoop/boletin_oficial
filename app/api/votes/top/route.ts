import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/votes/top - Get top voted articles (public)
export async function GET() {
  try {
    // Get all votes grouped by article
    const votesByArticle = await prisma.vote.groupBy({
      by: ['articleSlug'],
      _sum: { vote: true },
      _count: true,
    });

    // Sort by sum of votes (positive = a favor, negative = en contra)
    const sorted = votesByArticle
      .map((v) => ({
        slug: v.articleSlug,
        score: v._sum.vote || 0,
        totalVotes: v._count,
      }))
      .filter((v) => v.totalVotes >= 1); // At least 1 vote

    const topFavor = sorted
      .filter((v) => v.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const topContra = sorted
      .filter((v) => v.score < 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);

    return NextResponse.json({ topFavor, topContra });
  } catch (error) {
    console.error('Error fetching top votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
