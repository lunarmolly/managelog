import { refreshTokens } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface CompanyInfo {
  id: string;
  name: string;
  isOwner: boolean;
}

export type CompanyRole = 'owner' | 'manager' | 'employee';

export interface UserInfo {
  id: string;
  email: string;
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  displayName?: string | null;
  birthDate?: string | null;
  role?: string | null;
  phone?: string | null;
  avatar?: string | null;
  company?: CompanyInfo | null;
  companyRole?: CompanyRole | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CompanyUser {
  id: string;
  email: string;
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  displayName?: string | null;
  role?: string | null;
  phone?: string | null;
  avatar?: string | null;
  companyRole?: CompanyRole | null;
}

export interface UserUpdateRequest {
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

async function handleResponse<T>(response: Response, url: string, options: RequestInit, retryCount = 0): Promise<T> {
  if (!response.ok) {
    // Если получили 401 и это первый раз, пытаемся обновить токены
    if (response.status === 401 && retryCount === 0) {
      const refreshed = await refreshTokens();
      if (refreshed) {
        // Обновляем заголовок Authorization с новым токеном
        const newOptions = { ...options };
        const headers = new Headers(newOptions.headers);
        headers.set('Authorization', `Bearer ${refreshed.access_token}`);
        newOptions.headers = headers;
        // Повторяем запрос с новым токеном
        const retryResponse = await fetch(url, newOptions);
        return await handleResponse<T>(retryResponse, url, newOptions, 1);
      }
    }

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
    return await handleResponse<T>(response, url, options);
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
      } else {
        console.warn('Access token not found in stored tokens');
      }
    } catch (e) {
      console.error('Error parsing tokens:', e);
    }
  } else {
    console.warn('No auth tokens found in localStorage');
  }

  return headers;
}

/**
 * Получить информацию о текущем пользователе
 */
export async function getUserInfo(): Promise<UserInfo> {
  return handleRequest<UserInfo>(`${API_BASE_URL}/user`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
}

/**
 * Обновить информацию о текущем пользователе
 */
export async function updateUserInfo(data: UserUpdateRequest): Promise<UserInfo> {
  return handleRequest<UserInfo>(`${API_BASE_URL}/user`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

/**
 * Получить список сотрудников компании
 */
export async function getCompanyUsers(): Promise<CompanyUser[]> {
  return handleRequest<CompanyUser[]>(`${API_BASE_URL}/user/company/users`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
}

/**
 * Получить информацию о пользователе по ID (только сотрудники компании)
 */
export async function getUserById(userId: string): Promise<UserInfo> {
  return handleRequest<UserInfo>(`${API_BASE_URL}/user/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
}

export interface CreateEmployeeRequest {
  email: string;
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  displayName?: string;
  birthDate?: string;
  role?: string;
  phone?: string;
  companyRole: 'owner' | 'manager' | 'employee';
}

export interface CreateEmployeeResponse {
  id: string;
  email: string;
  login: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  companyRole: 'owner' | 'manager' | 'employee';
}

/**
 * Создать нового сотрудника компании (только для owner и manager)
 */
export async function createEmployee(data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
  return handleRequest<CreateEmployeeResponse>(`${API_BASE_URL}/user/company/employees`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

