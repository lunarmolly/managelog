import { useAuthStore } from '../stores/auth';
import { mapHttpError, HttpError } from './errorMapper';

let refreshPromise: Promise<void> | null = null;

async function doRequest<T>(input: RequestInfo | URL, init: RequestInit = {}): Promise<T> {
  const auth = useAuthStore();
  const headers = new Headers(init.headers as HeadersInit);
  headers.set('Accept', 'application/json');
  if (!(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (auth.accessToken) {
    headers.set('Authorization', `Bearer ${auth.accessToken}`);
  }

  const resp = await fetch(input, {
    credentials: 'include',
    ...init,
    headers,
  });

  if (!resp.ok) {
    const contentType = resp.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await resp.json().catch(() => undefined) : await resp.text().catch(() => undefined);
    throw mapHttpError(resp.status, body);
  }

  const text = await resp.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function isAuthExpiredError(e: unknown): e is HttpError {
  return e instanceof HttpError && (e.status === 401 || e.status === 419);
}

async function ensureRefreshedOnce(): Promise<void> {
  if (!refreshPromise) {
    const auth = useAuthStore();
    refreshPromise = auth.refresh().catch(() => { throw new HttpError(401, 'Не удалось обновить сессию'); }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  try {
    return await doRequest<T>(input, init);
  } catch (e) {
    if (isAuthExpiredError(e)) {
      await ensureRefreshedOnce();
      return await doRequest<T>(input, init);
    }
    throw e;
  }
}


