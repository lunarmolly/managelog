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
      displayName: user.displayName || user.firstName || user.login,
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
  try {
    const userId = req.user?.userId;
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
      // Проверка на уникальность email
      const existingUser = await User.findOne({ email: req.body.email, _id: { $ne: userId } });
      if (existingUser) {
        res.status(409).json({
          detail: 'Пользователь с таким email уже существует',
          errors: {
            email: ['Пользователь с таким email уже существует'],
          },
        });
        return;
      }
      updateData.email = req.body.email.toLowerCase().trim();
    }

    if (req.body.firstName !== undefined) {
      updateData.firstName = req.body.firstName.trim() || undefined;
    }

    if (req.body.lastName !== undefined) {
      updateData.lastName = req.body.lastName.trim() || undefined;
    }

    if (req.body.middleName !== undefined) {
      updateData.middleName = req.body.middleName.trim() || undefined;
    }

    if (req.body.displayName !== undefined) {
      updateData.displayName = req.body.displayName.trim() || undefined;
    }

    if (req.body.birthDate !== undefined) {
      updateData.birthDate = req.body.birthDate ? new Date(req.body.birthDate) : undefined;
    }

    if (req.body.role !== undefined) {
      updateData.role = req.body.role.trim() || undefined;
    }

    if (req.body.phone !== undefined) {
      updateData.phone = req.body.phone.trim() || undefined;
    }

    if (req.body.password !== undefined && req.body.password) {
      updateData.password = req.body.password;
    }

    // Обновление displayName по умолчанию, если не указан
    if (!updateData.displayName && updateData.firstName) {
      updateData.displayName = updateData.firstName;
    } else if (!updateData.displayName && !user.displayName && updateData.firstName) {
      updateData.displayName = updateData.firstName;
    }

    // Применение обновлений
    Object.assign(user, updateData);
    await user.save();

    // Возврат обновленного профиля без пароля
    const updatedUser = await User.findById(userId).select('-password');

    res.json({
      id: updatedUser!._id,
      email: updatedUser!.email,
      login: updatedUser!.login,
      firstName: updatedUser!.firstName,
      lastName: updatedUser!.lastName,
      middleName: updatedUser!.middleName,
      displayName: updatedUser!.displayName || updatedUser!.firstName || updatedUser!.login,
      birthDate: updatedUser!.birthDate,
      role: updatedUser!.role,
      phone: updatedUser!.phone,
      createdAt: updatedUser!.createdAt,
      updatedAt: updatedUser!.updatedAt,
    });
  } catch (error: any) {
    console.error('Update profile error:', error);

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

    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

