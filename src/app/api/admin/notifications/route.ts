import { NextResponse } from 'next/server';
import { readAdminNotifications } from '@/lib/adminNotificationStore';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const items = await readAdminNotifications();
    return NextResponse.json({ success: true, items });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load notifications';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
