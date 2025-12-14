import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import avatarRoutes from './routes/avatarRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import columnRoutes from './routes/columnRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка окружения
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// Получаем список разрешённых источников из переменных окружения
const getAllowedOrigins = (): (string | RegExp)[] => {
  if (isDevelopment) {
    // В режиме разработки разрешаем локальные источники
    return [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
    ];
  }

  // В режиме production используем переменные окружения
  // Пример: https://app.managelog.ru (фронтенд на этом домене)
  const allowedOrigins = process.env.ALLOWED_ORIGINS || 'https://app.managelog.ru';
  return allowedOrigins
    .split(',')
    .map((origin: string) => origin.trim())
    .filter((origin: string) => origin.length > 0);
};

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = getAllowedOrigins();
    
    // Разрешаем запросы без origin (например, мобильные приложения, Postman)
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else if (isDevelopment) {
      // В разработке логируем нераз решённые источники
      console.warn(`[CORS] Нераз решённый источник: ${origin}`);
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 204,
  maxAge: 86400, // 24 часа кэширования preflight
};

// Применяем CORS ПЕРВЫМ middleware
app.use(cors(corsOptions));

// Обработка preflight OPTIONS запросов
app.options('*', cors(corsOptions));

// Дополнительная обработка для всех маршрутов
app.use((req, res, next) => {
  // Логирование всех входящих запросов в режиме разработки
  if (isDevelopment) {
    console.log(`[CORS] ${req.method} ${req.path} - Origin: ${req.headers.origin || 'не указан'}`);
  }
  next();
});

// Парсинг JSON и URL-encoded данных ДО логирования
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Логирование запросов в режиме разработки
if (isDevelopment) {
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    if (req.body && Object.keys(req.body).length > 0) {
      // Не логируем пароль в открытом виде
      const logBody = { ...req.body };
      if (logBody.password) {
        logBody.password = '***';
      }
      console.log('Body:', JSON.stringify(logBody, null, 2));
    }
    if (req.headers.authorization) {
      console.log('Authorization:', req.headers.authorization.substring(0, 20) + '...');
    }
    next();
  });
}

// Swagger документация
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ManageLog API Documentation',
}));

// Health check endpoint
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Проверка состояния сервера
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Сервер работает
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'API сервер работает',
    timestamp: new Date().toISOString(),
  });
});

// Базовый API endpoint
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'ManageLog API v1',
    version: '0.1.0',
  });
});

// Роуты авторизации
app.use('/api/v1/auth', authRoutes);

// Роуты профиля
app.use('/api/v1/profile', profileRoutes);

// Роуты аватара
app.use('/api/v1/avatar', avatarRoutes);

// Роуты пользователя
app.use('/api/v1/user', userRoutes);

// Роуты проектов
app.use('/api/v1/projects', projectRoutes);

// Роуты задач (вложенные в проекты)
app.use('/api/v1/projects/:projectId/tasks', taskRoutes);

// Роуты колонок (вложенные в проекты)
app.use('/api/v1/projects/:projectId/columns', columnRoutes);

// Статическая раздача аватаров (должна быть ДО роутов аватара, чтобы не конфликтовать)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/api/v1/avatars', express.static(path.join(__dirname, '../uploads/avatars')));

// Статическая раздача файлов задач
app.use('/api/v1/tasks/files', express.static(path.join(__dirname, '../uploads/tasks')));

// Обработка 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Маршрут не найден',
    path: req.path,
  });
});

// Обработка ошибок
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error('Ошибка:', err);
  res.status(500).json({
    error: 'Внутренняя ошибка сервера',
    message: isDevelopment ? err.message : undefined,
  });
});

// Запуск сервера
const startServer = async () => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 API сервер запущен на порту ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API endpoint: http://localhost:${PORT}/api/v1`);
      console.log(`📚 API документация: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Ошибка запуска сервера:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM получен, завершение работы...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT получен, завершение работы...');
  await disconnectDatabase();
  process.exit(0);
});

startServer();

