type ShortenResult = {
  shortUrl: string | null;
  providerErrors: string[];
};

type ShortIoResponse = {
  shortURL?: string;
  secureShortURL?: string;
};

function normalizeDomain(domain: string) {
  return domain.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

async function createShortIoLink(
  apiKey: string,
  domain: string,
  originalUrl: string,
): Promise<{ shortUrl: string | null; error?: string }> {
  const response = await fetch('https://api.short.io/links', {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain,
      originalURL: originalUrl,
      allowDuplicates: true,
    }),
  });

  const text = await response.text();
  let data: ShortIoResponse = {};
  try {
    data = JSON.parse(text) as ShortIoResponse;
  } catch {
    data = {};
  }

  if (!response.ok) {
    return {
      shortUrl: null,
      error: `shortio:${response.status}:${domain}:${text.slice(0, 250)}`,
    };
  }

  const shortUrl = data.secureShortURL || data.shortURL || null;
  if (!shortUrl) {
    return {
      shortUrl: null,
      error: `shortio:invalid_response:${domain}`,
    };
  }

  return { shortUrl };
}

export async function shortenWithShortIo(originalUrl: string): Promise<ShortenResult> {
  const apiKey = process.env.SHORT_IO_API_KEY?.trim();
  const domain = normalizeDomain(process.env.SHORT_IO_DOMAIN || '');

  if (!apiKey || !domain) {
    return {
      shortUrl: null,
      providerErrors: ['shortio:missing:SHORT_IO_API_KEY or SHORT_IO_DOMAIN'],
    };
  }
  try {
    const result = await createShortIoLink(apiKey, domain, originalUrl);
    if (result.shortUrl) {
      return {
        shortUrl: result.shortUrl,
        providerErrors: [],
      };
    }
    return {
      shortUrl: null,
      providerErrors: result.error ? [result.error] : ['shortio:unknown_error'],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown_error';
    return {
      shortUrl: null,
      providerErrors: [`shortio:fetch_failed:${domain}:${message}`],
    };
  }
}
