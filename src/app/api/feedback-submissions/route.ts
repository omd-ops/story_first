import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const ALLOWED_CATEGORIES = new Set(['bug', 'idea']);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category')?.trim() || '';
    const userId = searchParams.get('userId')?.trim() || '';
    const limit = Number(searchParams.get('limit') || 50);

    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 200) : 50;

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('feedback_submissions')
      .select('id, user_id, category, screen_name, feedback_text, linear_ticket_id, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(safeLimit);

    if (category) query = query.eq('category', category);
    if (userId) query = query.eq('user_id', userId);

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, items: data ?? [], total: count ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch feedback submissions';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = String(body?.userId ?? '').trim();
    const category = String(body?.category ?? '').trim();
    const screenName = String(body?.screenName ?? '').trim();
    const feedbackText = String(body?.feedbackText ?? '').trim();

    if (!userId || !category || !screenName || !feedbackText) {
      return NextResponse.json(
        { success: false, message: 'userId, category, screenName, and feedbackText are required.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ success: false, message: 'Invalid category.' }, { status: 400 });
    }

    const payload = {
      user_id: userId,
      category,
      screen_name: screenName,
      feedback_text: feedbackText,
      linear_ticket_id: body?.linearTicketId ? String(body.linearTicketId).trim() : null,
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('feedback_submissions').insert(payload).select('*').single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create feedback submission';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
