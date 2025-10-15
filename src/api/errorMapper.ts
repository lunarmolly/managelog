export class HttpError extends Error {
  status: number;
  body?: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export function mapHttpError(status: number, body?: any): HttpError {
  if (status === 401 || status === 419) {
    return new HttpError(status, 'Сессия истекла. Пожалуйста, войдите снова.', body);
  }
  if (status === 400) {
    const msg = body?.message || 'Некорректный запрос';
    return new HttpError(status, msg, body);
  }
  if (status === 403) return new HttpError(status, 'Доступ запрещен', body);
  if (status === 404) return new HttpError(status, 'Не найдено', body);
  if (status >= 500) return new HttpError(status, 'Сервер недоступен. Повторите позже.', body);
  return new HttpError(status, 'Ошибка запроса', body);
}


