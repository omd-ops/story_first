import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const ALLOWED_STATUSES = new Set(['pending', 'approved', 'rejected']);

function isValidTime24h(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

function normalizeSmsTriggerDays(value: unknown) {
  if (value == null) return null;
  if (!Array.isArray(value)) return { error: 'smsTriggerDays must be an array of integers 1-7.' };
  if (value.length === 0) return [];

  const parsed = value.map((day) => Number(day));
  const isValid = parsed.every((day) => Number.isInteger(day) && day >= 1 && day <= 7);
  if (!isValid) return { error: 'smsTriggerDays must contain only integers in range 1-7.' };
  return Array.from(new Set(parsed)).sort((a, b) => a - b);
}

function getIdFromUrl(req: Request) {
  const pathname = new URL(req.url).pathname;
  return pathname.split('/').pop() || '';
}

export async function GET(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) {
      return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) {
      return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body?.name !== undefined) updates.name = String(body.name).trim();
    if (body?.displayName !== undefined) updates.display_name = body.displayName ? String(body.displayName).trim() : null;
    if (body?.email !== undefined) updates.email = body.email ? String(body.email).trim() : null;
    if (body?.phone !== undefined) updates.phone = String(body.phone).trim();
    if (body?.referralSource !== undefined) updates.referral_source = body.referralSource ? String(body.referralSource).trim() : null;
    if (body?.signupGoal !== undefined) updates.signup_goal = body.signupGoal ? String(body.signupGoal).trim() : null;
    if (body?.timezone !== undefined) updates.timezone = body.timezone ? String(body.timezone).trim() : null;
    if (body?.smsTriggerTime !== undefined) {
      if (!body.smsTriggerTime) {
        updates.sms_trigger_time = null;
      } else {
        const smsTriggerTime = String(body.smsTriggerTime).trim();
        if (!isValidTime24h(smsTriggerTime)) {
          return NextResponse.json(
            { success: false, message: 'smsTriggerTime must be in 24h HH:MM format.' },
            { status: 400 },
          );
        }
        updates.sms_trigger_time = smsTriggerTime;
      }
    }
    if (body?.smsTriggerDays !== undefined) {
      const normalizedDays = normalizeSmsTriggerDays(body.smsTriggerDays);
      if (normalizedDays && typeof normalizedDays === 'object' && 'error' in normalizedDays) {
        return NextResponse.json({ success: false, message: normalizedDays.error }, { status: 400 });
      }
      updates.sms_trigger_days = normalizedDays;
    }

    if (body?.status !== undefined) {
      const status = String(body.status).trim();
      if (!ALLOWED_STATUSES.has(status)) {
        return NextResponse.json({ success: false, message: 'Invalid status value.' }, { status: 400 });
      }
      updates.status = status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields provided for update.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select('*').single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) {
      return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete user';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
