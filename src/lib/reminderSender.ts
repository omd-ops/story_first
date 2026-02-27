import { readReminders, writeReminders, ReminderRecord } from './reminderStore';
import { sendTwilioSMS } from './twilio';

function getLocalParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    weekday: 'long',
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type && p.value) map[p.type] = p.value;
  }

  const hour = Number(map.hour ?? 0);
  const minute = Number(map.minute ?? 0);
  const period = (map.dayPeriod ?? map.dayperiod ?? '').toUpperCase();
  const weekday = map.weekday ?? '';

  return { hour, minute, period, weekday };
}

function dateStringInTZ(date: Date, tz: string) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(date); // YYYY-MM-DD like
}

export async function sendDueReminders(now = new Date()) {
  const reminders = await readReminders();
  let changed = false;
  let attempted = 0;
  let sent = 0;
  let failed = 0;

  for (const r of reminders) {
    try {
      const { hour, minute, period, weekday } = getLocalParts(now, r.timezone || 'UTC');

      // Support scheduleDays containing long weekday, short weekday, or numeric 0-6
      const dayMatches = r.scheduleDays.some((d) => {
        const dd = String(d).toLowerCase();
        if (dd === weekday.toLowerCase()) return true;
        if (dd === weekday.slice(0, 3).toLowerCase()) return true;
        if (!Number.isNaN(Number(dd)) && Number(dd) === new Date(now).getDay()) return true;
        return false;
      });

      if (!dayMatches) continue;

      // match hour/minute/period
      const scheduled = r.scheduleTime;
      const schHour = Number(scheduled.hour);
      const schMin = Number(scheduled.minute);
      const schPeriod = String(scheduled.period || '').toUpperCase();

      if (schHour !== hour || schMin !== minute || schPeriod !== period) continue;

      // avoid sending more than once per day: compare date in tz
      const lastSentDate = r.lastSentAt ? dateStringInTZ(new Date(r.lastSentAt), r.timezone) : null;
      const today = dateStringInTZ(now, r.timezone);
      if (lastSentDate === today) continue;

      const message = `StoryFirst reminder — time for your daily reflection.`;
      const result = await sendTwilioSMS(r.phone, message);
      attempted += 1;

      if (result.success) {
        r.lastSentAt = new Date().toISOString();
        sent += 1;
      } else {
        failed += 1;
      }
      r.twilioInfo = result.info ?? r.twilioInfo;
      changed = true;
    } catch (e) {
      // continue on error per-record
      console.error('reminder send error', e);
    }
  }

  if (changed) {
    await writeReminders(reminders);
  }

  return { attempted, sent, failed, sentAny: sent > 0 };
}

export default sendDueReminders;
