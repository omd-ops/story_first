export type ReminderJobPayload = {
  userId: string;
  phone: string;
  timezone: string;
  localDate: string;
};

type PublishResult = {
  published: number;
  failed: number;
  errors: string[];
};

function getWorkerUrl() {
  const configured = process.env.REMINDER_WORKER_URL?.trim();
  if (configured) {
    return configured;
  }

  const base = (process.env.APP_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
  return `${base}/api/reminders/worker`;
}

export async function publishReminderJobs(jobs: ReminderJobPayload[]): Promise<PublishResult> {
  const qstashToken = process.env.QSTASH_TOKEN?.trim();
  if (!qstashToken) {
    return {
      published: 0,
      failed: jobs.length,
      errors: ['qstash:missing:QSTASH_TOKEN'],
    };
  }

  const qstashBase = (process.env.QSTASH_URL || 'https://qstash.upstash.io').replace(/\/+$/, '');
  const workerUrl = getWorkerUrl();
  const workerSecret = process.env.REMINDER_WORKER_SECRET?.trim() || process.env.CRON_SECRET?.trim() || '';

  const results = await Promise.all(
    jobs.map(async (job) => {
      const endpoint = `${qstashBase}/v2/publish/${encodeURIComponent(workerUrl)}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${qstashToken}`,
          'Content-Type': 'application/json',
          'Upstash-Method': 'POST',
          ...(workerSecret ? { 'Upstash-Forward-X-Reminder-Worker-Secret': workerSecret } : {}),
        },
        body: JSON.stringify(job),
      });

      if (response.ok) {
        return { ok: true, error: '' };
      }

      const text = await response.text();
      return {
        ok: false,
        error: `qstash:publish_failed:${response.status}:${text.slice(0, 250)}`,
      };
    }),
  );

  const errors = results.filter((result) => !result.ok).map((result) => result.error);

  return {
    published: results.length - errors.length,
    failed: errors.length,
    errors,
  };
}
