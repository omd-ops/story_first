import fs from 'fs';
import path from 'path';

const STORE_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(STORE_DIR, 'reminder-dispatch-state.json');

type DispatchState = Record<string, string>;

function buildKey(phone: string, localDate: string) {
  return `${phone}:${localDate}`;
}

async function readState(): Promise<DispatchState> {
  try {
    await fs.promises.mkdir(STORE_DIR, { recursive: true });
    const raw = await fs.promises.readFile(STORE_FILE, 'utf-8');
    return JSON.parse(raw) as DispatchState;
  } catch {
    return {};
  }
}

async function writeState(state: DispatchState) {
  await fs.promises.mkdir(STORE_DIR, { recursive: true });
  await fs.promises.writeFile(STORE_FILE, JSON.stringify(state, null, 2), 'utf-8');
}

export async function hasReminderBeenSent(phone: string, localDate: string) {
  const state = await readState();
  return Boolean(state[buildKey(phone, localDate)]);
}

export async function markReminderSent(phone: string, localDate: string) {
  const state = await readState();
  state[buildKey(phone, localDate)] = new Date().toISOString();
  await writeState(state);
}

export async function cleanupReminderDispatchState(keepDays = 3) {
  const state = await readState();
  const now = Date.now();
  const maxAgeMs = keepDays * 24 * 60 * 60 * 1000;

  let removed = 0;
  const next: DispatchState = {};
  for (const [key, iso] of Object.entries(state)) {
    const timestamp = Date.parse(iso);
    if (Number.isNaN(timestamp) || now - timestamp > maxAgeMs) {
      removed += 1;
      continue;
    }
    next[key] = iso;
  }

  await writeState(next);
  return { removed, remaining: Object.keys(next).length };
}
