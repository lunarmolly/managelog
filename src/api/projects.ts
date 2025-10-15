import { fetchJson } from './fetch';
import type { Column, Task } from '../stores/tasks';

const API_BASE = '/api/companies';

export async function getColumns(companyId: string, projectId: string, cursor?: string, limit = 20) {
  const params = new URLSearchParams({ limit: limit.toString() });
  if (cursor) params.set('cursor', cursor);
  return fetchJson<{ columns: Column[]; nextCursor?: string }>(
    `${API_BASE}/${companyId}/projects/${projectId}/columns?${params}`
  );
}

export async function getTasks(companyId: string, projectId: string, columnId: string, cursor?: string, limit = 20) {
  const params = new URLSearchParams({ columnId, limit: limit.toString() });
  if (cursor) params.set('cursor', cursor);
  return fetchJson<{ tasks: Task[]; nextCursor?: string }>(
    `${API_BASE}/${companyId}/projects/${projectId}/tasks?${params}`
  );
}

export async function createColumn(companyId: string, projectId: string, data: { name: string; color?: string }) {
  return fetchJson<{ column: Column }>(
    `${API_BASE}/${companyId}/projects/${projectId}/columns`,
    { method: 'POST', body: JSON.stringify(data) }
  );
}

export async function updateColumn(companyId: string, projectId: string, columnId: string, data: Partial<Column>) {
  return fetchJson<{ column: Column }>(
    `${API_BASE}/${companyId}/projects/${projectId}/columns/${columnId}`,
    { method: 'PATCH', body: JSON.stringify(data) }
  );
}

export async function deleteColumn(companyId: string, projectId: string, columnId: string) {
  return fetchJson<void>(
    `${API_BASE}/${companyId}/projects/${projectId}/columns/${columnId}`,
    { method: 'DELETE' }
  );
}

export async function createTask(companyId: string, projectId: string, data: Partial<Task>) {
  return fetchJson<{ task: Task }>(
    `${API_BASE}/${companyId}/projects/${projectId}/tasks`,
    { method: 'POST', body: JSON.stringify(data) }
  );
}

export async function updateTask(companyId: string, projectId: string, taskId: string, data: Partial<Task>) {
  return fetchJson<{ task: Task }>(
    `${API_BASE}/${companyId}/projects/${projectId}/tasks/${taskId}`,
    { method: 'PATCH', body: JSON.stringify(data) }
  );
}

export async function deleteTask(companyId: string, projectId: string, taskId: string) {
  return fetchJson<void>(
    `${API_BASE}/${companyId}/projects/${projectId}/tasks/${taskId}`,
    { method: 'DELETE' }
  );
}

export async function reorderTasks(companyId: string, projectId: string, columnId: string, taskIds: string[]) {
  return fetchJson<{ ok: boolean; seq: number }>(
    `${API_BASE}/${companyId}/projects/${projectId}/columns/${columnId}/order`,
    { method: 'POST', body: JSON.stringify({ taskIds }) }
  );
}

export async function reorderColumns(companyId: string, projectId: string, columnIds: string[]) {
  return fetchJson<{ ok: boolean; seq: number }>(
    `${API_BASE}/${companyId}/projects/${projectId}/columns/order`,
    { method: 'POST', body: JSON.stringify({ columnIds }) }
  );
}
