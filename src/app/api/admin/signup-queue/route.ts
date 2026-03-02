import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

type QueueItem = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  status: string;
  signupDate: string | null;
  scheduleDays: string[];
  scheduleTime: { hour: number; minute: number; period: string } | null;
  timezone: string | null;
};

const DAY_INDEX_TO_SHORT: Record<number, string> = {
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
  7: 'Sun',
};

function toScheduleTime(time24h: string | null) {
  if (!time24h) return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(time24h.trim());
  if (!match) return null;
  const hour24 = Number(match[1]);
  const minute = Number(match[2]);
  if (!Number.isInteger(hour24) || hour24 < 0 || hour24 > 23 || minute < 0 || minute > 59) {
    return null;
  }
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour, minute, period };
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, name, email, phone, status, created_at, timezone, sms_trigger_time, sms_trigger_days')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (userError) {
      return NextResponse.json(
        { success: false, message: userError.message || 'Failed to load pending users.' },
        { status: 500 },
      );
    }

    const items: QueueItem[] = (users ?? []).map((user) => {
      const scheduleDays = Array.isArray(user.sms_trigger_days)
        ? user.sms_trigger_days
            .map((day) => DAY_INDEX_TO_SHORT[day] ?? (day === 0 ? 'Sun' : null))
            .filter((day): day is string => Boolean(day))
        : [];

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        signupDate: user.created_at ?? null,
        scheduleDays,
        scheduleTime: toScheduleTime(user.sms_trigger_time ?? null),
        timezone: user.timezone ?? null,
      };
    });

    return NextResponse.json({ success: true, items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load signup queue';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
