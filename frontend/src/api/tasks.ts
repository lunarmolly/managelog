import { refreshTokens } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export interface UserInfo {
  id: string;
  email: string;
  login: string;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  avatar?: string | null;
}

export interface Column {
  id: string;
  name: string;
  project: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskSubtask {
  name: string;
  isCompleted: boolean;
}

export interface TaskFile {
  name: string;
  url: string;
  size: number;
}

export interface Task {
  id: string;
  name: string;
  description?: string | null;
  project: string;
  column: {
    id: string;
    name: string;
    order: number;
  };
  creator: UserInfo;
  assignee?: UserInfo | null;
  watchers: UserInfo[];
  isCompleted: boolean;
  isImportant?: boolean;
  subtasks: TaskSubtask[];
  files: TaskFile[];
  timeSpent?: number | null;
  deadline?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateRequest {
  name: string;
  description?: string;
  columnId: string;
  creatorId?: string;
  assigneeId?: string;
  watcherIds?: string[];
  subtasks?: TaskSubtask[];
  deadline?: string;
  order?: number;
}

export interface TaskUpdateRequest {
  name?: string;
  description?: string;
  columnId?: string;
  assigneeId?: string;
  watcherIds?: string[];
  subtasks?: TaskSubtask[];
  timeSpent?: number;
  deadline?: string;
  order?: number;
  creatorId?: string; // Смена постановщика
  isImportant?: boolean;
}

export interface ColumnCreateRequest {
  name: string;
  order?: number;
}

export interface ColumnUpdateRequest {
  name?: string;
  order?: number;
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

function getAuthHeaders(): Record<string, string> {
  const tokens = localStorage.getItem('authTokens');
  if (!tokens) {
    return {};
  }

  try {
    const parsedTokens = JSON.parse(tokens);
    if (parsedTokens.access_token) {
      return {
        Authorization: `Bearer ${parsedTokens.access_token}`,
      };
    }
  } catch (error) {
    console.error('Error parsing auth tokens:', error);
  }

  return {};
}

// Columns API

export async function getColumns(projectId: string): Promise<Column[]> {
  return handleRequest<Column[]>(`${API_BASE_URL}/projects/${projectId}/columns`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

export async function createColumn(projectId: string, data: ColumnCreateRequest): Promise<Column> {
  return handleRequest<Column>(`${API_BASE_URL}/projects/${projectId}/columns`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function updateColumn(
  projectId: string,
  columnId: string,
  data: ColumnUpdateRequest
): Promise<Column> {
  return handleRequest<Column>(`${API_BASE_URL}/projects/${projectId}/columns/${columnId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function deleteColumn(projectId: string, columnId: string): Promise<{ message: string }> {
  return handleRequest<{ message: string }>(`${API_BASE_URL}/projects/${projectId}/columns/${columnId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

export async function reorderColumns(projectId: string, columnIds: string[]): Promise<Column[]> {
  return handleRequest<Column[]>(`${API_BASE_URL}/projects/${projectId}/columns/reorder`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ columnIds }),
  });
}

// Tasks API

export async function getTasks(projectId: string): Promise<Task[]> {
  return handleRequest<Task[]>(`${API_BASE_URL}/projects/${projectId}/tasks`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

export async function getTask(projectId: string, taskId: string): Promise<Task> {
  return handleRequest<Task>(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: 'GET',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

export async function createTask(projectId: string, data: TaskCreateRequest): Promise<Task> {
  return handleRequest<Task>(`${API_BASE_URL}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function updateTask(
  projectId: string,
  taskId: string,
  data: TaskUpdateRequest
): Promise<Task> {
  return handleRequest<Task>(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function completeTask(projectId: string, taskId: string, isCompleted: boolean): Promise<Task> {
  return handleRequest<Task>(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}/complete`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isCompleted }),
  });
}

export async function deleteTask(projectId: string, taskId: string): Promise<{ message: string }> {
  return handleRequest<{ message: string }>(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

export async function moveTask(
  projectId: string,
  taskId: string,
  columnId: string,
  order?: number
): Promise<Task> {
  return handleRequest<Task>(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}/move`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ columnId, order }),
  });
}

export async function uploadTaskFile(projectId: string, taskId: string, file: File): Promise<{ file: TaskFile; message: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const headers = getAuthHeaders();
  // Не устанавливаем Content-Type для FormData, браузер сделает это сам с boundary

  return handleRequest<{ file: TaskFile; message: string }>(
    `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}/files`,
    {
      method: 'POST',
      headers,
      body: formData,
    }
  );
}

export async function deleteTaskFile(
  projectId: string,
  taskId: string,
  fileId: string
): Promise<{ message: string }> {
  return handleRequest<{ message: string }>(
    `${API_BASE_URL}/projects/${projectId}/tasks/${taskId}/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    }
  );
}
