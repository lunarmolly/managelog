const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://195.133.76.123:8000/api/v1';

export interface LoginRequest {
  login?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface RegisterRequest {
  email: string;
  login: string;
  password: string;
}

export interface RegisterResponse {
  status: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      data: errorData,
      message: errorData.detail || errorData.message || 'Произошла ошибка',
    };
  }
  return response.json();
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse<LoginResponse>(response);
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<RegisterResponse>(response);
}

export function saveTokens(tokens: { access_token: string; refresh_token: string }): void {
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
}

export function getTokens(): { access_token: string; refresh_token: string } | null {
  const tokens = localStorage.getItem('auth_tokens');
  return tokens ? JSON.parse(tokens) : null;
}

export function clearTokens(): void {
  localStorage.removeItem('auth_tokens');
}

