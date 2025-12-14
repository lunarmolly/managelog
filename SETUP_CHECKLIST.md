# 🚀 Checklist: Установка и запуск ManageLog

## ✅ Development Setup

### Backend (API)
- [ ] Перейти в папку: `cd api`
- [ ] Установить зависимости: `npm install`
- [ ] Создать `.env` файл из `.env.example` (или использовать defaults)
- [ ] Убедиться, что MongoDB запущена (localhost:27017)
- [ ] Запустить dev сервер: `npm run dev`
- [ ] Проверить: http://localhost:3000/health

### Frontend
- [ ] Перейти в папку: `cd frontend`
- [ ] Установить зависимости: `npm install`
- [ ] Создать `.env` файл из `.env.example`
- [ ] Убедиться, что API сервер запущен на :3000
- [ ] Запустить dev сервер: `npm run dev`
- [ ] Проверить: http://localhost:5173

---

## ✅ Production Deployment

### Pre-Deployment Checklist
- [ ] Изменить `NODE_ENV` на `production`
- [ ] Генерировать безопасные JWT секреты (минимум 32 символа)
- [ ] Установить переменные окружения на сервере
- [ ] Убедиться, что MongoDB доступна (MongoDB Atlas или локальный сервер)
- [ ] Настроить CORS (указать точные домены в `ALLOWED_ORIGINS`)

### Backend Build & Deploy
- [ ] Запустить: `npm run build`
- [ ] Проверить ошибки compilation: нет ошибок?
- [ ] Переместить `.env` на сервер (НЕ коммитить!)
- [ ] Запустить: `npm start`
- [ ] Проверить: `curl https://yourdomain.com/health`

### Frontend Build & Deploy
- [ ] Обновить `VITE_API_BASE_URL` на production API URL
- [ ] Запустить: `npm run build`
- [ ] Результат в папке: `dist/`
- [ ] Раздать static файлы через nginx/apache/CDN
- [ ] Проверить: https://yourdomain.com

---

## 🔍 Verification Steps

### API Endpoints to Test
```bash
# Health check
curl http://localhost:3000/health

# API version
curl http://localhost:3000/api/v1

# Swagger docs
open http://localhost:3000/api-docs

# Login (example)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"testuser","password":"password123"}'
```

### Common Issues & Solutions
| Проблема | Решение |
|----------|----------|
| CORS error | Проверьте `ALLOWED_ORIGINS` в `.env` |
| Cannot connect to DB | Убедитесь MongoDB запущена |
| Port already in use | Измените `PORT` в `.env` |
| JWT validation failed | Проверьте `JWT_SECRET` установлен |
| "Cannot find module" | Запустите `npm install` |

---

## 📋 Environment Variables Reference

### API (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/managelog
JWT_SECRET=dev-secret-key-not-for-production-12345
JWT_REFRESH_SECRET=dev-refresh-secret-key-not-for-production-12345
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://managelog.ru,https://app.managelog.ru
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_ENV=development
```

---

## 🆘 Support Resources

- **API Documentation**: http://localhost:3000/api-docs
- **Configuration Guide**: See `API_CONFIGURATION.md`
- **Issues Summary**: See `FIXES_SUMMARY.md`
- **Git**: Check commits for detailed changes

---

## 📌 Important Notes

1. **JWT Secrets in Production**: 
   - Минимум 32 символа
   - Генерируйте разные ключи для SECRET и REFRESH_SECRET
   - Никогда не коммитьте `.env` файл

2. **Database**:
   - Development: MongoDB на localhost
   - Production: Используйте MongoDB Atlas или управляемый сервис

3. **CORS in Production**:
   - Укажите точные домены в `ALLOWED_ORIGINS`
   - Не используйте `*` (все источники)

4. **Logging**:
   - Development: подробное логирование
   - Production: только ошибки для безопасности
