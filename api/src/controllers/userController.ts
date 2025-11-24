import { Response } from 'express';
import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { validateProfileUpdate } from '../utils/validation.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getUserInfo(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const user = await User.findById(userId).select('-password').populate('company', 'name owner');
    if (!user) {
      res.status(404).json({
        detail: 'Пользователь не найден',
      });
      return;
    }

    // Email обязателен в модели, поэтому он всегда должен быть
    if (!user.email) {
      console.error('Ошибка: у пользователя отсутствует email', { userId: user._id });
      res.status(500).json({
        detail: 'Ошибка: у пользователя отсутствует email',
      });
      return;
    }
    
    // Форматируем birthDate в строку формата YYYY-MM-DD, если она есть
    let birthDateFormatted: string | null = null;
    if (user.birthDate) {
      const date = new Date(user.birthDate);
      if (!isNaN(date.getTime())) {
        birthDateFormatted = date.toISOString().split('T')[0];
      }
    }

    // Получаем информацию о компании
    let companyInfo = null;
    if (user.company) {
      const company = user.company as any;
      companyInfo = {
        id: company._id.toString(),
        name: company.name,
        isOwner: company.owner?.toString() === userId,
      };
    }
    
    res.json({
      id: user._id.toString(),
      email: user.email,
      login: user.login || '',
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      middleName: user.middleName || null,
      displayName: user.displayName || user.firstName || null,
      birthDate: birthDateFormatted,
      role: user.role || null,
      phone: user.phone || null,
      avatar: user.avatar ? `/api/v1/avatars/${user.avatar}` : null,
      company: companyInfo,
      createdAt: user.createdAt ? user.createdAt.toISOString() : null,
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    });
  } catch (error: any) {
    console.error('Get user info error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function getCompanyUsers(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const user = await User.findById(userId).select('company');
    if (!user || !user.company) {
      res.status(404).json({
        detail: 'Пользователь не привязан к компании',
      });
      return;
    }

    // Получаем всех участников компании
    const company = await Company.findById(user.company).populate('members', 'id email login firstName lastName displayName avatar role');
    if (!company) {
      res.status(404).json({
        detail: 'Компания не найдена',
      });
      return;
    }

    // Формируем список пользователей
    const users = (company.members as any[]).map((member: any) => ({
      id: member._id.toString(),
      email: member.email,
      login: member.login || '',
      firstName: member.firstName || null,
      lastName: member.lastName || null,
      displayName: member.displayName || member.firstName || null,
      role: member.role || null,
      avatar: member.avatar ? `/api/v1/avatars/${member.avatar}` : null,
    }));

    res.json(users);
  } catch (error: any) {
    console.error('Get company users error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function updateUserInfo(req: AuthRequest, res: Response): Promise<void> {
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
    if (req.body.role !== undefined) {
      if (req.body.role === null || req.body.role === '' || (typeof req.body.role === 'string' && req.body.role.trim() === '')) {
        updateData.role = null;
      } else {
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
    if (req.body.password !== undefined && req.body.password && req.body.password.trim() !== '') {
      const newPassword = req.body.password.trim();
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

    // Если пароль был изменен, нужно его захешировать через save() (pre-save hook)
    let finalUser;
    
    if (updateData.password) {
      const userForUpdate = await User.findById(userId);
      if (!userForUpdate) {
        res.status(404).json({
          detail: 'Пользователь не найден',
        });
        return;
      }
      
      const passwordToUpdate = updateData.password;
      delete updateData.password;
      
      if (Object.keys(updateData).length > 0) {
        await User.findByIdAndUpdate(
          userId,
          { $set: updateData },
          { 
            runValidators: false
          }
        );
      }
      
      userForUpdate.password = passwordToUpdate;
      await userForUpdate.save();
      
      finalUser = await User.findById(userId).select('-password');
    } else {
      finalUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { 
          new: true, 
          runValidators: false,
          select: '-password'
        }
      );
    }

    if (!finalUser) {
      res.status(404).json({
        detail: 'Пользователь не найден после обновления',
      });
      return;
    }

    if (!finalUser.email) {
      console.error('Ошибка: у пользователя отсутствует email после обновления', { userId: finalUser._id });
      res.status(500).json({
        detail: 'Ошибка: у пользователя отсутствует email',
      });
      return;
    }
    
    let birthDateFormatted: string | null = null;
    if (finalUser.birthDate) {
      const date = new Date(finalUser.birthDate);
      if (!isNaN(date.getTime())) {
        birthDateFormatted = date.toISOString().split('T')[0];
      }
    }
    
    res.json({
      id: finalUser._id.toString(),
      email: finalUser.email,
      login: finalUser.login || '',
      firstName: finalUser.firstName || null,
      lastName: finalUser.lastName || null,
      middleName: finalUser.middleName || null,
      displayName: finalUser.displayName || finalUser.firstName || null,
      birthDate: birthDateFormatted,
      role: finalUser.role || null,
      phone: finalUser.phone || null,
      avatar: finalUser.avatar ? `/api/v1/avatars/${finalUser.avatar}` : null,
      createdAt: finalUser.createdAt ? finalUser.createdAt.toISOString() : null,
      updatedAt: finalUser.updatedAt ? finalUser.updatedAt.toISOString() : null,
    });
  } catch (error: any) {
    console.error('Update user info error:', error);
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

