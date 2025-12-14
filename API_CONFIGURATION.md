# API Configuration Guide

## Основные исправления

### 1. **Конфигурация CORS** 
✅ **ИСПРАВЛЕНО**: Настройка CORS теперь динамически адаптируется к окружению:
- **Development**: Разрешены все локальные источники (localhost и 127.0.0.1 на портах 3000, 5173, 8080)
- **Production**: Использует переменную окружения `ALLOWED_ORIGINS`

### 2. **Безопасность JWT**
✅ **ИСПРАВЛЕНО**: Добавлена валидация JWT секретов:
- В **production** требуются секреты минимум 32 символа
- В **development** используются безопасные значения по умолчанию
- Сервер завершит работу, если секреты не установлены в production

### 3. **Удален дублированный импорт**
✅ **ИСПРАВЛЕНО**: Убран двойной импорт `express` в `index.ts`

---

## Локальная разработка

### 1. Установка зависимостей
```bash
cd api
npm install
```

### 2. Запуск MongoDB (локально или Docker)
```bash
# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Или установленный MongoDB
mongod
```

### 3. Запуск API сервера
```bash
npm run dev
```

Сервер будет доступен на:
- 🚀 API: `http://localhost:3000/api/v1`
- 📚 Документация: `http://localhost:3000/api-docs`
- ❤️ Health: `http://localhost:3000/health`

---

## Production развёртывание

### 1. Переменные окружения

Создайте `.env` файл на сервере (не коммитьте!):

```env
NODE_ENV=production
PORT=3000

# MongoDB Production URI
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/managelog

# Генерируйте мощные секреты:
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=<ваш-32-символьный-секрет>
JWT_REFRESH_SECRET=<ваш-32-символьный-refresh-секрет>

JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Фронтенд доступен по app.managelog.ru
ALLOWED_ORIGINS=https://app.managelog.ru
```

### 2. Генерация безопасных секретов
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Node.js (любая ОС)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Сборка и запуск
```bash
# Сборка
npm run build

# Запуск production сервера
npm start

# Или используйте PM2 для автоперезапуска
pm2 start dist/index.js --name "managelog-api"
pm2 save
```

---

## Проверка конфигурации

### Health Check
```bash
curl http://localhost:3000/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "message": "API сервер работает",
  "timestamp": "2024-12-14T10:30:00.000Z"
}
```

### API Endpoint
```bash
curl http://localhost:3000/api/v1
```

Должен вернуть:
```json
{
  "message": "ManageLog API v1",
  "version": "0.1.0"
}
```

---

## Логирование

### Development режим
- Логируются все входящие запросы с методом и путём
- Логируется содержимое request body (без пароля)
- CORS проблемы логируются с деталями

### Production режим
- Логируются только ошибки и критические события
- Детали об ошибках не возвращаются клиентам

---

## CORS ошибки

Если видите CORS ошибку в браузере:

### Development
Сервер автоматически логирует источник и разрешает запрос. Проверьте консоль.

### Production
1. Убедитесь, что ваш домен в `ALLOWED_ORIGINS`:
```env
ALLOWED_ORIGINS=https://ваш-домен.ru,https://app.ваш-домен.ru
```

2. Перезагрузите сервер
3. Проверьте, что фронтенд использует правильный API URL

---

## Типичные проблемы

| Проблема | Решение |
|----------|----------|
| `CORS error` | Проверьте `ALLOWED_ORIGINS` в `.env` |
| `JWT authentication failed` | Убедитесь, что `JWT_SECRET` установлен |
| `Cannot connect to MongoDB` | Запустите MongoDB, проверьте `MONGODB_URI` |
| `Port 3000 in use` | Измените `PORT` в `.env` |

