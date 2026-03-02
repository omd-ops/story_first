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

async function publishDirectToWorker(jobs: ReminderJobPayload[], workerUrl: string, workerSecret: string): Promise<PublishResult> {
  if (jobs.length === 0) {
    return { published: 0, failed: 0, errors: [] };
  }

  const results = await Promise.all(
    jobs.map(async (job) => {
      try {
        const response = await fetch(workerUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(workerSecret ? { 'x-reminder-worker-secret': workerSecret } : {}),
          },
          body: JSON.stringify(job),
        });

        if (response.ok) {
          return { ok: true, error: '' };
        }

        const text = await response.text();
        return { ok: false, error: `worker:dispatch_failed:${response.status}:${text.slice(0, 250)}` };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { ok: false, error: `worker:dispatch_exception:${message}` };
      }
    }),
  );

  const errors = results.filter((result) => !result.ok).map((result) => result.error);
  return {
    published: results.length - errors.length,
    failed: errors.length,
    errors,
  };
}

function getWorkerUrl() {
  const configured = process.env.REMINDER_WORKER_URL?.trim();
  if (configured) {
    return configured;
  }

  const base = (process.env.APP_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
  return `${base}/api/reminders/worker`;
}

export async function publishReminderJobs(jobs: ReminderJobPayload[]): Promise<PublishResult> {
  if (jobs.length === 0) {
    return { published: 0, failed: 0, errors: [] };
  }

  const workerUrl = getWorkerUrl();
  const workerSecret = process.env.REMINDER_WORKER_SECRET?.trim() || process.env.CRON_SECRET?.trim() || '';
  const qstashToken = process.env.QSTASH_TOKEN?.trim();
  if (!qstashToken) {
    return publishDirectToWorker(jobs, workerUrl, workerSecret);
  }

  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(workerUrl)) {
    return publishDirectToWorker(jobs, workerUrl, workerSecret);
  }

  const qstashBase = (process.env.QSTASH_URL || 'https://qstash.upstash.io').replace(/\/+$/, '');

  const results = await Promise.all(
    jobs.map(async (job) => {
      try {
        const endpoint = `${qstashBase}/v2/publish/${workerUrl}`;
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
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          ok: false,
          error: `qstash:publish_exception:${message}`,
        };
      }
    }),
  );

  const errors = results.filter((result) => !result.ok).map((result) => result.error);

  return {
    published: results.length - errors.length,
    failed: errors.length,
    errors,
  };
}
