type TwilioSendResult = {
  success: boolean;
  message: string;
  providerErrors: string[];
  info: { sid?: string; status?: string; errorMessage?: string } | null;
};

function normalizeE164(phone: string | undefined) {
  if (!phone) return '';
  const trimmed = phone.trim();
  if (!trimmed) return '';
  const normalized = trimmed.replace(/[\s()-]/g, '');
  return normalized.startsWith('+') ? normalized : `+${normalized}`;
}

export async function sendTwilioSMS(to: string, body: string): Promise<TwilioSendResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const fromNumber = normalizeE164(process.env.TWILIO_FROM_NUMBER || process.env.TWILIO_PHONE_NUMBER);

  const missing: string[] = [];
  if (!accountSid) missing.push('TWILIO_ACCOUNT_SID');
  if (!authToken) missing.push('TWILIO_AUTH_TOKEN');
  if (!fromNumber) missing.push('TWILIO_FROM_NUMBER (or TWILIO_PHONE_NUMBER)');

  if (missing.length > 0) {
    return {
      success: false,
      message: `Twilio credentials missing: ${missing.join(', ')}`,
      providerErrors: missing.map((key) => `twilio:missing:${key}`),
      info: null,
    };
  }

  const toNumber = normalizeE164(to);
  if (!/^\+[1-9]\d{7,14}$/.test(toNumber)) {
    return {
      success: false,
      message: 'Invalid destination phone number format.',
      providerErrors: [`twilio:invalid_to:${to}`],
      info: null,
    };
  }

  if (!/^\+[1-9]\d{7,14}$/.test(fromNumber)) {
    return {
      success: false,
      message: 'Invalid Twilio sender number format.',
      providerErrors: [`twilio:invalid_from:${fromNumber}`],
      info: null,
    };
  }

  const authHeader = `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams({
    To: toNumber,
    From: fromNumber,
    Body: body,
  });

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const text = await resp.text();
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    data = {};
  }

  if (!resp.ok) {
    const code = data.code ? String(data.code) : String(resp.status);
    const detail = data.message ? String(data.message) : text.slice(0, 250);
    return {
      success: false,
      message: 'Twilio request failed.',
      providerErrors: [`twilio:${code}:${detail}`],
      info: {
        errorMessage: detail,
      },
    };
  }

  return {
    success: true,
    message: 'Twilio SMS sent.',
    providerErrors: [],
    info: {
      sid: typeof data.sid === 'string' ? data.sid : undefined,
      status: typeof data.status === 'string' ? data.status : undefined,
      errorMessage: typeof data.error_message === 'string' ? data.error_message : undefined,
    },
  };
}
