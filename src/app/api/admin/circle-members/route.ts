import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const circleId = searchParams.get('circleId')?.trim() || '';
    const userId = searchParams.get('userId')?.trim() || '';

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('circle_members')
      .select('id, circle_id, user_id, joined_at', { count: 'exact' })
      .order('joined_at', { ascending: false });

    if (circleId) query = query.eq('circle_id', circleId);
    if (userId) query = query.eq('user_id', userId);

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, items: data ?? [], total: count ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch circle memberships';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const circleId = String(body?.circleId ?? '').trim();
    const userId = String(body?.userId ?? '').trim();

    if (!circleId || !userId) {
      return NextResponse.json({ success: false, message: 'circleId and userId are required.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('circle_members')
      .insert({ circle_id: circleId, user_id: userId })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create circle membership';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
