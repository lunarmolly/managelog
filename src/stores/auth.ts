import { defineStore } from 'pinia';
import { API } from '../api/endpoints';
import type { User, AuthLoginRequest, AuthLoginResponse, AuthRegisterRequest, AuthRegisterResponse, AuthRefreshResponse, MeResponse } from '../api/types';
import { fetchJson } from '../api/fetch';

type AuthState = {
  user: User | null;
  accessToken: string | null; // в памяти, но при старте восстановим из localStorage копию
  authInitialized: boolean;
  isRefreshing: boolean;
  refreshTimerId: number | null;
};

function parseJwtExp(token: string | null): number | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1] || ''));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

function scheduleRefreshIfNeeded(getToken: () => string | null, refresh: () => Promise<void>, setTimer: (id: number | null) => void) {
  const token = getToken();
  const exp = parseJwtExp(token);
  if (!exp) return;
  const nowSec = Math.floor(Date.now() / 1000);
  const delaySec = Math.max(exp - nowSec - 15, 1); // рефреш за 15с до exp
  const id = window.setTimeout(() => { void refresh(); }, delaySec * 1000);
  setTimer(id);
}

const STORAGE_USER = 'ml_user';
const STORAGE_TOKEN_BACKUP = 'ml_access_backup';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    accessToken: null,
    authInitialized: false,
    isRefreshing: false,
    refreshTimerId: null,
  }),
  getters: {
    isAuthenticated: (s) => Boolean(s.user && s.accessToken),
  },
  actions: {
    setAccessToken(token: string | null) {
      this.accessToken = token;
      if (token) localStorage.setItem(STORAGE_TOKEN_BACKUP, token);
      scheduleRefreshIfNeeded(() => this.accessToken, this.refresh, (id) => { this.refreshTimerId = id; });
    },
    setUser(user: User | null) {
      this.user = user;
      if (user) localStorage.setItem(STORAGE_USER, JSON.stringify(user));
      else localStorage.removeItem(STORAGE_USER);
    },
    async initFromStorage() {
      try {
        const userRaw = localStorage.getItem(STORAGE_USER);
        const tokenBackup = localStorage.getItem(STORAGE_TOKEN_BACKUP);
        if (userRaw) this.user = JSON.parse(userRaw);
        if (tokenBackup) this.accessToken = tokenBackup;

        if (this.accessToken) {
          try {
            const me = await fetchJson<MeResponse>(API.auth.me);
            this.setUser(me.user);
          } catch {
            this.setUser(null);
            this.setAccessToken(null);
          }
        }
      } finally {
        this.authInitialized = true; // не мигать UI при refresh
        scheduleRefreshIfNeeded(() => this.accessToken, this.refresh, (id) => { this.refreshTimerId = id; });
      }
    },
    async login(payload: AuthLoginRequest) {
      const res = await fetchJson<AuthLoginResponse>(API.auth.login, { method: 'POST', body: JSON.stringify(payload) });
      this.setAccessToken(res.accessToken);
      this.setUser(res.user);
    },
    async register(payload: AuthRegisterRequest) {
      const res = await fetchJson<AuthRegisterResponse>(API.auth.register, { method: 'POST', body: JSON.stringify(payload) });
      this.setAccessToken(res.accessToken);
      this.setUser(res.user);
    },
    async refresh() {
      if (this.isRefreshing) return; // синхронизация на уровне стора
      this.isRefreshing = true;
      try {
        const res = await fetchJson<AuthRefreshResponse>(API.auth.refresh, { method: 'POST' });
        this.setAccessToken(res.accessToken);
      } catch (e) {
        await this.logout();
        throw e;
      } finally {
        this.isRefreshing = false;
      }
    },
    async logout() {
      try { await fetchJson<void>(API.auth.logout, { method: 'POST' }); } catch {}
      this.setUser(null);
      this.setAccessToken(null);
      if (this.refreshTimerId) {
        clearTimeout(this.refreshTimerId);
        this.refreshTimerId = null;
      }
      localStorage.removeItem(STORAGE_TOKEN_BACKUP);
    },
  },
});


