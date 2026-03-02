import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

function getIdFromUrl(req: Request) {
  const pathname = new URL(req.url).pathname;
  return pathname.split('/').pop() || '';
}

export async function GET(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('circle_members').select('*').eq('id', id).single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Circle membership not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch circle membership';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const body = await req.json();
    const updates: Record<string, unknown> = {};
    if (body?.circleId !== undefined) updates.circle_id = String(body.circleId).trim();
    if (body?.userId !== undefined) updates.user_id = String(body.userId).trim();

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields provided for update.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('circle_members').update(updates).eq('id', id).select('*').single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Circle membership not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update circle membership';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('circle_members').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete circle membership';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
