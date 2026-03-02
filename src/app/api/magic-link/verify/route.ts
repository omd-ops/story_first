import { NextResponse } from 'next/server';
import { verifyMagicToken } from '@/lib/magicLink';

export const runtime = 'nodejs';
const DEFAULT_MAGIC_LINK_REDIRECT = '/users?view=lesson&day=1';

function getMagicLinkRedirectPath() {
  const configured = process.env.MAGIC_LINK_REDIRECT?.trim();
  if (!configured) return DEFAULT_MAGIC_LINK_REDIRECT;
  if (!configured.startsWith('/')) return DEFAULT_MAGIC_LINK_REDIRECT;
  if (configured.startsWith('/users')) return DEFAULT_MAGIC_LINK_REDIRECT;
  return configured;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/users?error=no-token', req.url));
    }

    const phone = verifyMagicToken(token, 3600); // 1 hour validity
    if (!phone) {
      return NextResponse.redirect(new URL('/users?error=invalid-token', req.url));
    }

    const safeRedirect = getMagicLinkRedirectPath();
    const destination = new URL(safeRedirect, req.url);
    destination.searchParams.set('phone', phone);

    return NextResponse.redirect(destination);
  } catch (err) {
    return NextResponse.redirect(new URL('/users?error=server-error', req.url));
  }
}
