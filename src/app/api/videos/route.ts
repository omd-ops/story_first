import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dayParam = searchParams.get('day');

  if (!dayParam) {
    return NextResponse.json({ error: 'day query parameter required' }, { status: 400 });
  }

  const day = parseInt(dayParam, 10);
  if (Number.isNaN(day)) {
    return NextResponse.json({ error: 'invalid day' }, { status: 400 });
  }

  const videos = await prisma.adminVideo.findMany({
    where: { day },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      playbackUrl: true,
      muxAssetId: true,
      createdAt: true,
    },
  });

  return NextResponse.json(videos);
}
