import { NextResponse } from 'next/server';
import { sendTwilioSMS } from '@/lib/twilio';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { normalizeScheduleDays, normalizeScheduleTimeTo24h } from '@/lib/reminderSchedule';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, phone, fullName, email, displayName, signupGoal, scheduleDays, scheduleTime, timezone } = body;

    if (!userId || !phone || !fullName || !Array.isArray(scheduleDays) || scheduleDays.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide userId, phone, full name, and schedule days.' },
        { status: 400 },
      );
    }

    const normalizedDays = normalizeScheduleDays(scheduleDays);
    if (normalizedDays.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Please provide valid reminder days.' },
        { status: 400 },
      );
    }

    const normalizedTime = normalizeScheduleTimeTo24h(scheduleTime);

    const twilioMessage = `StoryFirst reminder scheduled for ${scheduleDays.join(', ')} at ${String(
      scheduleTime.hour,
    )}:${String(scheduleTime.minute).padStart(2, '0')} ${scheduleTime.period} (${timezone}). We'll nudge you with reflection prompts.`;

    // Optional confirmation SMS.
    const twilioResult = await sendTwilioSMS(phone, twilioMessage);
    let reminderSaved = false;
    const providerErrors = [...twilioResult.providerErrors];

    const supabase = getSupabaseAdmin();
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('id, phone')
      .eq('id', userId)
      .maybeSingle();

    if (currentUserError) {
      providerErrors.push(`supabase:current_user_lookup_failed:${currentUserError.message}`);
    } else if (!currentUser) {
      providerErrors.push('supabase:current_user_not_found');
    } else if (currentUser.phone && currentUser.phone !== phone) {
      providerErrors.push('supabase:phone_mismatch:reverify_required');
    }

    if (providerErrors.some((e) => e.startsWith('supabase:current_user') || e.startsWith('supabase:phone_mismatch'))) {
      return NextResponse.json(
        {
          success: false,
          message: 'Phone mismatch detected. Please verify with the correct phone before saving schedule.',
          reminderSaved: false,
          twilioSuccess: twilioResult.success,
          twilioInfo: twilioResult.info,
          providerErrors,
        },
        { status: 400 },
      );
    }

    // Safety: never upsert by phone here, update only the authenticated user row.
    // This prevents one user's submission from overwriting another user record.
    const { data: phoneOwner, error: phoneOwnerError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .maybeSingle();

    if (phoneOwnerError) {
      providerErrors.push(`supabase:phone_owner_check_failed:${phoneOwnerError.message}`);
    } else if (phoneOwner?.id && phoneOwner.id !== userId) {
      providerErrors.push('supabase:phone_conflict:phone_belongs_to_another_user');
    } else {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          phone,
          name: fullName,
          email: email || null,
          display_name: displayName || null,
          signup_goal: signupGoal || null,
          timezone,
          sms_trigger_time: normalizedTime,
          sms_trigger_days: normalizedDays,
        })
        .eq('id', userId);

      if (updateError) {
        providerErrors.push(`supabase:update_failed:${updateError.message}`);
      } else {
        reminderSaved = true;
      }
    }

    return NextResponse.json({
      success: reminderSaved,
      message: twilioResult.success
        ? twilioResult.message ?? 'Reminder scheduled and SMS sent.'
        : 'Reminder scheduled, but Twilio could not send the SMS.',
      reminderSaved,
      twilioSuccess: twilioResult.success,
      twilioInfo: twilioResult.info,
      providerErrors,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unable to schedule reminder';
    return NextResponse.json({ success: false, message, providerErrors: [message] }, { status: 500 });
  }
}
