import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { sendTwilioSMS } from '@/lib/twilio';

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

    const { error: updateError } = await supabase.from('users').update({ status: 'rejected' }).eq('id', userId);
    if (updateError) {
      return NextResponse.json(
        { success: false, message: updateError.message || 'Failed to reject user.' },
        { status: 500 },
      );
    }

    const nameText = user.name ? `${user.name}, ` : '';
    const noteText = adminMessage ? `\nReason: ${adminMessage}` : '';
    const smsBody = `${nameText}your signup request was not approved at this time.${noteText}\nYou can contact support for help.`;
    const smsResult = await sendTwilioSMS(user.phone, smsBody);

    return NextResponse.json({
      success: true,
      message: smsResult.success ? 'User rejected and SMS sent.' : 'User rejected, but SMS could not be sent.',
      smsSent: smsResult.success,
      providerErrors: smsResult.providerErrors,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to reject signup';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
