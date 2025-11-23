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

#### API
```bash
cd api
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Настройка переменных окружения

#### API
Создайте файл `api/.env` на основе `api/.env.example`:
```bash
cd api
cp .env.example .env
```

Отредактируйте `api/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/managelog
NODE_ENV=development
```

#### Frontend
Создайте файл `frontend/.env` (если требуется):
```bash
cd frontend
```

Отредактируйте `frontend/.env` и укажите URL API сервера:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 3. Запуск сервисов

API и Frontend запускаются как отдельные сервисы. Откройте два терминала:

#### Терминал 1 - API сервер
```bash
cd api
npm run dev
```

API сервер будет доступен на `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- API endpoint: `http://localhost:3000/api/v1`

#### Терминал 2 - Frontend сервер
```bash
cd frontend
npm run dev
```

Frontend приложение будет доступно на `http://localhost:5173`

## Порты по умолчанию

- **API**: `3000`
- **Frontend**: `5173`
- **MongoDB**: `27017`

## Сборка для production

### API
```bash
cd api
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

Результат сборки будет в папке `frontend/dist/`.

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
