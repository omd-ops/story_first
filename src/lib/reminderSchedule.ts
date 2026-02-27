export type ReminderScheduleTime = {
  hour: number;
  minute: number;
  period: string;
};

export type SchedulableUser = {
  id: string;
  phone: string;
  timezone: string;
  sms_trigger_time: string;
  sms_trigger_days: number[];
};

const DAY_TO_INDEX: Record<string, number> = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

const WEEKDAY_SHORT_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function normalizePeriod(period: string): 'AM' | 'PM' {
  return period.toUpperCase() === 'PM' ? 'PM' : 'AM';
}

export function normalizeScheduleTimeTo24h(time: ReminderScheduleTime): string {
  let hour = Number(time.hour);
  const minute = Number(time.minute);

  if (Number.isNaN(hour) || hour < 1 || hour > 12) {
    throw new Error('Invalid reminder hour.');
  }
  if (Number.isNaN(minute) || minute < 0 || minute > 59) {
    throw new Error('Invalid reminder minute.');
  }

  const period = normalizePeriod(time.period);
  if (period === 'AM' && hour === 12) hour = 0;
  if (period === 'PM' && hour !== 12) hour += 12;

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function normalizeScheduleDays(days: string[]): number[] {
  const mapped = days
    .map((day) => DAY_TO_INDEX[day.trim().toLowerCase()])
    .filter((day): day is number => Number.isInteger(day));

  return Array.from(new Set(mapped)).sort((a, b) => a - b);
}

function parseTimeToMinutes(value: string): number | null {
  const trimmed = value.trim();
  const hhmm = /^(\d{1,2}):(\d{2})$/;
  const twelveHour = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

  const hhmmMatch = trimmed.match(hhmm);
  if (hhmmMatch) {
    const hour = Number(hhmmMatch[1]);
    const minute = Number(hhmmMatch[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return hour * 60 + minute;
  }

  const twelveHourMatch = trimmed.match(twelveHour);
  if (twelveHourMatch) {
    let hour = Number(twelveHourMatch[1]);
    const minute = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3].toUpperCase();

    if (hour < 1 || hour > 12 || minute < 0 || minute > 59) return null;
    if (period === 'AM' && hour === 12) hour = 0;
    if (period === 'PM' && hour !== 12) hour += 12;
    return hour * 60 + minute;
  }

  return null;
}

function getLocalTimeParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  const weekday = getPart('weekday');
  const hour = Number(getPart('hour'));
  const minute = Number(getPart('minute'));

  return {
    dayIndex: WEEKDAY_SHORT_TO_INDEX[weekday] ?? -1,
    minutes: hour * 60 + minute,
  };
}

export function getLocalDateKey(date: Date, timezone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function isReminderDueNow(user: SchedulableUser, now: Date, windowMinutes = 15) {
  if (!user.phone || !user.sms_trigger_time || !Array.isArray(user.sms_trigger_days)) {
    return false;
  }

  const targetMinutes = parseTimeToMinutes(user.sms_trigger_time);
  if (targetMinutes === null) {
    return false;
  }

  const local = getLocalTimeParts(now, user.timezone || 'UTC');
  if (!user.sms_trigger_days.includes(local.dayIndex)) {
    return false;
  }

  const delta = local.minutes - targetMinutes;
  return delta >= 0 && delta < windowMinutes;
}
