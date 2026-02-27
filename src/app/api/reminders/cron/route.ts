import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getLocalDateKey, isReminderDueNow, SchedulableUser } from '@/lib/reminderSchedule';
import { publishReminderJobs, ReminderJobPayload } from '@/lib/qstash';

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

  const now = new Date();
  const windowMinutes = 5;

  const { data, error } = await supabase
    .from('users')
    .select('id, phone, timezone, sms_trigger_time, sms_trigger_days')
    .not('phone', 'is', null)
    .not('sms_trigger_time', 'is', null);

  if (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to load scheduled users.', providerErrors: [`supabase:${error.message}`] },
      { status: 500 },
    );
  }

  const users = (data || []) as SchedulableUser[];
  const dueUsers = users.filter((user) => isReminderDueNow(user, now, windowMinutes));

  const jobs: ReminderJobPayload[] = dueUsers.map((user) => ({
    userId: user.id,
    phone: user.phone,
    timezone: user.timezone || 'UTC',
    localDate: getLocalDateKey(now, user.timezone || 'UTC'),
  }));

  const publish = await publishReminderJobs(jobs);

  return NextResponse.json({
    success: publish.failed === 0,
    scannedUsers: users.length,
    dueUsers: dueUsers.length,
    queued: publish.published,
    failed: publish.failed,
    providerErrors: publish.errors,
  });
}

export async function GET(req: Request) {
  return handleCron(req);
}

export async function POST(req: Request) {
  return handleCron(req);
}
