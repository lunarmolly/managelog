export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function validateLogin(login: string): boolean {
  return /^[a-zA-Z0-9._]+$/.test(login) && login.length >= 3 && login.length <= 56;
}

export function validatePassword(password: string): boolean {
  return /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(password) && password.length >= 8 && password.length <= 24;
}

export function validateName(name: string): boolean {
  return /^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(name) && name.length <= 24;
}

export function validateLoginRequest(data: any): { isValid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};

  if (!data.login && !data.email) {
    errors.login = ['Логин или email обязательны'];
    errors.email = ['Логин или email обязательны'];
  }

  if (data.email && !validateEmail(data.email)) {
    errors.email = ['Некорректный формат email'];
  }

  if (data.login && !validateLogin(data.login)) {
    errors.login = ['Логин должен содержать только буквы латиницы, цифры и символы . _ и быть от 3 до 56 символов'];
  }

  if (!data.password) {
    errors.password = ['Пароль обязателен'];
  } else if (!validatePassword(data.password)) {
    errors.password = ['Пароль должен содержать только буквы латиницы и специальные символы, от 8 до 24 символов'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRegisterRequest(data: any): { isValid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};

  if (!data.email) {
    errors.email = ['Email обязателен'];
  } else if (!validateEmail(data.email)) {
    errors.email = ['Некорректный формат email'];
  }

  if (!data.login) {
    errors.login = ['Логин обязателен'];
  } else if (!validateLogin(data.login)) {
    errors.login = ['Логин должен содержать только буквы латиницы, цифры и символы . _ и быть от 3 до 56 символов'];
  }

  if (!data.password) {
    errors.password = ['Пароль обязателен'];
  } else if (!validatePassword(data.password)) {
    errors.password = ['Пароль должен содержать только буквы латиницы и специальные символы, от 8 до 24 символов'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

