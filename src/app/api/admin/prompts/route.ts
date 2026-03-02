import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['qa_grading', 'challenge_grading', 'qa_rubric', 'challenge_rubric']);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const promptType = searchParams.get('promptType')?.trim() || '';
    const activeOnly = searchParams.get('activeOnly') === '1';

    const supabase = getSupabaseAdmin();
    let query = supabase
      .from('ai_prompts')
      .select('id, name, prompt_type, prompt_text, rubric, is_active, version, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (promptType) query = query.eq('prompt_type', promptType);
    if (activeOnly) query = query.eq('is_active', true);

    const { data, error, count } = await query;
    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, items: data ?? [], total: count ?? 0 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch prompts';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? '').trim();
    const promptType = String(body?.promptType ?? '').trim();
    const promptText = String(body?.promptText ?? '').trim();

    if (!name || !promptType || !promptText) {
      return NextResponse.json(
        { success: false, message: 'name, promptType, and promptText are required.' },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(promptType)) {
      return NextResponse.json({ success: false, message: 'Invalid prompt type.' }, { status: 400 });
    }

    const payload = {
      name,
      prompt_type: promptType,
      prompt_text: promptText,
      rubric: body?.rubric ?? null,
      is_active: body?.isActive === undefined ? true : Boolean(body.isActive),
      version: Number.isInteger(body?.version) ? Number(body.version) : 1,
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('ai_prompts').insert(payload).select('*').single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create prompt';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
