import jwt from 'jsonwebtoken';

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// Валидация JWT секретов
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!isDevelopment) {
  if (!JWT_SECRET || JWT_SECRET.length < 32) {
    console.error('❌ ОШИБКА: JWT_SECRET не установлен или слишком короткий (минимум 32 символа)');
    process.exit(1);
  }
  if (!JWT_REFRESH_SECRET || JWT_REFRESH_SECRET.length < 32) {
    console.error('❌ ОШИБКА: JWT_REFRESH_SECRET не установлен или слишком короткий (минимум 32 символа)');
    process.exit(1);
  }
} else {
  // Для разработки используем значения по умолчанию
  if (!JWT_SECRET) {
    console.warn('⚠️  JWT_SECRET не установлен, используется значение по умолчанию для разработки');
  }
  if (!JWT_REFRESH_SECRET) {
    console.warn('⚠️  JWT_REFRESH_SECRET не установлен, используется значение по умолчанию для разработки');
  }
}

const JWT_SECRET_SAFE = JWT_SECRET || 'dev-secret-key-not-for-production-12345';
const JWT_REFRESH_SECRET_SAFE = JWT_REFRESH_SECRET || 'dev-refresh-secret-key-not-for-production-12345';
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  login: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET_SAFE, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET_SAFE, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET_SAFE) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET_SAFE) as TokenPayload;
}

