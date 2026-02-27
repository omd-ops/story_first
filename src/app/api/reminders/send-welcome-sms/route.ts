import { NextResponse } from 'next/server';
import { sendTwilioSMS } from '@/lib/twilio';
import { createMagicLink } from '@/lib/magicLink';
import { shortenWithShortIo } from '@/lib/shortLink';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone number required.' }, { status: 400 });
    }

    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const magicLink = createMagicLink(phone, appBaseUrl);
    const shortResult = await shortenWithShortIo(magicLink);
    const finalLink = shortResult.shortUrl || magicLink;

    const smsMessage = `You have unlocked new lesson click here to link below:\n${finalLink}`;

    const result = await sendTwilioSMS(phone, smsMessage);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      magicLink,
      shortLink: shortResult.shortUrl,
      twilioInfo: result.info,
      providerErrors: [...shortResult.providerErrors, ...result.providerErrors],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error sending welcome SMS';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
