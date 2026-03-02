import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['qa_grading', 'challenge_grading', 'qa_rubric', 'challenge_rubric']);

function getIdFromUrl(req: Request) {
  const pathname = new URL(req.url).pathname;
  return pathname.split('/').pop() || '';
}

export async function GET(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('ai_prompts').select('*').eq('id', id).single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Prompt not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch prompt';
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
    if (body?.promptText !== undefined) updates.prompt_text = String(body.promptText).trim();
    if (body?.rubric !== undefined) updates.rubric = body.rubric;
    if (body?.isActive !== undefined) updates.is_active = Boolean(body.isActive);

    if (body?.promptType !== undefined) {
      const promptType = String(body.promptType).trim();
      if (!ALLOWED_TYPES.has(promptType)) {
        return NextResponse.json({ success: false, message: 'Invalid prompt type.' }, { status: 400 });
      }
      updates.prompt_type = promptType;
    }

    if (Object.keys(updates).length === 0 && body?.version === undefined) {
      return NextResponse.json({ success: false, message: 'No valid fields provided for update.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    if (body?.version !== undefined) {
      const nextVersion = Number(body.version);
      if (!Number.isInteger(nextVersion) || nextVersion < 1) {
        return NextResponse.json({ success: false, message: 'version must be a positive integer.' }, { status: 400 });
      }
      updates.version = nextVersion;
    } else {
      const { data: existing, error: existingError } = await supabase
        .from('ai_prompts')
        .select('version')
        .eq('id', id)
        .single();

      if (existingError || !existing) {
        return NextResponse.json({ success: false, message: existingError?.message || 'Prompt not found.' }, { status: 404 });
      }

      const shouldBumpVersion =
        body?.promptText !== undefined || body?.rubric !== undefined || body?.promptType !== undefined || body?.name !== undefined;
      if (shouldBumpVersion) {
        updates.version = Number(existing.version || 1) + 1;
      }
    }

    const { data, error } = await supabase.from('ai_prompts').update(updates).eq('id', id).select('*').single();

    if (error || !data) {
      return NextResponse.json({ success: false, message: error?.message || 'Prompt not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update prompt';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const id = getIdFromUrl(req);
    if (!id) return NextResponse.json({ success: false, message: 'id is required.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('ai_prompts').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete prompt';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
