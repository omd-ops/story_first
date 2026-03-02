import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['quote', 'statistic', 'tip', 'announcement', 'user_content']);

function getIdFromUrl(req: Request) {
  const pathname = new URL(req.url).pathname;
  return pathname.split('/').pop() || '';
}

export async function GET(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('feed_content').select('*').eq('id', id).single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Feed content not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch feed content';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body?.type !== undefined) {
      const type = String(body.type).trim();
      if (!ALLOWED_TYPES.has(type)) {
        return NextResponse.json({ success: false, message: 'Invalid feed content type.' }, { status: 400 });
      }
      updates.type = type;
    }

    if (body?.title !== undefined) updates.title = body.title ? String(body.title).trim() : null;
    if (body?.content !== undefined) updates.content = String(body.content).trim();
    if (body?.imageUrl !== undefined) updates.image_url = body.imageUrl ? String(body.imageUrl).trim() : null;
    if (body?.author !== undefined) updates.author = body.author ? String(body.author).trim() : null;
    if (body?.isPinned !== undefined) updates.is_pinned = Boolean(body.isPinned);
    if (body?.publishedAt !== undefined) updates.published_at = new Date(String(body.publishedAt)).toISOString();

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields provided for update.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('feed_content').update(updates).eq('id', id).select('*').single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Feed content not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update feed content';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('feed_content').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete feed content';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
