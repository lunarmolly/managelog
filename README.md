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

## Решение проблем

### Ошибка подключения к API серверу

Если вы видите ошибку "Не удалось подключиться к серверу API", проверьте:

1. **API сервер запущен:**
   ```bash
   # Проверьте, что API сервер запущен на порту 3000
   curl http://localhost:3000/health
   # Должен вернуть: {"status":"ok","message":"API сервер работает",...}
   ```

2. **Файл `.env` во фронтенде создан:**
   ```bash
   # Убедитесь, что файл frontend/.env существует и содержит:
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   ```
   
   **Важно:** После создания или изменения `.env` файла, перезапустите фронтенд сервер!

3. **MongoDB запущена:**
   ```bash
   # Убедитесь, что MongoDB запущена на порту 27017
   # Windows (если установлена как служба):
   # MongoDB должна быть запущена автоматически
   
   # Linux/Mac:
   sudo systemctl status mongod
   # или
   brew services list | grep mongodb
   ```

4. **CORS настроен правильно:**
   - API сервер автоматически разрешает все запросы в режиме разработки
   - Если проблемы остаются, проверьте консоль браузера на наличие ошибок CORS

5. **Проверьте порты:**
   - API должен быть на порту **3000**
   - Frontend должен быть на порту **5173**
   - Убедитесь, что порты не заняты другими приложениями

### Типичные ошибки

**"Failed to fetch" или "NetworkError":**
- API сервер не запущен или недоступен
- Проверьте, что сервер запущен: `cd api && npm run dev`

**"CORS policy" ошибка:**
- Убедитесь, что API сервер запущен в режиме разработки
- Проверьте настройки CORS в `api/src/index.ts`

**"MongoDB connection error":**
- Убедитесь, что MongoDB запущена
- Проверьте `MONGODB_URI` в `api/.env`

## Деплой в production через Nginx

### Предварительные требования

- Сервер с Ubuntu/Debian (или другой Linux дистрибутив)
- Node.js 18+ установлен
- MongoDB установлена и запущена
- Nginx установлен
- Доменное имя (опционально, для SSL)
- Права sudo/root

### 1. Подготовка сервера

#### Установка Node.js (если не установлен)

```bash
# Используя NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка версии
node --version
npm --version
```

#### Установка MongoDB (если не установлена)

```bash
# Добавление репозитория MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-8.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

# Установка
sudo apt-get update
sudo apt-get install -y mongodb-org

# Запуск MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Установка Nginx

```bash
sudo apt-get update
sudo apt-get install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Развертывание API

#### 2.1. Клонирование и установка зависимостей

```bash
# Перейдите в директорию для приложений
cd /var/www

# Клонируйте репозиторий (или загрузите файлы)
git clone <your-repo-url> managelog
# или
# Загрузите файлы через scp/sftp

cd managelog/api
npm install --production
```

#### 2.2. Настройка переменных окружения API

Создайте файл `api/.env`:

```bash
cd /var/www/managelog/api
nano .env
```

Содержимое `.env`:

```env
# Порт для API сервера (внутренний, nginx будет проксировать)
PORT=3000

# MongoDB URI
# Для локальной MongoDB:
MONGODB_URI=mongodb://localhost:27017/managelog
# Для удаленной MongoDB:
# MONGODB_URI=mongodb://username:password@host:27017/managelog?authSource=admin

# Режим работы
NODE_ENV=production

# JWT секреты (ОБЯЗАТЕЛЬНО измените на случайные строки!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-min-32-characters-long-change-in-production

# Время жизни токенов
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Важно:** Сгенерируйте безопасные секреты для JWT:

```bash
# Генерация случайных секретов
openssl rand -base64 32
# Выполните дважды для JWT_SECRET и JWT_REFRESH_SECRET
```

#### 2.3. Сборка API

```bash
cd /var/www/managelog/api
npm run build
```

#### 2.4. Настройка systemd для автозапуска API

Создайте файл сервиса:

```bash
sudo nano /etc/systemd/system/managelog-api.service
```

Содержимое:

```ini
[Unit]
Description=ManageLog API Server
After=network.target mongod.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/managelog/api
Environment="NODE_ENV=production"
EnvironmentFile=/var/www/managelog/api/.env
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=managelog-api

[Install]
WantedBy=multi-user.target
```

Запустите сервис:

```bash
# Перезагрузите systemd
sudo systemctl daemon-reload

# Включите автозапуск
sudo systemctl enable managelog-api

# Запустите сервис
sudo systemctl start managelog-api

# Проверьте статус
sudo systemctl status managelog-api

