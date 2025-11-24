import { refreshTokens } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export type ProjectStatus = 'new' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

export interface UserInfo {
  id: string;
  email: string;
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  avatar?: string | null;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  creator: UserInfo;
  participants: UserInfo[];
  status: ProjectStatus;
  requiresAction: boolean;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCreateRequest {
  name: string;
  description?: string;
  participants?: string[];
  status?: ProjectStatus;
  requiresAction?: boolean;
  icon: string;
  color: string;
}

export interface ProjectUpdateRequest {
  name?: string;
  description?: string;
  participants?: string[];
  status?: ProjectStatus;
  requiresAction?: boolean;
  icon?: string;
  color?: string;
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

/**
 * Получить список проектов пользователя
 */
export async function getProjects(): Promise<Project[]> {
  return handleRequest<Project[]>(`${API_BASE_URL}/projects`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
}

/**
 * Получить проект по ID
 */
export async function getProject(id: string): Promise<Project> {
  return handleRequest<Project>(`${API_BASE_URL}/projects/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
}

/**
 * Создать новый проект
 */
export async function createProject(data: ProjectCreateRequest): Promise<Project> {
  return handleRequest<Project>(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

/**
 * Обновить проект
 */
export async function updateProject(id: string, data: ProjectUpdateRequest): Promise<Project> {
  return handleRequest<Project>(`${API_BASE_URL}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

/**
 * Удалить проект
 */
export async function deleteProject(id: string): Promise<{ message: string }> {
  return handleRequest<{ message: string }>(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

/**
 * Получить общие проекты с пользователем
 */
export async function getCommonProjects(userId: string): Promise<Project[]> {
  return handleRequest<Project[]>(`${API_BASE_URL}/projects/common/${userId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
}

