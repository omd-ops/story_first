export type TranscriptionResult = {
  transcription: string;
  source: 'elevenlabs' | 'mock';
};

export type ScoreResult = {
  score: number;
  reasoning: string;
  model: string;
  provider: 'openai' | 'gemini' | 'mock';
};

const STORAGE_KEY = 'storyfirst-audio-samples';
const USER_ID_KEY = 'storyfirst-user-id';

function getOrCreateUserId() {
  if (typeof window === 'undefined') return 'anonymous-server';
  const existing = localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem(USER_ID_KEY, next);
  return next;
}

export async function transcribeAudio(blob: Blob): Promise<TranscriptionResult> {
  const formData = new FormData();
  formData.append('audio', blob, 'recording.webm');

  const res = await fetch('/api/audio/transcribe', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Transcription failed');
  return (await res.json()) as TranscriptionResult;
}

export async function scoreTranscription(text: string): Promise<ScoreResult> {
  const userId = getOrCreateUserId();
  const res = await fetch('/api/audio/score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    },
    body: JSON.stringify({ transcription: text }),
  });
  if (!res.ok) throw new Error('Scoring failed');
  return (await res.json()) as ScoreResult;
}

export async function persistSample(blob: Blob, transcription: string, score?: ScoreResult) {
  const base64 = await blobToBase64(blob);
  const payload = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    transcription,
    score,
    audioBase64: base64,
  };
  const existingRaw = localStorage.getItem(STORAGE_KEY);
  const existing = existingRaw ? JSON.parse(existingRaw) : [];
  existing.unshift(payload);
  // Keep only the latest 10 samples to avoid unbounded growth.
  const trimmed = existing.slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') resolve(result);
      else reject(new Error('Failed to encode audio'));
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
