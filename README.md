# managelog

Проект состоит из двух отдельных сервисов:
- **API** - Backend сервер на Express.js + TypeScript + MongoDB
- **Frontend** - Vue.js приложение с Tailwind CSS

## Структура проекта

```
managelog/
├── api/              # Backend API сервер
│   ├── src/
│   │   ├── config/   # Конфигурация (база данных и т.д.)
│   │   └── index.ts  # Точка входа API сервера
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # Frontend приложение
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Технологический стек

### API
- Node.js
- Express.js
- TypeScript
- MongoDB 8.2.2 (Mongoose)
- CORS
- Swagger/OpenAPI (документация API)

### Frontend
- Vue.js 3
- TypeScript
- Tailwind CSS
- Vite
- Pinia
- Vue Router

## Установка и запуск

### Предварительные требования

- Node.js (версия 18 или выше)
- MongoDB 8.2.2 (запущенная локально на `mongodb://localhost:27017/`)

### 1. Установка зависимостей

**Из корневой директории (рекомендуется):**
```bash
npm run install:all
```

Или установите зависимости отдельно:
```bash
# Корневая директория
npm install

# API
cd api
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Настройка переменных окружения

#### API
Создайте файл `api/.env` на основе `api/.env.example`:
```bash
# Windows PowerShell
cd api
Copy-Item .env.example .env

# Linux/Mac
cd api
cp .env.example .env
```

Отредактируйте `api/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/managelog
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

#### Frontend
Создайте файл `frontend/.env`:
```bash
# Windows PowerShell
cd frontend
@"
VITE_API_BASE_URL=http://localhost:3000/api/v1
"@ | Out-File -FilePath .env -Encoding utf8

# Linux/Mac
cd frontend
echo "VITE_API_BASE_URL=http://localhost:3000/api/v1" > .env
```

### 3. Запуск сервисов

**Из корневой директории (параллельный запуск):**

```bash
# Запустить оба сервиса одновременно
npm run dev
```

Это запустит:
- **API** на `http://localhost:3000`
- **Frontend** на `http://localhost:5173`

**Отдельный запуск сервисов:**

```bash
# Только API
npm run dev:api

# Только Frontend
npm run dev:frontend
```

**Или из соответствующих папок:**

```bash
# API сервер
cd api
npm run dev

# Frontend сервер (в другом терминале)
cd frontend
npm run dev
```

## Порты по умолчанию

- **API**: `3000`
- **Frontend**: `5173`
- **MongoDB**: `27017`

## API Документация

После запуска API сервера, документация доступна по адресу:
- **Swagger UI**: `http://localhost:3000/api-docs`

Документация включает:
- Описание всех эндпоинтов
- Схемы запросов и ответов
- Примеры использования
- Возможность тестирования API прямо в браузере

## Сборка для production

**Из корневой директории:**
```bash
# Собрать оба проекта
npm run build

# Запустить собранные проекты
npm start
```

**Отдельная сборка:**

```bash
# API
npm run build:api
npm run start:api

# Frontend
npm run build:frontend
npm run start:frontend
```

Результат сборки:
- API: `api/dist/`
- Frontend: `frontend/dist/`

## Разработка

### API
- `npm run dev` - запуск в режиме разработки с hot-reload
- `npm run build` - сборка TypeScript в JavaScript
- `npm start` - запуск собранного приложения
- `npm run typecheck` - проверка типов без сборки

### Frontend
- `npm run dev` - запуск dev-сервера
- `npm run build` - сборка для production
- `npm run preview` - предпросмотр собранного приложения
- `npm run typecheck` - проверка типов
