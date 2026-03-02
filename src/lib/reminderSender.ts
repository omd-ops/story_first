import { getSupabaseAdmin } from './supabaseAdmin';
import { isReminderDueNow, SchedulableUser } from './reminderSchedule';
import { sendTwilioSMS } from './twilio';

export async function sendDueReminders(now = new Date()) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('users')
    .select('id, phone, timezone, sms_trigger_time, sms_trigger_days, status')
    .eq('status', 'approved')
    .not('phone', 'is', null)
    .not('sms_trigger_time', 'is', null);

  if (error) {
    throw new Error(`Failed to load users: ${error.message}`);
  }

  const users = (data || []) as SchedulableUser[];
  let attempted = 0;
  let sent = 0;
  let failed = 0;

  for (const user of users) {
    try {
      if (!isReminderDueNow(user, now, 5)) continue;

      const message = `StoryFirst reminder — time for your daily reflection.`;
      const result = await sendTwilioSMS(user.phone, message);
      attempted += 1;

      if (result.success) {
        sent += 1;
      } else {
        failed += 1;
      }
    } catch (e) {
      // continue on error per-record
      console.error('reminder send error', e);
    }
  }

  return { attempted, sent, failed, sentAny: sent > 0 };
}

export default sendDueReminders;
