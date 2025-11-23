import { Response } from 'express';
import { User } from '../models/User.js';
import { validateProfileUpdate } from '../utils/validation.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({
        detail: 'Пользователь не найден',
      });
      return;
    }

    res.json({
      id: user._id,
      email: user.email,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      // displayName: если не указан, используем firstName
      displayName: user.displayName || user.firstName || undefined,
      birthDate: user.birthDate,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  
  try {
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    // Валидация данных
    const validation = validateProfileUpdate(req.body);
    if (!validation.isValid) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: validation.errors,
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        detail: 'Пользователь не найден',
      });
      return;
    }

    // Обновление полей
    const updateData: any = {};

    if (req.body.email !== undefined) {
      if (!req.body.email || req.body.email.trim() === '') {
        res.status(422).json({
          detail: 'Ошибка валидации',
          errors: {
            email: ['Email обязателен'],
          },
        });
        return;
      }
      
      const emailLower = req.body.email.toLowerCase().trim();
      
      // Проверка на уникальность email
      const existingUser = await User.findOne({ email: emailLower, _id: { $ne: userId } });
      if (existingUser) {
        res.status(409).json({
          detail: 'Пользователь с таким email уже существует',
          errors: {
            email: ['Пользователь с таким email уже существует'],
          },
        });
        return;
      }
      updateData.email = emailLower;
    }

    if (req.body.firstName !== undefined) {
      const trimmed = req.body.firstName?.trim();
      updateData.firstName = trimmed || undefined;
    }

    if (req.body.lastName !== undefined) {
      const trimmed = req.body.lastName?.trim();
      updateData.lastName = trimmed || undefined;
    }

    // Отчество - можно удалить (пустая строка = null в БД)
    if (req.body.middleName !== undefined) {
      const trimmed = req.body.middleName?.trim();
      updateData.middleName = trimmed && trimmed !== '' ? trimmed : null;
    }

    // Как вас называть - можно изменить или удалить
    if (req.body.displayName !== undefined) {
      const trimmed = req.body.displayName?.trim();
      updateData.displayName = trimmed && trimmed !== '' ? trimmed : null;
    }

    // Дата рождения - можно удалить (пустая строка = null в БД)
    if (req.body.birthDate !== undefined) {
      if (req.body.birthDate && req.body.birthDate !== '') {
        const date = new Date(req.body.birthDate);
        if (isNaN(date.getTime())) {
          res.status(422).json({
            detail: 'Ошибка валидации',
            errors: {
              birthDate: ['Некорректная дата рождения'],
            },
          });
          return;
        }
        updateData.birthDate = date;
      } else {
        updateData.birthDate = null;
      }
    }

    // Роль - можно удалить (пустая строка = null в БД)
    // Всегда обрабатываем role, даже если он пустой (для удаления)
    if (req.body.role !== undefined) {
      if (req.body.role === null || req.body.role === '' || (typeof req.body.role === 'string' && req.body.role.trim() === '')) {
        // Пустая строка или null - удаляем роль
        updateData.role = null;
      } else {
        // Есть значение - сохраняем
        const trimmed = req.body.role.trim();
        updateData.role = trimmed;
      }
    }

    // Телефон - можно удалить (пустая строка = null в БД)
    if (req.body.phone !== undefined) {
      const trimmed = req.body.phone?.trim();
      updateData.phone = trimmed && trimmed !== '' ? trimmed : null;
    }

    // Пароль - обновляется ТОЛЬКО если явно указан и не пустой
    // Если пароль не указан в запросе, вообще не трогаем это поле
    if (req.body.password !== undefined && req.body.password && req.body.password.trim() !== '') {
      const newPassword = req.body.password.trim();
      // Валидация длины пароля перед сохранением
      if (newPassword.length < 8 || newPassword.length > 24) {
        res.status(422).json({
          detail: 'Ошибка валидации',
          errors: {
            password: ['Пароль должен быть от 8 до 24 символов'],
          },
        });
        return;
      }
      updateData.password = newPassword;
    }

    // Обновление displayName по умолчанию: если не указан и есть firstName, используем firstName
    const finalFirstName = updateData.firstName !== undefined ? updateData.firstName : user.firstName;
    if (!updateData.displayName && finalFirstName) {
      if (req.body.displayName === undefined || req.body.displayName === null) {
        updateData.displayName = finalFirstName;
      } else if (req.body.displayName === '' || (req.body.displayName?.trim() === '')) {
        updateData.displayName = finalFirstName;
      }
    }

    // Используем findByIdAndUpdate вместо save, чтобы не валидировать все поля
    // Это позволяет обновлять только указанные поля без проверки пароля, если он не меняется
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { 
        new: true, 
        runValidators: false, // Отключаем валидацию для обновления (валидация уже была в контроллере)
        select: '-password' // Исключаем пароль из результата
      }
    );

    if (!updatedUser) {
      res.status(404).json({
        detail: 'Пользователь не найден после обновления',
      });
      return;
    }

    // Если пароль был изменен, нужно его захешировать отдельно
    if (updateData.password) {
      const userForPasswordUpdate = await User.findById(userId);
      if (userForPasswordUpdate) {
        userForPasswordUpdate.password = updateData.password;
        await userForPasswordUpdate.save(); // Здесь сработает pre-save hook для хеширования
      }
    }

    // Получаем финальную версию пользователя без пароля
    const finalUser = await User.findById(userId).select('-password');
    
    if (!finalUser) {
      res.status(404).json({
        detail: 'Пользователь не найден после обновления',
      });
      return;
    }

    res.json({
      id: finalUser._id,
      email: finalUser.email,
      login: finalUser.login,
      firstName: finalUser.firstName,
      lastName: finalUser.lastName,
      middleName: finalUser.middleName,
      displayName: finalUser.displayName || finalUser.firstName || undefined,
      birthDate: finalUser.birthDate ? finalUser.birthDate.toISOString().split('T')[0] : undefined,
      role: finalUser.role,
      phone: finalUser.phone,
      createdAt: finalUser.createdAt,
      updatedAt: finalUser.updatedAt,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    console.error('Request body:', JSON.stringify(req.body, null, 2));
    console.error('User ID:', userId);

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(409).json({
        detail: `Пользователь с таким ${field === 'email' ? 'email' : 'полем'} уже существует`,
        errors: {
          [field]: [`Пользователь с таким ${field === 'email' ? 'email' : 'полем'} уже существует`],
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

