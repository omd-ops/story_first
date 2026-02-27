import { supabase } from './supabase';

export interface CreateScoreInput {
  userId: string;
  transcription: string;
  score: number;
  reasoning: string;
  scoringModel: string;
  provider: string;
  audioLength?: number | null;
  lessonId?: string | null;
  challengeType?: string | null;
  feedback?: string | null;
  improvementTips?: string[] | null;
}

export async function storeScore(input: CreateScoreInput) {
  const payload = {
    user_id: input.userId,
    transcription: input.transcription,
    score: input.score,
    reasoning: input.reasoning,
    scoring_model: input.scoringModel,
    provider: input.provider,
    audio_length: input.audioLength ?? null,
    lesson_id: input.lessonId ?? null,
    challenge_type: input.challengeType ?? null,
    feedback: input.feedback ?? null,
    improvement_tips: input.improvementTips ? JSON.stringify(input.improvementTips) : null,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from('llm_scores').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function getUserScores(userId: string, limit: number = 50) {
  const { data, error } = await supabase
    .from('llm_scores')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getScoreStats(userId: string) {
  const { data: scores, error } = await supabase.from('llm_scores').select('score').eq('user_id', userId);
  if (error) throw error;
  if (!scores || scores.length === 0) {
    return { averageScore: 0, highestScore: 0, lowestScore: 0, totalScores: 0, trend: [] };
  }
  const allScores = scores.map((s: any) => s.score as number);
  const averageScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
  const highestScore = Math.max(...allScores);
  const lowestScore = Math.min(...allScores);

  const { data: recent } = await supabase
    .from('llm_scores')
    .select('score')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(7);

  const trend = (recent || []).map((r: any) => r.score).reverse();

  return {
    averageScore: Math.round(averageScore * 10) / 10,
    highestScore,
    lowestScore,
    totalScores: allScores.length,
    trend,
  };
}

export async function getRecentTranscriptions(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('llm_scores')
    .select('id, transcription, score, reasoning, created_at, challenge_type')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}
