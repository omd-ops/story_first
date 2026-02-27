export interface ReminderPayload {
  phone: string;
  scheduleDays: string[];
  scheduleTime: {
    hour: number;
    minute: number;
    period: string;
  };
  timezone: string;
}

export interface ReminderResponse {
  success: boolean;
  message?: string;
  reminderSaved?: boolean;
  twilioSuccess?: boolean;
  providerErrors?: string[];
  twilioInfo?: { sid?: string; status?: string; errorMessage?: string };
}

export async function scheduleReminder(payload: ReminderPayload): Promise<ReminderResponse> {
  const res = await fetch('/api/reminders/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message ?? 'Unable to schedule reminder');
  }
  return json as ReminderResponse;
}
