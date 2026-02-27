import { NextResponse } from 'next/server';
import { sendTwilioSMS } from '@/lib/twilio';
import { readReminders, writeReminders, ReminderRecord } from '@/lib/reminderStore';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, scheduleDays, scheduleTime, timezone } = body;

    if (!phone || !Array.isArray(scheduleDays) || scheduleDays.length === 0) {
      return NextResponse.json({ success: false, message: 'Please provide a phone number and days.' }, { status: 400 });
    }

    const twilioMessage = `StoryFirst reminder scheduled for ${scheduleDays.join(', ')} at ${String(
      scheduleTime.hour,
    )}:${String(scheduleTime.minute).padStart(2, '0')} ${scheduleTime.period} (${timezone}). We'll nudge you with reflection prompts.`;

    // Optionally send a confirmation SMS; sendTwilioSMS will run in mock mode if env not configured.
    const twilioResult = await sendTwilioSMS(phone, twilioMessage);
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

    return NextResponse.json({
      success: true,
      message: twilioResult.success
        ? twilioResult.message ?? 'Reminder scheduled and SMS sent.'
        : 'Reminder scheduled, but Twilio could not send the SMS.',
      reminderSaved: true,
      twilioSuccess: twilioResult.success,
      twilioInfo: twilioResult.info,
      providerErrors: twilioResult.providerErrors,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to schedule reminder';
    return NextResponse.json({ success: false, message, providerErrors: [message] }, { status: 500 });
  }
}
