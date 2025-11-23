const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface Profile {
  id: string;
  email: string;
  login: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  displayName?: string;
  birthDate?: string;
  role?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  displayName?: string;
  birthDate?: string;
  role?: string;
  phone?: string;
  password?: string;
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

function getAuthHeaders(): HeadersInit {
  const tokens = localStorage.getItem('auth_tokens');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (tokens) {
    try {
      const parsedTokens = JSON.parse(tokens);
      if (parsedTokens.access_token) {
        headers['Authorization'] = `Bearer ${parsedTokens.access_token}`;
      }
    } catch (e) {
      console.error('Error parsing tokens:', e);
    }
  }

  return headers;
}

export async function getProfile(): Promise<Profile> {
  return handleRequest<Profile>(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
}

export async function updateProfile(data: ProfileUpdateRequest): Promise<Profile> {
  return handleRequest<Profile>(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

