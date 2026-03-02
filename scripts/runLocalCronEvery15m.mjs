import 'dotenv/config';

// Local cron tester: calls /api/reminders/cron every 1 minute.

const TARGET_URL = process.env.CRON_LOCAL_URL || 'http://localhost:3000/api/reminders/cron';
const CRON_SECRET = (process.env.CRON_SECRET || '').trim();
const INTERVAL_MS = 60 * 1000;

async function callCron() {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (CRON_SECRET) {
      headers['x-cron-secret'] = CRON_SECRET;
    }

    const res = await fetch(TARGET_URL, { method: 'POST', headers });
    const text = await res.text();
    console.log(`[${new Date().toISOString()}] ${res.status} ${text}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[${new Date().toISOString()}] ERROR ${msg}`);
  }
}

function msUntilNextMinute(now = new Date()) {
  const seconds = now.getSeconds();
  const millis = now.getMilliseconds();
  const elapsedInMinuteMs = seconds * 1000 + millis;
  if (elapsedInMinuteMs === 0) return 0;
  return 60 * 1000 - elapsedInMinuteMs;
}

const waitMs = msUntilNextMinute();

setTimeout(() => {
  void callCron();
  setInterval(() => {
    void callCron();
  }, INTERVAL_MS);
}, waitMs);
