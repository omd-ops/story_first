import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['private', 'goal_based', 'custom']);

function getIdFromUrl(req: Request) {
  const pathname = new URL(req.url).pathname;
  return pathname.split('/').pop() || '';
}

export async function GET(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('circles').select('*').eq('id', id).single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Circle not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch circle';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (body?.name !== undefined) updates.name = String(body.name).trim();
    if (body?.goal !== undefined) updates.goal = body.goal ? String(body.goal).trim() : null;
    if (body?.whatsappLink !== undefined) updates.whatsapp_link = body.whatsappLink ? String(body.whatsappLink).trim() : null;
    if (body?.type !== undefined) {
      const type = String(body.type).trim();
      if (!ALLOWED_TYPES.has(type)) {
        return NextResponse.json({ success: false, message: 'Invalid circle type.' }, { status: 400 });
      }
      updates.type = type;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields provided for update.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('circles').update(updates).eq('id', id).select('*').single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Circle not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update circle';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('circles').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete circle';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
