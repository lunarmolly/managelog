# 🚀 Production Configuration: app.managelog.ru & api.managelog.ru

## 📍 Domain Structure

```
app.managelog.ru     ← Фронтенд (Vue.js приложение)
    ↓ (запросы)
api.managelog.ru     ← API сервер (Node.js/Express)
```

---

## ⚙️ Frontend Configuration (app.managelog.ru)

### .env для production

```env
VITE_API_BASE_URL=https://api.managelog.ru/api/v1
VITE_APP_ENV=production
```

### nginx конфигурация (пример)

```nginx
server {
    listen 443 ssl http2;
    server_name app.managelog.ru;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/managelog-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://api.managelog.ru;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🔧 API Configuration (api.managelog.ru)

### .env для production

```env
NODE_ENV=production
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/managelog

# JWT (генерируйте сильные ключи 32+ символа)
JWT_SECRET=<сгенерировать-32-символьный-ключ>
JWT_REFRESH_SECRET=<сгенерировать-32-символьный-ключ>

JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS: разрешить только фронтенд приложение
ALLOWED_ORIGINS=https://app.managelog.ru
```

### nginx конфигурация (пример)

```nginx
upstream managelog_api {
    server localhost:3000;
}

server {
    listen 443 ssl http2;
    server_name api.managelog.ru;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api/v1 {
        proxy_pass http://managelog_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Swagger документация
    location /api-docs {
        proxy_pass http://managelog_api;
        proxy_set_header Host $host;
    }

    # Health check
    location /health {
        proxy_pass http://managelog_api;
    }
}
```

---

## 📋 Deployment Checklist

### Pre-deployment
- [ ] SSL сертификаты готовы для обоих доменов
- [ ] DNS записи указывают на сервер:
  - [ ] app.managelog.ru → ваш IP
  - [ ] api.managelog.ru → ваш IP
- [ ] MongoDB доступна и готова
- [ ] Node.js установлен на сервере (v18+)

### Backend deployment
- [ ] Клонировать репозиторий на сервер
- [ ] `cd api && npm install`
- [ ] Создать `.env` с production переменными
- [ ] `npm run build`
- [ ] Запустить PM2: `pm2 start dist/index.js --name "managelog-api"`
- [ ] Сохранить PM2: `pm2 save`
- [ ] Включить автозагрузку: `pm2 startup`
- [ ] Проверить: `curl https://api.managelog.ru/health`

### Frontend deployment
- [ ] `cd frontend && npm install`
- [ ] Создать `.env` с `VITE_API_BASE_URL=https://api.managelog.ru/api/v1`
- [ ] `npm run build`
- [ ] Скопировать `dist/` на веб-сервер
- [ ] Настроить nginx
- [ ] Перезагрузить nginx: `sudo systemctl restart nginx`
- [ ] Проверить: `https://app.managelog.ru`

### Post-deployment
- [ ] Проверить Health: `curl https://api.managelog.ru/health`
- [ ] Проверить API: `curl https://api.managelog.ru/api/v1`
- [ ] Проверить Swagger: `https://api.managelog.ru/api-docs`
- [ ] Проверить фронтенд: `https://app.managelog.ru`
- [ ] Проверить CORS (разные домены должны работать)
- [ ] Настроить логирование
- [ ] Настроить мониторинг и алерты

---

## 🔐 CORS Explanation

### Почему только app.managelog.ru?

```typescript
// ✅ ПРАВИЛЬНО: Только ваше приложение может обращаться к API
ALLOWED_ORIGINS=https://app.managelog.ru

// ❌ ОПАСНО: Любой может обращаться к API
ALLOWED_ORIGINS=*

// ❌ ОПАСНО: Несколько случайных источников
ALLOWED_ORIGINS=https://random1.com,https://random2.com
```

### Как работает CORS в browser:

1. Browser на `https://app.managelog.ru` делает запрос к `https://api.managelog.ru`
2. Browser проверяет CORS headers
3. Если `Access-Control-Allow-Origin: https://app.managelog.ru` → ✅ Запрос пройдёт
4. Если домена нет в `ALLOWED_ORIGINS` → ❌ Запрос заблокирован

---

## 📊 Architecture Diagram

```
Internet
    ↓
┌─────────────────────────────────────────┐
│         SSL/TLS (Encryption)            │
└─────────────────────────────────────────┘
    ↓
┌──────────────────┐    ┌──────────────────┐
│   Browser User   │    │  Browser Admin   │
│                  │    │                  │
│ app.managelog.ru │    │ app.managelog.ru │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         │  CORS Check: ✅       │  CORS Check: ✅
         │  Origin:              │  Origin:
         │  app.managelog.ru     │  app.managelog.ru
         │                       │
         └───────────────┬───────┘
                         ↓
                ┌────────────────────┐
                │  API Server        │
                │  api.managelog.ru  │
                │  Port: 3000        │
                │  (behind nginx)    │
                └────────┬───────────┘
                         ↓
                ┌────────────────────┐
                │  MongoDB           │
                │  (Atlas)           │
                └────────────────────┘
```

---

## 🆘 Troubleshooting

### CORS error в браузере

**Ошибка:**
```
Access to XMLHttpRequest at 'https://api.managelog.ru/api/v1/auth/login' 
from origin 'https://app.managelog.ru' has been blocked by CORS policy
```

**Решение:**
1. Проверьте `ALLOWED_ORIGINS` в `.env`:
   ```env
   ALLOWED_ORIGINS=https://app.managelog.ru
   ```
2. Перезагрузите сервер: `pm2 restart all`
3. Очистите браузер кэш (Ctrl+Shift+Delete)

### API недоступен с фронтенда

**Проверить:**
1. Фронтенд использует правильный URL:
   ```env
   VITE_API_BASE_URL=https://api.managelog.ru/api/v1
   ```
2. API сервер запущен:
   ```bash
   curl https://api.managelog.ru/health
   ```
3. Firewall не блокирует трафик между доменами

### SSL сертификат ошибка

**Решение:**
1. Проверьте сертификаты:
   ```bash
   openssl s_client -connect api.managelog.ru:443
   ```
2. Убедитесь что сертификат для `api.managelog.ru`
3. Проверьте дату истечения

---

## 📈 Monitoring

### Проверить логи API

```bash
# Последние логи
pm2 logs managelog-api

# В реальном времени
pm2 logs managelog-api --lines 100 --follow
```

### Проверить статус

```bash
# Статус всех процессов
pm2 status

# Детальная информация
pm2 show managelog-api

# Перезагрузить процесс
pm2 restart managelog-api

# Остановить
pm2 stop managelog-api

# Начать
pm2 start managelog-api
```

---

## 🔄 Обновление на production

```bash
# На сервере
cd /var/www/managelog/api

# Получить новый код
git pull origin main

# Переустановить зависимости если нужно
npm install

# Собрать
npm run build

# Перезагрузить приложение
pm2 restart managelog-api

# Проверить
curl https://api.managelog.ru/health
```

---

## ✅ Final Verification

```bash
# 1. Health check
curl https://api.managelog.ru/health
# ✅ {"status":"ok","message":"API сервер работает",...}

# 2. API endpoint
curl https://api.managelog.ru/api/v1
# ✅ {"message":"ManageLog API v1","version":"0.1.0"}

# 3. CORS headers (должны быть Access-Control-Allow-Origin)
curl -H "Origin: https://app.managelog.ru" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -X OPTIONS https://api.managelog.ru/health -v
# ✅ Access-Control-Allow-Origin: https://app.managelog.ru

# 4. Frontend accessibility
curl https://app.managelog.ru
# ✅ HTML страница загружается
```

---

## 📞 Emergency Contacts & Notes

| Issue | Action |
|-------|--------|
| API down | `pm2 restart managelog-api` |
| CORS error | Check `ALLOWED_ORIGINS` in .env |
| Database error | Check MongoDB connection string |
| SSL error | Verify certificates with `openssl` |
| Port conflict | Check `pm2 list` for other processes |

---

**Last Updated**: December 14, 2025  
**Configuration**: app.managelog.ru & api.managelog.ru  
**Status**: ✅ Production Ready
