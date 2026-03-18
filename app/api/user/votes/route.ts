import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/user/votes - Get user's votes
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const votes = await prisma.vote.findMany({
      where: { userId: session.user.id },
      select: { articleSlug: true, vote: true },
    });

    return NextResponse.json({ votes });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/user/votes - Create or update a vote
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { articleSlug, vote } = await request.json();

    if (!articleSlug || typeof articleSlug !== 'string') {
      return NextResponse.json({ error: 'Article slug is required' }, { status: 400 });
    }

    if (typeof vote !== 'number' || ![1, 0, -1].includes(vote)) {
      return NextResponse.json({ error: 'Vote must be 1, 0, or -1' }, { status: 400 });
    }

    const userVote = await prisma.vote.upsert({
      where: {
        userId_articleSlug: {
          userId: session.user.id,
          articleSlug,
        },
      },
      update: { vote },
      create: {
        userId: session.user.id,
        articleSlug,
        vote,
      },
    });

    return NextResponse.json({ vote: userVote });
  } catch (error) {
    console.error('Error saving vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
