import fs from 'fs';
import path from 'path';

const REMINDERS_DIR = path.join(process.cwd(), 'data');
const REMINDERS_FILE = path.join(REMINDERS_DIR, 'reminders.json');

export interface ReminderRecord {
  phone: string;
  scheduleDays: string[];
  scheduleTime: { hour: number; minute: number; period: string };
  timezone: string;
  createdAt: string;
  lastSentAt?: string | null;
  twilioInfo?: { sid?: string; status?: string; errorMessage?: string } | null;
}

export async function readReminders(): Promise<ReminderRecord[]> {
  try {
    await fs.promises.mkdir(REMINDERS_DIR, { recursive: true });
    const raw = await fs.promises.readFile(REMINDERS_FILE, 'utf-8');
    return JSON.parse(raw) as ReminderRecord[];
  } catch {
    return [];
  }
}

export async function writeReminders(reminders: ReminderRecord[]) {
  await fs.promises.mkdir(REMINDERS_DIR, { recursive: true });
  await fs.promises.writeFile(REMINDERS_FILE, JSON.stringify(reminders, null, 2), 'utf-8');
}
