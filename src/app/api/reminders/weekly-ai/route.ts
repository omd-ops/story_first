import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function isAuthorized(req: Request) {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) return true;

  const auth = req.headers.get('authorization') || '';
  if (auth === `Bearer ${expected}`) return true;

  const header = req.headers.get('x-cron-secret') || '';
  return header === expected;
}

async function handleWeeklyAi(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    processed: 0,
    message: 'Weekly AI batch endpoint wired. Pending implementation of challenge submission grading pipeline.',
  });
}

export async function GET(req: Request) {
  return handleWeeklyAi(req);
}

export async function POST(req: Request) {
  return handleWeeklyAi(req);
}
