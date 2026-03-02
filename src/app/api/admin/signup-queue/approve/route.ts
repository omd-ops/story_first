import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { createMagicLink } from '@/lib/magicLink';
import { shortenWithShortIo } from '@/lib/shortLink';
import { sendTwilioSMS } from '@/lib/twilio';
import { appendAdminNotification } from '@/lib/adminNotificationStore';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const supabase = getSupabaseAdmin();

    const body = await req.json();
    const userId = String(body?.userId ?? '').trim();
    const adminMessage = String(body?.message ?? '').trim();

    if (!userId) {
      return NextResponse.json({ success: false, message: 'userId is required.' }, { status: 400 });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, phone, name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: userError?.message ?? 'User not found.' },
        { status: 404 },
      );
    }

    const { error: updateError } = await supabase.from('users').update({ status: 'approved' }).eq('id', userId);
    if (updateError) {
      return NextResponse.json(
        { success: false, message: updateError.message || 'Failed to approve user.' },
        { status: 500 },
      );
    }

    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const magicLink = createMagicLink(user.phone, appBaseUrl);
    const shortResult = await shortenWithShortIo(magicLink);
    const finalLink = shortResult.shortUrl || magicLink;

    const adminText = adminMessage ? `Admin note: ${adminMessage}` : '';
    const smsBody = ['You are approved on StoryFirst.', adminText, `Start here: ${finalLink}`]
      .filter(Boolean)
      .join('\n');

    const smsResult = await sendTwilioSMS(user.phone, smsBody);

    const displayName = user.name || user.phone;
    const noteText = adminMessage ? ` Message: ${adminMessage}` : '';
    const smsText = smsResult.success ? ' SMS sent.' : ' SMS failed.';
    await appendAdminNotification({
      type: smsResult.success ? 'approval' : 'error',
      title: 'User Approval Processed',
      message: `${displayName} approved.${noteText}${smsText}`,
    });

    return NextResponse.json({
      success: true,
      message: smsResult.success
        ? 'User approved and SMS sent.'
        : 'User approved, but SMS could not be sent.',
      smsSent: smsResult.success,
      providerErrors: [...shortResult.providerErrors, ...smsResult.providerErrors],
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to approve signup';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
