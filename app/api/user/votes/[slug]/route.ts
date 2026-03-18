import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/user/votes/[slug] - Remove a vote
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const articleSlug = decodeURIComponent(slug);

    await prisma.vote.delete({
      where: {
        userId_articleSlug: {
          userId: session.user.id,
          articleSlug,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
