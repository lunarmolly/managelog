import { http, HttpResponse, delay } from 'msw';
import { API } from '../../api/endpoints';

type InMemoryUser = {
  id: string;
  name: string;
  shortId: string;
  companyId?: string | null;
  email?: string;
  username: string;
  password: string;
};

let users: InMemoryUser[] = [];
let revokedAccessTokens = new Set<string>();

function makeAccessToken(username: string): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + 60 * 5; // 5 минут
  const payload = btoa(JSON.stringify({ sub: username, exp }));
  return `${header}.${payload}.`;
}

function validateAccess(token?: string | null) {
  if (!token || revokedAccessTokens.has(token)) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1] || ''));
    return typeof payload.exp === 'number' && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  header.split(';').forEach(part => {
    const [k, v] = part.split('=').map(s => s.trim());
    if (k) out[k] = v || '';
  });
  return out;
}

function makeRefreshCookie(username: string) {
  return `refreshToken=rt_${encodeURIComponent(username)}; Path=/; SameSite=Lax; HttpOnly`;
}

const SET_REFRESH_COOKIE = makeRefreshCookie('anon'); // будет заменен конкретным при ответах
const CLEAR_REFRESH_COOKIE = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; HttpOnly';

export const handlers = [
  http.post(API.auth.register, async ({ request }) => {
    const body = await request.json() as any;
    await delay(400);
    if (users.some(u => u.username === body.username)) {
      return HttpResponse.json({ message: 'Пользователь уже существует' }, { status: 400 });
    }
    const user: InMemoryUser = {
      id: crypto.randomUUID(),
      name: `${body.firstName} ${body.lastName}`.trim(),
      shortId: `#${Math.random().toString().slice(2, 6)}`,
      companyId: null,
      username: body.username,
      password: body.password,
    };
    users.push(user);
    const accessToken = makeAccessToken(user.username);
    return HttpResponse.json(
      { accessToken, user: { id: user.id, name: user.name, shortId: user.shortId, companyId: user.companyId } },
      { headers: { 'Set-Cookie': makeRefreshCookie(user.username) } },
    );
  }),

  http.post(API.auth.login, async ({ request }) => {
    const body = await request.json() as any;
    await delay(300);
    let user = users.find(u => (u.username === body.login || u.email === body.login) && u.password === body.password);
    if (!user) {
      // Авто-создание пользователя для офлайн-режима
      const username = String(body.login);
      user = {
        id: crypto.randomUUID(),
        name: username,
        shortId: `#${(Math.abs([...username].reduce((a,c)=>a+c.charCodeAt(0),0))%9000+1000)}`,
        companyId: null,
        username,
        password: body.password ?? '',
      };
      users.push(user);
    }
    const accessToken = makeAccessToken(user.username);
    return HttpResponse.json(
      { accessToken, user: { id: user.id, name: user.name, shortId: user.shortId, companyId: user.companyId } },
      { headers: { 'Set-Cookie': makeRefreshCookie(user.username) } },
    );
  }),

  http.get(API.auth.me, async ({ request }) => {
    await delay(150);
    const auth = request.headers.get('authorization');
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!validateAccess(token)) return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = token ? JSON.parse(atob(token.split('.')[1] || '{}')) : {};
    let user = users.find(u => u.username === payload.sub);
    if (!user) {
      // Синтезируем пользователя из токена для офлайн-постоянства
      const username = String(payload.sub || 'user');
      user = {
        id: `u_${btoa(username).replace(/=/g,'').slice(0,8)}`,
        name: username,
        shortId: `#${(Math.abs([...username].reduce((a,c)=>a+c.charCodeAt(0),0))%9000+1000)}`,
        companyId: null,
        username,
        password: '',
      };
      users.push(user);
    }
    return HttpResponse.json({ user: { id: user.id, name: user.name, shortId: user.shortId, companyId: user.companyId } });
  }),

  http.post(API.auth.refresh, async ({ request }) => {
    await delay(250);
    const cookieHeader = request.headers.get('cookie');
    const cookies = parseCookies(cookieHeader);
    const rt = cookies['refreshToken'];
    if (!rt || !rt.startsWith('rt_')) {
      return HttpResponse.json({ message: 'No refresh' }, { status: 401 });
    }
    const username = decodeURIComponent(rt.slice(3));
    const accessToken = makeAccessToken(username);
    return HttpResponse.json(
      { accessToken },
      { headers: { 'Set-Cookie': makeRefreshCookie(username) } },
    );
  }),

  http.post(API.auth.logout, async ({ request }) => {
    await delay(150);
    const auth = request.headers.get('authorization');
    const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
    if (token) revokedAccessTokens.add(token);
    return new HttpResponse(null, { status: 204, headers: { 'Set-Cookie': CLEAR_REFRESH_COOKIE } });
  }),
];


