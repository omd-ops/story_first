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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status')?.trim() || '';
    const search = searchParams.get('search')?.trim() || '';
    const limit = Number(searchParams.get('limit') || 50);
    const offset = Number(searchParams.get('offset') || 0);

    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 200) : 50;
    const safeOffset = Number.isFinite(offset) ? Math.max(offset, 0) : 0;

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('users')
      .select(
        'id, phone, email, name, display_name, status, referral_source, signup_goal, timezone, sms_trigger_time, sms_trigger_days, created_at, updated_at',
        { count: 'exact' },
      )
      .order('created_at', { ascending: false })
      .range(safeOffset, safeOffset + safeLimit - 1);

    if (status && !ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status filter.' }, { status: 400 });
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      items: data ?? [],
      pagination: {
        limit: safeLimit,
        offset: safeOffset,
        total: count ?? 0,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body?.phone ?? '').trim();
    const name = String(body?.name ?? '').trim();
    const status = String(body?.status ?? 'pending').trim();

    if (!phone || !name) {
      return NextResponse.json({ success: false, message: 'phone and name are required.' }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status value.' }, { status: 400 });
    }

    const smsTriggerTime = body?.smsTriggerTime ? String(body.smsTriggerTime).trim() : null;
    if (smsTriggerTime && !isValidTime24h(smsTriggerTime)) {
      return NextResponse.json(
        { success: false, message: 'smsTriggerTime must be in 24h HH:MM format.' },
        { status: 400 },
      );
    }

    const normalizedDays = normalizeSmsTriggerDays(body?.smsTriggerDays);
    if (normalizedDays && typeof normalizedDays === 'object' && 'error' in normalizedDays) {
      return NextResponse.json({ success: false, message: normalizedDays.error }, { status: 400 });
    }

    const payload = {
      phone,
      name,
      email: body?.email ? String(body.email).trim() : null,
      display_name: body?.displayName ? String(body.displayName).trim() : null,
      status,
      referral_source: body?.referralSource ? String(body.referralSource).trim() : null,
      signup_goal: body?.signupGoal ? String(body.signupGoal).trim() : null,
      timezone: body?.timezone ? String(body.timezone).trim() : null,
      sms_trigger_time: smsTriggerTime,
      sms_trigger_days: normalizedDays,
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('users').insert(payload).select('*').single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create user';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
