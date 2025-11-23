import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ManageLog API',
      version: '0.1.0',
      description: 'API документация для ManageLog - системы управления проектами, аналитикой и командой',
      contact: {
        name: 'ManageLog Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Локальный сервер разработки',
      },
      {
        url: 'https://api.managelog.ru',
        description: 'Production сервер',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Введите JWT токен в формате: Bearer {token}',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['password'],
          properties: {
            login: {
              type: 'string',
              description: 'Логин пользователя (3-56 символов)',
              example: 'user123',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email пользователя',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Пароль пользователя (8-24 символа)',
              example: 'password123',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'login', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email пользователя',
              example: 'user@example.com',
            },
            login: {
              type: 'string',
              description: 'Логин пользователя (3-56 символов, только латиница, цифры и символы . _)',
              example: 'user123',
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Пароль пользователя (8-24 символа)',
              example: 'password123',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            tokens: {
              type: 'object',
              properties: {
                access_token: {
                  type: 'string',
                  description: 'JWT access токен (действителен 15 минут)',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                refresh_token: {
                  type: 'string',
                  description: 'JWT refresh токен (действителен 7 дней)',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
          },
        },
        LogoutResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success',
            },
            message: {
              type: 'string',
              example: 'Выход выполнен успешно',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            detail: {
              type: 'string',
              description: 'Описание ошибки',
              example: 'Ошибка валидации',
            },
            errors: {
              type: 'object',
              description: 'Детали ошибок валидации по полям',
              additionalProperties: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
              example: {
                email: ['Некорректный формат email'],
                password: ['Пароль обязателен'],
              },
            },
          },
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
            message: {
              type: 'string',
              example: 'API сервер работает',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: 'Эндпоинты для аутентификации и авторизации',
      },
      {
        name: 'Health',
        description: 'Проверка состояния сервера',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/index.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

