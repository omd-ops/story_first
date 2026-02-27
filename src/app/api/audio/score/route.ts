import { NextResponse } from 'next/server';
import { storeScore } from '@/lib/scoreStore';

export const runtime = 'nodejs';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const { transcription } = await req.json();
    if (!transcription || typeof transcription !== 'string') {
      return NextResponse.json({ error: 'transcription is required' }, { status: 400 });
    }

    const userId = req.headers.get('x-user-id')?.trim() || 'anonymous-user';

    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!openaiKey && !geminiKey) {
      return NextResponse.json(
        {
          score: 7,
          reasoning: 'Mock score (no OPENAI_API_KEY or GEMINI_API_KEY set).',
          model: 'mock',
          provider: 'mock',
        },
        { status: 200 },
      );
    }

    const prompt = buildPrompt(transcription);
    const providerErrors: string[] = [];
    const openaiModel = process.env.OPENAI_SCORING_MODEL || 'gpt-4o-mini';
    const geminiModel = process.env.GEMINI_SCORING_MODEL || 'gemini-2.5-flash';

    if (openaiKey) {
      const res = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: [{ role: 'system', content: prompt.system }, { role: 'user', content: prompt.user }],
          temperature: 0.2,
          response_format: { type: 'json_object' },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content ?? '';
        const parsed = parseScore(content);
        const scoreRecord = {
          ...parsed,
          model: openaiModel,
          provider: 'openai',
          timestamp: new Date().toISOString(),
          transcription,
          userId,
        };
        try {
          await storeScore(scoreRecord as any);
        } catch (e) {
          console.error('storeScore error:', e);
        }
        return NextResponse.json(scoreRecord);
      }
      providerErrors.push(`openai:${res.status}:${(await res.text()).slice(0, 250)}`);
    }

    if (geminiKey) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`;
      const res = await fetch(`${geminiUrl}?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${prompt.system}\n\nUser transcript:\n${transcription}` }],
            },
          ],
          generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        const parsed = parseScore(text);
        const scoreRecord = {
          ...parsed,
          model: geminiModel,
          provider: 'gemini',
          timestamp: new Date().toISOString(),
          transcription,
          userId,
        };
        try {
          await storeScore(scoreRecord as any);
        } catch (e) {
          console.error('storeScore error:', e);
        }
        return NextResponse.json(scoreRecord);
      }
      providerErrors.push(`gemini:${res.status}:${(await res.text()).slice(0, 250)}`);
    }

    return NextResponse.json(
      {
        score: 6,
        reasoning: 'Mock score fallback (scoring providers failed).',
        model: 'mock',
        provider: 'mock',
        providerErrors,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Scoring error';
    return NextResponse.json(
      {
        score: 6,
        reasoning: 'Mock score fallback (route exception).',
        model: 'mock',
        provider: 'mock',
        providerErrors: [message],
      },
      { status: 200 },
    );
  }
}

function buildPrompt(transcription: string) {
  const system =
    'You are a concise storytelling coach. Score the user spoken response on a 0-10 scale based on clarity, structure, and engagement. Return valid JSON only.';
  const user = `Transcript:\n${transcription}\n\nReturn JSON: {"score": <0-10>, "reasoning": "<one sentence>"}.`;
  return { system, user };
}

function parseScore(text: string) {
  const clampScore = (value: number) => Math.max(0, Math.min(10, Math.round(value * 10) / 10));
  const cleanReason = (value: unknown) =>
    typeof value === 'string' && value.trim().length > 0 ? value.trim() : 'No reasoning provided.';

  const tryObject = (obj: any) => {
    if (!obj || typeof obj !== 'object') return null;
    const rawScore = Number(obj.score);
    if (Number.isFinite(rawScore)) {
      return {
        score: clampScore(rawScore),
        reasoning: cleanReason(obj.reasoning),
      };
    }
    return null;
  };

  try {
    // 1) Strict JSON
    const direct = tryObject(JSON.parse(text));
    if (direct) return direct;
  } catch {
    // fall through
  }

  try {
    // 2) JSON fenced block or embedded JSON object
    const withoutFences = text.replace(/```json|```/gi, '').trim();
    const match = withoutFences.match(/\{[\s\S]*\}/);
    if (match) {
      const embedded = tryObject(JSON.parse(match[0]));
      if (embedded) return embedded;
    }
  } catch {
    // fall through
  }

  // 3) Text fallback: parse "score: X"
  const scoreMatch = text.match(/score[^0-9\-]*(-?\d+(?:\.\d+)?)/i);
  if (scoreMatch) {
    return {
      score: clampScore(Number(scoreMatch[1])),
      reasoning: 'Score parsed from non-JSON response.',
    };
  }

  return { score: 0, reasoning: 'Could not parse score.' };
}
