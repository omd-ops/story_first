// Mock data for StoryFirst app

export interface UserData {
  name: string;
  currentDay: number;
  streak: number;
  xp: number;
  status: 0 | 1 | 2 | 3;
  pauseTokens: number;
  completedDays: number[];
}

export interface Lesson {
  day: number;
  title: string;
  locked: boolean;
  completed: boolean;
  available: boolean;
}

export interface FeedItem {
  id: string;
  type: 'quote' | 'tip' | 'announcement' | 'story';
  content: string;
  author?: string;
  liked: boolean;
  timestamp: string;
}

export interface LeaderboardUser {
  name: string;
  xp: number;
  rank: number;
}

export const mockUser: UserData = {
  name: 'Alex',
  currentDay: 12,
  streak: 12,
  xp: 1850,
  status: 1,
  pauseTokens: 2,
  completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export const mockLessons: Lesson[] = Array.from({ length: 70 }, (_, i) => {
  const day = i + 1;
  const lessonTitles = [
    'THE HOOK',
    'SETTING THE SCENE',
    'CHARACTER VOICE',
    'EMOTIONAL STAKES',
    'THE TURN',
    'SPECIFICITY',
    'SENSORY DETAIL',
    'PACING',
    'DIALOGUE',
    'CONFLICT',
    'RESOLUTION',
    'REFLECTION',
  ];
  
  return {
    day,
    title: lessonTitles[(day - 1) % lessonTitles.length],
    locked: day > mockUser.currentDay,
    completed: mockUser.completedDays.includes(day),
    available: day <= 15, // Rolling delivery - first 15 days available
  };
});

export const mockFeedItems: FeedItem[] = [
  {
    id: '1',
    type: 'quote',
    content: 'The first draft is you telling yourself the story.',
    author: 'Terry Pratchett',
    liked: false,
    timestamp: '2026-02-06T10:00:00Z',
  },
  {
    id: '2',
    type: 'tip',
    content: 'When writing dialogue, read it aloud. If it sounds unnatural to speak, it will read unnaturally too.',
    liked: true,
    timestamp: '2026-02-05T14:30:00Z',
  },
  {
    id: '3',
    type: 'announcement',
    content: 'Week 2 Challenge unlocks tomorrow: "The Story of a Scar"',
    liked: false,
    timestamp: '2026-02-04T09:00:00Z',
  },
  {
    id: '4',
    type: 'story',
    content: 'I never thought I could write until StoryFirst showed me I already had the stories inside me. Day 12 and I\'m finally finding my voice.',
    author: 'Maya R.',
    liked: true,
    timestamp: '2026-02-03T16:45:00Z',
  },
  {
    id: '5',
    type: 'quote',
    content: 'Every story you tell becomes a part of who you are.',
    author: 'Devon (Coach)',
    liked: false,
    timestamp: '2026-02-02T11:20:00Z',
  },
];

export const mockLeaderboard: LeaderboardUser[] = [
  { name: 'Alex K.', xp: 1240, rank: 1 },
  { name: 'Sarah M.', xp: 850, rank: 2 },
  { name: 'John D.', xp: 720, rank: 3 },
  { name: 'Emma R.', xp: 680, rank: 4 },
  { name: 'Michael T.', xp: 620, rank: 5 },
];