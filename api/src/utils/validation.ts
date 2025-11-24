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

export function validatePhone(phone: string): boolean {
  return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(phone);
}

export function validateDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
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

  if (!data.firstName) {
    errors.firstName = ['Имя обязательно'];
  } else if (!validateName(data.firstName)) {
    errors.firstName = ['Имя может содержать только буквы кириллицы, латиницы и символ -'];
  }

  if (!data.lastName) {
    errors.lastName = ['Фамилия обязательна'];
  } else if (!validateName(data.lastName)) {
    errors.lastName = ['Фамилия может содержать только буквы кириллицы, латиницы и символ -'];
  }

  if (!data.companyName) {
    errors.companyName = ['Название компании обязательно'];
  } else if (typeof data.companyName !== 'string' || data.companyName.trim().length === 0) {
    errors.companyName = ['Название компании не может быть пустым'];
  } else if (data.companyName.trim().length > 200) {
    errors.companyName = ['Название компании должно быть не более 200 символов'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateProfileUpdate(data: any): { isValid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};

  if (data.email !== undefined) {
    if (!data.email) {
      errors.email = ['Email обязателен'];
    } else if (!validateEmail(data.email)) {
      errors.email = ['Некорректный формат email'];
    }
  }

  if (data.firstName !== undefined && data.firstName && !validateName(data.firstName)) {
    errors.firstName = ['Имя может содержать только буквы кириллицы, латиницы и символ -'];
  }

  if (data.lastName !== undefined && data.lastName && !validateName(data.lastName)) {
    errors.lastName = ['Фамилия может содержать только буквы кириллицы, латиницы и символ -'];
  }

  if (data.middleName !== undefined && data.middleName && !validateName(data.middleName)) {
    errors.middleName = ['Отчество может содержать только буквы кириллицы, латиницы и символ -'];
  }

  if (data.displayName !== undefined && data.displayName && data.displayName.length > 56) {
    errors.displayName = ['Отображаемое имя должно быть не более 56 символов'];
  }

  if (data.birthDate !== undefined && data.birthDate && !validateDate(data.birthDate)) {
    errors.birthDate = ['Некорректная дата рождения'];
  }

  if (data.role !== undefined && data.role && data.role.length > 50) {
    errors.role = ['Роль должна быть не более 50 символов'];
  }

  if (data.phone !== undefined && data.phone && !validatePhone(data.phone)) {
    errors.phone = ['Некорректный формат телефона'];
  }

  if (data.password !== undefined && data.password) {
    if (!validatePassword(data.password)) {
      errors.password = ['Пароль должен содержать только буквы латиницы и специальные символы, от 8 до 24 символов'];
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
