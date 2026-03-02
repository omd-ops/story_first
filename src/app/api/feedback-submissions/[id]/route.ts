import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const ALLOWED_CATEGORIES = new Set(['bug', 'idea']);

function getIdFromUrl(req: Request) {
  const pathname = new URL(req.url).pathname;
  return pathname.split('/').pop() || '';
}

export async function GET(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('feedback_submissions').select('*').eq('id', id).single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Feedback submission not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch feedback submission';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body?.category !== undefined) {
      const category = String(body.category).trim();
      if (!ALLOWED_CATEGORIES.has(category)) {
        return NextResponse.json({ success: false, message: 'Invalid category.' }, { status: 400 });
      }
      updates.category = category;
    }

    if (body?.screenName !== undefined) updates.screen_name = String(body.screenName).trim();
    if (body?.feedbackText !== undefined) updates.feedback_text = String(body.feedbackText).trim();
    if (body?.linearTicketId !== undefined) {
      updates.linear_ticket_id = body.linearTicketId ? String(body.linearTicketId).trim() : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields provided for update.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('feedback_submissions')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Feedback submission not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update feedback submission';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('feedback_submissions').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete feedback submission';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
