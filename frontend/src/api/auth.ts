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
  companyName: string;
}

export interface RegisterResponse {
  status: string;
  tokens?: {
    access_token: string;
    refresh_token: string;
  };
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
    console.log('Отправка запроса:', { 
      url, 
      method: options.method, 
      headers: options.headers,
      hasBody: !!options.body 
    });
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // Таймаут 10 секунд
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      mode: 'cors',
      cache: 'no-cache',
    });
    
    clearTimeout(timeoutId);
    
    console.log('Получен ответ:', { 
      status: response.status, 
      statusText: response.statusText, 
      url,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    return await handleResponse<T>(response);
  } catch (error: any) {
    console.error('Ошибка запроса:', error);
    console.error('Тип ошибки:', error.name);
    console.error('Сообщение ошибки:', error.message);
    
    // Обработка сетевых ошибок
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
      const errorMessage = `Не удалось подключиться к серверу API (${url}). 
Проверьте:
1. Запущен ли API сервер на порту 3000 (http://localhost:3000/health)
2. Правильно ли настроен VITE_API_BASE_URL в .env файле (текущее значение: ${API_BASE_URL})
3. Нет ли проблем с CORS
4. Не блокирует ли браузер запрос`;
      
      throw {
        status: 0,
        data: {
          detail: errorMessage,
        },
        message: 'Ошибка подключения к серверу',
      };
    }
    
    // Обработка таймаута
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw {
        status: 0,
        data: {
          detail: 'Превышено время ожидания ответа от сервера. Проверьте, что API сервер запущен и доступен.',
        },
        message: 'Таймаут запроса',
      };
    }
    
    throw error;
  }
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const url = `${API_BASE_URL}/auth/login/`;
  console.log('Вход: отправка запроса на', url);
  return handleRequest<LoginResponse>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const url = `${API_BASE_URL}/auth/register/`;
  console.log('Регистрация: отправка запроса на', url);
  console.log('Данные регистрации:', { ...data, password: '***' });
  console.log('API_BASE_URL:', API_BASE_URL);
  
  return handleRequest<RegisterResponse>(url, {
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

export async function refreshTokens(): Promise<{ access_token: string; refresh_token: string } | null> {
  const tokens = getTokens();
  if (!tokens || !tokens.refresh_token) {
    return null;
  }

  try {
    const response = await handleRequest<LoginResponse>(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: tokens.refresh_token,
      }),
    });

    if (response.tokens) {
      saveTokens(response.tokens);
      return response.tokens;
    }
    return null;
  } catch (error) {
    console.error('Refresh tokens error:', error);
    clearTokens();
    return null;
  }
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

