import { NextResponse } from 'next/server';
import { cleanupReminderDispatchState } from '@/lib/reminderDispatchStore';

export const runtime = 'nodejs';

function isAuthorized(req: Request) {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) return true;

  const auth = req.headers.get('authorization') || '';
  if (auth === `Bearer ${expected}`) return true;

  const header = req.headers.get('x-cron-secret') || '';
  return header === expected;
}

async function handleCleanup(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const result = await cleanupReminderDispatchState(3);
  return NextResponse.json({ success: true, ...result });
}

export async function GET(req: Request) {
  return handleCleanup(req);
}

export async function POST(req: Request) {
  return handleCleanup(req);
}
