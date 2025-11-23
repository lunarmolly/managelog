import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken, TokenPayload } from '../utils/jwt.js';
import { validateLoginRequest, validateRegisterRequest } from '../utils/validation.js';
import { AuthRequest } from '../middleware/auth.js';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    // Валидация данных
    const validation = validateLoginRequest(req.body);
    if (!validation.isValid) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: validation.errors,
      });
      return;
    }

    const { login, email, password } = req.body;

    // Поиск пользователя по логину или email
    const user = await User.findOne({
      $or: [{ login: login || '' }, { email: email || '' }],
    });

    if (!user) {
      res.status(422).json({
        detail: 'Неверный логин или пароль',
        errors: {
          login: ['Неверный логин или пароль'],
        },
      });
      return;
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(422).json({
        detail: 'Неверный логин или пароль',
        errors: {
          login: ['Неверный логин или пароль'],
        },
      });
      return;
    }

    // Генерация токенов
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      login: user.login,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.json({
      status: 'success',
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    // Валидация данных
    const validation = validateRegisterRequest(req.body);
    if (!validation.isValid) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: validation.errors,
      });
      return;
    }

    const { email, login, password } = req.body;

    // Проверка на существование пользователя
    const existingUser = await User.findOne({
      $or: [{ email }, { login }],
    });

    if (existingUser) {
      res.status(409).json({
        detail: 'Пользователь с таким email или логином уже существует',
        errors: {
          email: existingUser.email === email ? ['Пользователь с таким email уже существует'] : [],
          login: existingUser.login === login ? ['Пользователь с таким логином уже существует'] : [],
        },
      });
      return;
    }

    // Создание нового пользователя
    const user = new User({
      email,
      login,
      password,
    });

    await user.save();

    res.status(201).json({
      status: 'success',
    });
  } catch (error: any) {
    console.error('Register error:', error);

    // Обработка ошибок MongoDB (дубликаты и т.д.)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(409).json({
        detail: `Пользователь с таким ${field === 'email' ? 'email' : 'логином'} уже существует`,
        errors: {
          [field]: [`Пользователь с таким ${field === 'email' ? 'email' : 'логином'} уже существует`],
        },
      });
      return;
    }

    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function logout(req: AuthRequest, res: Response): Promise<void> {
  try {
    // В будущем здесь можно добавить логику инвалидации refresh токена
    // Например, сохранение в черный список или удаление из базы данных

    res.json({
      status: 'success',
      message: 'Выход выполнен успешно',
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

