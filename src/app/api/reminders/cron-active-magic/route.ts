import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { createMagicLink } from '@/lib/magicLink';
import { shortenWithShortIo } from '@/lib/shortLink';
import { sendTwilioSMS } from '@/lib/twilio';

export const runtime = 'nodejs';

function isAuthorized(req: Request) {
  const expected = process.env.CRON_SECRET?.trim();
  if (!expected) return true;

  const auth = req.headers.get('authorization') || '';
  if (auth === `Bearer ${expected}`) return true;

  const header = req.headers.get('x-cron-secret') || '';
  return header === expected;
}

async function handleCron(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('users')
    .select('id, phone, status')
    .eq('status', 'approved')
    .not('phone', 'is', null);

  if (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to load approved users.', providerErrors: [`supabase:${error.message}`] },
      { status: 500 },
    );
  }

  const users = (data || []) as Array<{ id: string; phone: string; status: string }>;
  const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';

  let sent = 0;
  let failed = 0;
  const results: Array<{ userId: string; phone: string; status: 'sent' | 'failed'; providerErrors: string[] }> = [];

  for (const user of users) {
    const magicLink = createMagicLink(user.phone, appBaseUrl);
    const shortResult = await shortenWithShortIo(magicLink);
    const finalLink = shortResult.shortUrl || magicLink;

    const smsBody = `StoryFirst update: your lesson is ready.\n${finalLink}`;
    const twilio = await sendTwilioSMS(user.phone, smsBody);

    if (twilio.success) {
      sent += 1;
      results.push({ userId: user.id, phone: user.phone, status: 'sent', providerErrors: shortResult.providerErrors });
    } else {
      failed += 1;
      results.push({
        userId: user.id,
        phone: user.phone,
        status: 'failed',
        providerErrors: [...shortResult.providerErrors, ...twilio.providerErrors],
      });
    }
  }

  return NextResponse.json({
    success: failed === 0,
    scannedUsers: users.length,
    sent,
    failed,
    results,
  });
}

export async function GET(req: Request) {
  return handleCron(req);
}

export async function POST(req: Request) {
  return handleCron(req);
}
