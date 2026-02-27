import { NextResponse } from 'next/server';
import sendDueReminders from '@/lib/reminderSender';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const result = await sendDueReminders(new Date());
    return NextResponse.json({ success: true, result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error sending reminders';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
