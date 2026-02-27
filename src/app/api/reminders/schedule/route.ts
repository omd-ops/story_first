import { NextResponse } from 'next/server';
import { sendTwilioSMS } from '@/lib/twilio';
import { supabase } from '@/lib/supabase';
import { normalizeScheduleDays, normalizeScheduleTimeTo24h } from '@/lib/reminderSchedule';
import { readReminders, writeReminders, ReminderRecord } from '@/lib/reminderStore';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, scheduleDays, scheduleTime, timezone } = body;

    if (!phone || !Array.isArray(scheduleDays) || scheduleDays.length === 0) {
      return NextResponse.json({ success: false, message: 'Please provide a phone number and days.' }, { status: 400 });
    }

    const normalizedDays = normalizeScheduleDays(scheduleDays);
    if (normalizedDays.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide valid reminder days.' },
        { status: 400 },
      );
    }

    const normalizedTime = normalizeScheduleTimeTo24h(scheduleTime);

    const twilioMessage = `StoryFirst reminder scheduled for ${scheduleDays.join(', ')} at ${String(
      scheduleTime.hour,
    )}:${String(scheduleTime.minute).padStart(2, '0')} ${scheduleTime.period} (${timezone}). We'll nudge you with reflection prompts.`;

    // Optional confirmation SMS.
    const twilioResult = await sendTwilioSMS(phone, twilioMessage);
    let reminderSaved = false;
    const providerErrors = [...twilioResult.providerErrors];

    // ADR-011 path: save schedule in database (users table), queue dispatches via cron + workers.
    const { error: upsertError } = await supabase.from('users').upsert(
      {
        phone,
        name: 'StoryFirst User',
        timezone,
        sms_trigger_time: normalizedTime,
        sms_trigger_days: normalizedDays,
      },
      { onConflict: 'phone' },
    );

    if (upsertError) {
      providerErrors.push(`supabase:upsert_failed:${upsertError.message}`);

      // Current-state fallback to preserve reminder capture if DB config/schema is not ready yet.
      const existing = await readReminders();
      const record: ReminderRecord = {
        phone,
        scheduleDays,
        scheduleTime,
        timezone,
        createdAt: new Date().toISOString(),
        lastSentAt: null,
        twilioInfo: twilioResult.info,
      };
      const updated = [record, ...existing].slice(0, 50);
      await writeReminders(updated);
      reminderSaved = true;
    } else {
      reminderSaved = true;
    }

    return NextResponse.json({
      success: reminderSaved,
      message: twilioResult.success
        ? twilioResult.message ?? 'Reminder scheduled and SMS sent.'
        : 'Reminder scheduled, but Twilio could not send the SMS.',
      reminderSaved,
      twilioSuccess: twilioResult.success,
      twilioInfo: twilioResult.info,
      providerErrors,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to schedule reminder';
    return NextResponse.json({ success: false, message, providerErrors: [message] }, { status: 500 });
  }
}
