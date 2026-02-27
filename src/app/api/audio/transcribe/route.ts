import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio');

    if (!(audio instanceof File)) {
      return NextResponse.json({ error: 'Audio file missing' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          transcription: 'Mock transcription (ELEVENLABS_API_KEY not set).',
          source: 'mock',
        },
        { status: 200 },
      );
    }

    const elevenForm = new FormData();
    elevenForm.append('file', audio, audio.name || 'recording.webm');
    // Default model for STT. Can be overridden with env if needed.
    elevenForm.append('model_id', process.env.ELEVENLABS_STT_MODEL_ID || 'scribe_v1');

    const elevenRes = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
      },
      body: elevenForm,
    });

    if (!elevenRes.ok) {
      const text = await elevenRes.text();
      return NextResponse.json(
        {
          transcription: 'Mock transcription fallback (ElevenLabs request failed).',
          source: 'mock',
          providerError: text.slice(0, 500),
        },
        { status: 200 },
      );
    }

    const data = (await elevenRes.json()) as { text?: string; transcript?: string };
    return NextResponse.json(
      {
        transcription: data.text ?? data.transcript ?? '',
        source: 'elevenlabs',
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Transcription error' }, { status: 500 });
  }
}
