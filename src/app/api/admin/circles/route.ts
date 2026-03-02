import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['private', 'goal_based', 'custom']);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type')?.trim() || '';

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('circles')
      .select('id, name, type, goal, whatsapp_link, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, items: data ?? [], total: count ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch circles';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? '').trim();
    const type = String(body?.type ?? '').trim();

    if (!name || !type) {
      return NextResponse.json({ success: false, message: 'name and type are required.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ success: false, message: 'Invalid circle type.' }, { status: 400 });
    }

    const payload = {
      name,
      type,
      goal: body?.goal ? String(body.goal).trim() : null,
      whatsapp_link: body?.whatsappLink ? String(body.whatsappLink).trim() : null,
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('circles').insert(payload).select('*').single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create circle';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
