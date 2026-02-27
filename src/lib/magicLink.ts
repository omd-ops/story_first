import crypto from 'crypto';

const SECRET = process.env.MAGIC_LINK_SECRET || 'dev-secret-change-in-prod';
const DEFAULT_MAGIC_LINK_REDIRECT = '/users?view=lesson&day=1';

function getMagicLinkRedirectPath() {
  const configured = process.env.MAGIC_LINK_REDIRECT?.trim();
  if (!configured) return DEFAULT_MAGIC_LINK_REDIRECT;
  // Only allow internal redirects.
  if (!configured.startsWith('/')) return DEFAULT_MAGIC_LINK_REDIRECT;
  if (configured.startsWith('/users')) return DEFAULT_MAGIC_LINK_REDIRECT;
  return configured;
}

export function generateMagicToken(phone: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = `${phone}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

export function verifyMagicToken(token: string, maxAge = 3600): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [phone, timestampStr, hmac] = decoded.split(':');
    const timestamp = Number(timestampStr);
    const age = Math.floor(Date.now() / 1000) - timestamp;

    if (age > maxAge) return null;

    const payload = `${phone}:${timestamp}`;
    const expectedHmac = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    if (hmac !== expectedHmac) return null;

    return phone;
  } catch {
    return null;
  }
}

export function createMagicLink(phone: string, baseUrl: string): string {
  const token = generateMagicToken(phone);
  // Redirect is resolved server-side to avoid stale client-provided paths.
  return `${baseUrl}/api/magic-link/verify?token=${encodeURIComponent(token)}`;
}
