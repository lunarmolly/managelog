# managelog

## Деплой

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите ваш API URL:
```
VITE_API_BASE_URL=http://your-api-host:port/api/v1
```

### 3. Сборка проекта
```bash
npm run build
```

Результат сборки будет в папке `dist/`.

### 4. Запуск dev-сервера (для разработки)
```bash
npm run dev
```
