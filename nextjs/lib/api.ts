import { NextRequest } from 'next/server';

/**
 * apiFetch - universal fetch for dev/prod that prefixes API calls with the correct base URL
 *            and handles mock responses automatically
 *
 * Usage:
 *   apiFetch('/users', { method: 'GET' })
 *   apiFetch('https://external.com/endpoint') // untouched
 */
export async function apiFetch(
  input: string | Request,
  init?: RequestInit,
): Promise<Response> {
  if (input instanceof Request) {
    return fetch(input, init);
  }

  let url = input;
  let mockName: string | null = null;

  try {
    const u = new URL(input, 'http://local.test');
    mockName = u.searchParams.get('mock');
  } catch {
    // ignore
  }

  if (mockName) {
    const mockUrl = `/mock/${mockName}.json`;
    return fetch(mockUrl, init);
  }

  if (typeof input === 'string') {
    if (input.startsWith('/api/')) {
      // Remove leading slash to avoid double slashes
      url =
        process.env.NEXT_PUBLIC_BASE_PATH +
        (input.startsWith('/') ? input : '/' + input);
    }
  }
  // If input is a Request object, you could extend logic here if needed

  return fetch(url as RequestInfo, init);
}

export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    //|| request.socket.remoteAddress
    'unknown'
  );
}
