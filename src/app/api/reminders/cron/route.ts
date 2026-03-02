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
  try {
    console.log('REMINDER_WORKER_URL =', process.env.REMINDER_WORKER_URL);
    const now = new Date();
    const windowMinutes = 1;

    const { data, error } = await supabase
      .from('users')
      .select('id, name, display_name, phone, timezone, sms_trigger_time, sms_trigger_days')
      .eq('status', 'approved')
      .not('phone', 'is', null)
      .not('sms_trigger_time', 'is', null)
      .not('sms_trigger_days', 'is', null);

    if (error) {
      return NextResponse.json(
        { success: false, message: 'Failed to load scheduled users.', providerErrors: [`supabase:${error.message}`] },
        { status: 500 },
      );
    }

    type SchedulableUserWithName = SchedulableUser & { name?: string | null; display_name?: string | null };
    const users = (data || []) as SchedulableUserWithName[];
    const providerErrors: string[] = [];
    const dueUsers: SchedulableUserWithName[] = [];

    for (const user of users) {
      try {
        if (isReminderDueNow(user, now, windowMinutes)) {
          dueUsers.push(user);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        providerErrors.push(`schedule_eval_failed:${user.id}:${message}`);
      }
    }

    const recipients: string[] = [];
    const jobs: ReminderJobPayload[] = [];

    for (const user of dueUsers) {
      try {
        const name = user.display_name || user.name || user.phone;
        recipients.push(name);
        jobs.push({
          userId: user.id,
          phone: user.phone,
          timezone: user.timezone || 'UTC',
          localDate: getLocalDateKey(now, user.timezone || 'UTC'),
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        providerErrors.push(`job_build_failed:${user.id}:${message}`);
      }
    }

    let publish = { published: 0, failed: jobs.length, errors: ['publish_skipped:unknown_error'] };
    try {
      publish = await publishReminderJobs(jobs);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      publish = { published: 0, failed: jobs.length, errors: [`publish_exception:${message}`] };
    }

    const success = publish.failed === 0 && providerErrors.length === 0;
    return NextResponse.json({
      success,
      scannedUsers: users.length,
      dueUsers: dueUsers.length,
      recipients,
      queued: publish.published,
      failed: publish.failed,
      providerErrors: [...providerErrors, ...publish.errors],
    }, { status: success ? 200 : 500 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected cron error';
    return NextResponse.json({ success: false, message, providerErrors: [message] }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return handleCron(req);
}

export async function POST(req: Request) {
  return handleCron(req);
}
