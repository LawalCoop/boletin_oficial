import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/user/saved/[slug] - Remove saved article
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

    await prisma.savedArticle.deleteMany({
      where: {
        userId: session.user.id,
        articleSlug: slug,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing saved article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
