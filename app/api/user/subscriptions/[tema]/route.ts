import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/user/subscriptions/[tema] - Unsubscribe from a tema
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tema: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tema } = await params;

    await prisma.subscription.deleteMany({
      where: {
        userId: session.user.id,
        tema,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
