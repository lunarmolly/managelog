import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS - разрешаем все источники в режиме разработки
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // В режиме разработки разрешаем все источники
    if (process.env.NODE_ENV === 'development' || !origin) {
      callback(null, true);
    } else {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Обработка preflight OPTIONS запросов ДО CORS
app.options('*', cors(corsOptions));

app.use(cors(corsOptions));

// Логирование запросов в режиме разработки
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body ? JSON.stringify(req.body) : '');
    next();
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
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