# Просмотр логов
sudo journalctl -u managelog-api -f
```

### 3. Развертывание Frontend

#### 3.1. Установка зависимостей и сборка

```bash
cd /var/www/managelog/frontend
npm install
npm run build
```

Результат сборки будет в `frontend/dist/`

#### 3.2. Настройка переменных окружения Frontend

Создайте файл `frontend/.env.production`:

```bash
cd /var/www/managelog/frontend
nano .env.production
```

Содержимое `.env.production`:

```env
# URL API сервера (будет проксироваться через nginx)
# Если API на том же домене:
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
# Или если API на поддомене:
# VITE_API_BASE_URL=https://yourdomain.com/api/v1
```

**Важно:** После изменения `.env.production` нужно пересобрать frontend:

```bash
cd /var/www/managelog/frontend
npm run build
```

### 4. Настройка Nginx

#### 4.1. Конфигурация для API

Создайте файл конфигурации:

```bash
sudo nano /etc/nginx/sites-available/managelog-api
```

Содержимое (вариант 1 - API на поддомене):

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Редирект на HTTPS (если используете SSL)
    # return 301 https://$server_name$request_uri;

    # Для начала можно использовать HTTP, затем настроить SSL

    # Увеличение размера загружаемых файлов (для аватаров)
    client_max_body_size 10M;

    # Проксирование на API сервер
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Статические файлы аватаров
    location /api/v1/avatars {
        alias /var/www/managelog/api/uploads/avatars;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Содержимое (вариант 2 - API на том же домене, путь `/api`):

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Увеличение размера загружаемых файлов
    client_max_body_size 10M;

    # Проксирование API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Статические файлы аватаров
    location /api/v1/avatars {
        alias /var/www/managelog/api/uploads/avatars;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend (см. следующий раздел)
    location / {
        root /var/www/managelog/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }
}
```

#### 4.2. Конфигурация для Frontend

Если API и Frontend на одном домене (вариант 2 выше), добавьте в тот же файл блок `location /`.

Если Frontend на отдельном домене, создайте отдельный файл:

```bash
sudo nano /etc/nginx/sites-available/managelog-frontend
```

Содержимое:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/managelog/frontend/dist;
    index index.html;

    # SPA роутинг - все запросы на index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Без кэширования для index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
}
```

#### 4.3. Активация конфигураций

```bash
# Создайте символические ссылки
sudo ln -s /etc/nginx/sites-available/managelog-api /etc/nginx/sites-enabled/
# Если Frontend отдельно:
sudo ln -s /etc/nginx/sites-available/managelog-frontend /etc/nginx/sites-enabled/

# Проверьте конфигурацию
sudo nginx -t

# Перезагрузите nginx
sudo systemctl reload nginx
```

### 5. Настройка SSL (Let's Encrypt)

```bash
# Установка Certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Получение сертификата для домена
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Автоматическое обновление
sudo certbot renew --dry-run
```

Certbot автоматически обновит конфигурацию nginx для использования HTTPS.

### 6. Обновление переменных окружения после SSL

После настройки SSL обновите `.env.production` во frontend:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
# или
VITE_API_BASE_URL=https://yourdomain.com/api/v1
```

Пересоберите frontend:

```bash
cd /var/www/managelog/frontend
npm run build
```

### 7. Настройка прав доступа

```bash
# Установите правильного владельца
sudo chown -R www-data:www-data /var/www/managelog

# Установите права на директории
sudo find /var/www/managelog -type d -exec chmod 755 {} \;

# Установите права на файлы
sudo find /var/www/managelog -type f -exec chmod 644 {} \;

# Права на директорию загрузок
sudo chmod -R 755 /var/www/managelog/api/uploads
```

### 8. Полезные команды

#### Управление API сервисом

```bash
# Статус
sudo systemctl status managelog-api

# Запуск
sudo systemctl start managelog-api

# Остановка
sudo systemctl stop managelog-api

# Перезапуск
sudo systemctl restart managelog-api

# Логи
sudo journalctl -u managelog-api -f
```

#### Управление Nginx

```bash
# Проверка конфигурации
sudo nginx -t

# Перезагрузка
sudo systemctl reload nginx

# Перезапуск
sudo systemctl restart nginx

# Логи
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

#### Обновление приложения

```bash
# 1. Обновите код (git pull или загрузите новые файлы)
cd /var/www/managelog

# 2. API
cd api
npm install --production
npm run build
sudo systemctl restart managelog-api

# 3. Frontend
cd ../frontend
npm install
# Обновите .env.production если нужно
npm run build
sudo systemctl reload nginx
```

### 9. Проверка работоспособности

```bash
# Проверка API
curl http://localhost:3000/health
# или через nginx
curl http://yourdomain.com/api/v1/health

# Проверка Frontend
curl http://yourdomain.com
```

### 10. Резервное копирование

#### MongoDB

```bash
# Создание бэкапа
mongodump --uri="mongodb://localhost:27017/managelog" --out=/backup/managelog-$(date +%Y%m%d)

# Восстановление
mongorestore --uri="mongodb://localhost:27017/managelog" /backup/managelog-YYYYMMDD
```

#### Файлы загрузок

```bash
# Бэкап аватаров
tar -czf /backup/uploads-$(date +%Y%m%d).tar.gz /var/www/managelog/api/uploads
```

### Переменные окружения - Сводка

#### API (`api/.env`)

| Переменная | Описание | Пример |
|------------|----------|--------|
| `PORT` | Порт API сервера (внутренний) | `3000` |
| `MONGODB_URI` | URI подключения к MongoDB | `mongodb://localhost:27017/managelog` |
| `NODE_ENV` | Режим работы | `production` |
| `JWT_SECRET` | Секрет для access токенов | Случайная строка 32+ символов |
| `JWT_REFRESH_SECRET` | Секрет для refresh токенов | Случайная строка 32+ символов |
| `JWT_ACCESS_EXPIRES_IN` | Время жизни access токена | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Время жизни refresh токена | `7d` |

#### Frontend (`frontend/.env.production`)

| Переменная | Описание | Пример |
|------------|----------|--------|
| `VITE_API_BASE_URL` | Полный URL API сервера | `https://api.yourdomain.com/api/v1` |

**Важно:** После изменения `.env.production` необходимо пересобрать frontend!
