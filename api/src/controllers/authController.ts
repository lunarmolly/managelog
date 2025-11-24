import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt.js';
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
    
    // Логирование для отладки (только в режиме разработки)
    if (process.env.NODE_ENV === 'development') {
      console.log('Проверка пароля:', {
        userId: user._id,
        login: user.login,
        email: user.email,
        passwordProvided: password ? 'да' : 'нет',
        passwordLength: password?.length || 0,
        isPasswordValid,
        storedPasswordHash: user.password ? `${user.password.substring(0, 20)}...` : 'отсутствует',
      });
    }
    
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
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);

    // В режиме разработки возвращаем детальную информацию об ошибке
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Внутренняя ошибка сервера'
      : 'Внутренняя ошибка сервера';

    res.status(500).json({
      detail: errorMessage,
      ...(process.env.NODE_ENV === 'development' && {
        error: error.toString(),
        stack: error.stack,
      }),
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

    const { email, login, password, firstName, lastName, companyName } = req.body;

    // Проверка на существование пользователя (логин и email должны быть уникальны)
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

    // Проверка на существование компании (название должно быть уникальным)
    const existingCompany = await Company.findOne({
      name: companyName.trim(),
    });

    if (existingCompany) {
      res.status(409).json({
        detail: 'Компания с таким названием уже существует',
        errors: {
          companyName: ['Компания с таким названием уже существует'],
        },
      });
      return;
    }

    // Создание компании (обязательно при регистрации)
    if (!companyName || !companyName.trim()) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: {
          companyName: ['Название компании обязательно'],
        },
      });
      return;
    }

    // Создание нового пользователя (без компании пока)
    const user = new User({
      email,
      login,
      password,
      firstName: firstName?.trim() || undefined,
      lastName: lastName?.trim() || undefined,
      // displayName будет установлен автоматически в pre-save hook на основе firstName
    });

    await user.save();

    // Создание компании с уже установленным владельцем
    const company = new Company({
      name: companyName.trim(),
      owner: user._id,
      members: [user._id],
    });

    await company.save();

    // Обновляем пользователя - привязываем к компании и устанавливаем роль владельца
    user.company = company._id;
    user.companyRole = 'owner';
    await user.save();

    // Автоматическая авторизация после регистрации
    const tokenPayload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      login: user.login,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    res.status(201).json({
      status: 'success',
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);

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

    // В режиме разработки возвращаем детальную информацию об ошибке
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message || 'Внутренняя ошибка сервера'
      : 'Внутренняя ошибка сервера';

    res.status(500).json({
      detail: errorMessage,
      ...(process.env.NODE_ENV === 'development' && {
        error: error.toString(),
        stack: error.stack,
      }),
    });
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({
        detail: 'Refresh токен не предоставлен',
      });
      return;
    }

    try {
      // Проверяем refresh токен
      const decoded = verifyRefreshToken(refresh_token);
      
      // Проверяем, что пользователь существует
      const user = await User.findById(decoded.userId);
      if (!user) {
        res.status(401).json({
          detail: 'Пользователь не найден',
        });
        return;
      }

      // Генерируем новые токены
      const tokenPayload: TokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        login: user.login,
      };

      const accessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      res.json({
        status: 'success',
        tokens: {
          access_token: accessToken,
          refresh_token: newRefreshToken,
        },
      });
    } catch (error: any) {
      res.status(403).json({
        detail: 'Недействительный или истекший refresh токен',
      });
    }
  } catch (error: any) {
    console.error('Refresh error:', error);
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

