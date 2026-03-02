import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { isReminderDueNow, SchedulableUser } from '@/lib/reminderSchedule';
import { sendTwilioSMS } from '@/lib/twilio';

export const runtime = 'nodejs';

export async function POST() {
  const now = new Date();
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('users')
      .select('id, phone, timezone, sms_trigger_time, sms_trigger_days, status')
      .eq('status', 'approved')
      .not('phone', 'is', null)
      .not('sms_trigger_time', 'is', null);

    if (error) {
      return NextResponse.json(
        { success: false, message: `Failed to load users: ${error.message}` },
        { status: 500 },
      );
    }

    const users = (data || []) as SchedulableUser[];
    const processed: Array<{ phone: string; status: string; providerErrors: string[] }> = [];

    for (const user of users) {
      if (isReminderDueNow(user, now, 5)) {
        const body = `StoryFirst reflection reminder. Your lesson is ready.`;

        const result = await sendTwilioSMS(user.phone, body);
        processed.push({
          phone: user.phone,
          status: result.success ? 'sent' : 'failed',
          providerErrors: result.providerErrors,
        });
      }
    }

    return NextResponse.json({ success: true, processed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Dispatch error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
