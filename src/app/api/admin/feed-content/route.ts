import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['quote', 'statistic', 'tip', 'announcement', 'user_content']);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type')?.trim() || '';
    const includeUnpublished = searchParams.get('includeUnpublished') === '1';

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('feed_content')
      .select('id, type, title, content, image_url, author, is_pinned, published_at, created_at, updated_at', {
        count: 'exact',
      })
      .order('is_pinned', { ascending: false })
      .order('published_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (!includeUnpublished) {
      query = query.lte('published_at', new Date().toISOString());
    }

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, items: data ?? [], total: count ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch feed content';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const type = String(body?.type ?? '').trim();
    const content = String(body?.content ?? '').trim();

    if (!type || !content) {
      return NextResponse.json({ success: false, message: 'type and content are required.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ success: false, message: 'Invalid feed content type.' }, { status: 400 });
    }

    const payload = {
      type,
      title: body?.title ? String(body.title).trim() : null,
      content,
      image_url: body?.imageUrl ? String(body.imageUrl).trim() : null,
      author: body?.author ? String(body.author).trim() : null,
      is_pinned: Boolean(body?.isPinned),
      published_at: body?.publishedAt ? new Date(String(body.publishedAt)).toISOString() : new Date().toISOString(),
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('feed_content').insert(payload).select('*').single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create feed content';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
