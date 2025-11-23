const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

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
  firstName: string;
  lastName: string;
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

async function handleRequest<T>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    return await handleResponse<T>(response);
  } catch (error: any) {
    // Обработка сетевых ошибок
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw {
        status: 0,
        data: {
          detail: 'Не удалось подключиться к серверу. Убедитесь, что API сервер запущен на http://localhost:3000',
        },
        message: 'Ошибка подключения к серверу',
      };
    }
    throw error;
  }
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  return handleRequest<LoginResponse>(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return handleRequest<RegisterResponse>(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
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

export async function logout(): Promise<void> {
  const tokens = getTokens();
  if (!tokens) {
    return;
  }

  try {
    await handleRequest<void>(`${API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
  } catch (error) {
    // Игнорируем ошибки при logout, все равно очищаем токены локально
    console.error('Logout error:', error);
  } finally {
    clearTokens();
  }
}

