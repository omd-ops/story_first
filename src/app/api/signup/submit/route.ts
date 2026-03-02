import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

function normalizePhone(input: string) {
  const cleaned = input.replace(/[\s()-]/g, '');
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? '').trim();
    const phoneRaw = String(body?.phone ?? '').trim();
    const email = body?.email ? String(body.email).trim() : null;
    const referralSource = body?.referralSource ? String(body.referralSource).trim() : null;
    const signupGoal = body?.signupGoal ? String(body.signupGoal).trim() : null;

    if (!name || !phoneRaw) {
      return NextResponse.json({ success: false, message: 'name and phone are required.' }, { status: 400 });
    }

    const phone = normalizePhone(phoneRaw);
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      return NextResponse.json({ success: false, message: 'Invalid phone number format.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: existing, error: existingError } = await supabase
      .from('users')
      .select('id, status')
      .eq('phone', phone)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ success: false, message: existingError.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: `A signup already exists for this phone (${existing.status}).`,
          existingUserId: existing.id,
          existingStatus: existing.status,
        },
        { status: 409 },
      );
    }

    const { data, error } = await supabase
      .from('users')
      .insert({
        name,
        phone,
        email,
        referral_source: referralSource,
        signup_goal: signupGoal,
        status: 'pending',
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit signup';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
