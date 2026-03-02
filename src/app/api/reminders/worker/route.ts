import { NextResponse } from 'next/server';
import { createMagicLink } from '@/lib/magicLink';
import { markReminderSent, hasReminderBeenSent } from '@/lib/reminderDispatchStore';
import { shortenWithShortIo } from '@/lib/shortLink';
import { sendTwilioSMS } from '@/lib/twilio';

export const runtime = 'nodejs';

type WorkerPayload = {
  userId: string;
  phone: string;
  timezone: string;
  localDate: string;
};

function isAuthorized(req: Request) {
  const expected = process.env.REMINDER_WORKER_SECRET?.trim() || process.env.CRON_SECRET?.trim();
  if (!expected) return true;

  const provided = req.headers.get('x-reminder-worker-secret') || '';
  return provided === expected;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    console.error('[worker] unauthorized', { hasSecret: Boolean(process.env.REMINDER_WORKER_SECRET || process.env.CRON_SECRET) });
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as WorkerPayload | null;
  if (!body?.phone || !body.localDate) {
    console.error('[worker] invalid_payload', { body });
    return NextResponse.json({ success: false, message: 'Invalid worker payload.' }, { status: 400 });
  }

  console.log('[worker] received', {
    userId: body.userId,
    phone: body.phone,
    timezone: body.timezone,
    localDate: body.localDate,
  });

  const alreadySent = await hasReminderBeenSent(body.phone, body.localDate);
  if (alreadySent) {
    console.log('[worker] skipped_already_sent', { userId: body.userId, phone: body.phone, localDate: body.localDate });
    return NextResponse.json({ success: true, skipped: true, message: 'Reminder already sent for this local day.' });
  }

  const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
  const magicLink = createMagicLink(body.phone, appBaseUrl);
  const shortResult = await shortenWithShortIo(magicLink);
  const finalLink = shortResult.shortUrl || magicLink;
  const simulateTwilio = process.env.SIMULATE_TWILIO === '1';

  if (simulateTwilio) {
    console.log('[worker] simulate_twilio', {
      userId: body.userId,
      phone: body.phone,
      magicLink: finalLink,
      localDate: body.localDate,
    });
    await markReminderSent(body.phone, body.localDate);
    return NextResponse.json({
      success: true,
      simulated: true,
      userId: body.userId,
      providerErrors: shortResult.providerErrors,
    });
  }

  const smsMessage = `StoryFirst reminder: your daily lesson is ready.\n${finalLink}`;
  const twilio = await sendTwilioSMS(body.phone, smsMessage);

  if (!twilio.success) {
    console.error('[worker] twilio_failed', {
      userId: body.userId,
      phone: body.phone,
      localDate: body.localDate,
      providerErrors: [...shortResult.providerErrors, ...twilio.providerErrors],
    });
    return NextResponse.json(
      {
        success: false,
        message: twilio.message,
        providerErrors: [...shortResult.providerErrors, ...twilio.providerErrors],
      },
      { status: 500 },
    );
  }

  await markReminderSent(body.phone, body.localDate);
  console.log('[worker] twilio_sent', {
    userId: body.userId,
    phone: body.phone,
    localDate: body.localDate,
    twilioStatus: twilio.info?.status,
    twilioSid: twilio.info?.sid,
  });

  return NextResponse.json({
    success: true,
    userId: body.userId,
    twilioInfo: twilio.info,
    providerErrors: shortResult.providerErrors,
  });
}
