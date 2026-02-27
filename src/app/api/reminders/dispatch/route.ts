import { NextResponse } from 'next/server';
import { readReminders, writeReminders, ReminderRecord } from '@/lib/reminderStore';
import { sendTwilioSMS } from '@/lib/twilio';

export const runtime = 'nodejs';

export async function POST() {
  const now = new Date();
  try {
    const reminders = await readReminders();
    const processed: Array<{ phone: string; status: string; providerErrors: string[] }> = [];

    for (const reminder of reminders) {
      if (shouldSend(reminder, now)) {
        const body = `StoryFirst reflection for today at ${reminder.scheduleTime.hour}:${reminder.scheduleTime.minute
          .toString()
          .padStart(2, '0')} ${reminder.scheduleTime.period} (${reminder.timezone}). Reply STOP to unsubscribe.`;

        const result = await sendTwilioSMS(reminder.phone, body);
        processed.push({
          phone: reminder.phone,
          status: result.success ? 'sent' : 'failed',
          providerErrors: result.providerErrors,
        });

        if (result.success) {
          reminder.lastSentAt = now.toISOString();
          reminder.twilioInfo = result.info;
        }
      }
    }

    await writeReminders(reminders);
    return NextResponse.json({ success: true, processed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Dispatch error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

function shouldSend(reminder: ReminderRecord, now: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: reminder.timezone,
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const parts = formatter.formatToParts(now);
  const day = parts.find((p) => p.type === 'weekday')?.value ?? '';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  const period = (parts.find((p) => p.type === 'dayPeriod')?.value ?? 'AM').toUpperCase();

  if (!reminder.scheduleDays.includes(day)) {
    return false;
  }

  if (
    reminder.scheduleTime.hour !== hour ||
    reminder.scheduleTime.minute !== minute ||
    reminder.scheduleTime.period !== period
  ) {
    return false;
  }

  if (reminder.lastSentAt) {
    const last = new Date(reminder.lastSentAt);
    const lastDay = new Intl.DateTimeFormat('en-US', {
      timeZone: reminder.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(last);
    const currentDay = new Intl.DateTimeFormat('en-US', {
      timeZone: reminder.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now);
    if (lastDay === currentDay) {
      return false;
    }
  }

  return true;
}
