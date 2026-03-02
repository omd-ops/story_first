import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'admin-notifications.json');

export type AdminNotification = {
  id: string;
  type: 'approval' | 'info' | 'error';
  title: string;
  message: string;
  createdAt: string;
  unread: boolean;
};

async function ensureDir() {
  await fs.promises.mkdir(DATA_DIR, { recursive: true });
}

export async function readAdminNotifications(): Promise<AdminNotification[]> {
  try {
    await ensureDir();
    const raw = await fs.promises.readFile(FILE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as AdminNotification[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export async function writeAdminNotifications(items: AdminNotification[]) {
  await ensureDir();
  await fs.promises.writeFile(FILE_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

export async function appendAdminNotification(
  input: Omit<AdminNotification, 'id' | 'createdAt' | 'unread'> &
    Partial<Pick<AdminNotification, 'unread'>>,
) {
  const existing = await readAdminNotifications();

  const item: AdminNotification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: input.type,
    title: input.title,
    message: input.message,
    createdAt: new Date().toISOString(),
    unread: input.unread ?? true,
  };

  const next = [item, ...existing].slice(0, 200);
  await writeAdminNotifications(next);
  return item;
}
