import { Response } from 'express';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к папке с аватарами
const AVATARS_DIR = path.join(__dirname, '../../uploads/avatars');

// Создаем папку, если её нет
async function ensureAvatarsDir() {
  try {
    await fs.access(AVATARS_DIR);
  } catch {
    await fs.mkdir(AVATARS_DIR, { recursive: true });
  }
}

// Инициализируем папку при загрузке модуля
ensureAvatarsDir();

export async function uploadAvatar(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  
  try {
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        detail: 'Файл не загружен',
        errors: {
          avatar: ['Файл не загружен'],
        },
      });
      return;
    }

    // Валидация типа файла
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      // Удаляем загруженный файл
      await fs.unlink(req.file.path).catch(() => {});
      res.status(422).json({
        detail: 'Неподдерживаемый формат файла',
        errors: {
          avatar: ['Поддерживаются только форматы: JPEG, PNG, WebP'],
        },
      });
      return;
    }

    // Валидация размера (50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (req.file.size > maxSize) {
      await fs.unlink(req.file.path).catch(() => {});
      res.status(422).json({
        detail: 'Файл слишком большой',
        errors: {
          avatar: ['Максимальный размер файла: 50MB'],
        },
      });
      return;
    }

    await ensureAvatarsDir();

    // Получаем пользователя
    const user = await User.findById(userId);
    if (!user) {
      await fs.unlink(req.file.path).catch(() => {});
      res.status(404).json({
        detail: 'Пользователь не найден',
      });
      return;
    }

    // Удаляем старый аватар, если есть
    if (user.avatar) {
      const oldAvatarPath = path.join(AVATARS_DIR, user.avatar);
      await fs.unlink(oldAvatarPath).catch(() => {});
    }

    // Обрабатываем изображение: обрезаем до квадрата 1:1 и сжимаем
    const outputFilename = `${userId}-${Date.now()}.webp`;
    const outputPath = path.join(AVATARS_DIR, outputFilename);

    // Определяем размеры для обрезки (берем минимальную сторону)
    let metadata;
    try {
      metadata = await sharp(req.file.path).metadata();
    } catch (error: any) {
      console.error('Error reading image metadata:', error);
      await fs.unlink(req.file.path).catch(() => {});
      res.status(422).json({
        detail: 'Не удалось прочитать изображение. Проверьте формат файла',
        errors: {
          avatar: ['Файл поврежден или имеет неподдерживаемый формат'],
        },
      });
      return;
    }

    if (!metadata.width || !metadata.height) {
      await fs.unlink(req.file.path).catch(() => {});
      res.status(422).json({
        detail: 'Не удалось определить размеры изображения',
        errors: {
          avatar: ['Файл поврежден или имеет неподдерживаемый формат'],
        },
      });
      return;
    }

    const size = Math.min(metadata.width, metadata.height);

    // Обрезаем до квадрата и сжимаем
    try {
      await sharp(req.file.path)
        .resize(size, size, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 85 }) // Качество 85% для баланса между размером и качеством
        .toFile(outputPath);
    } catch (error: any) {
      console.error('Error processing image with sharp:', error);
      await fs.unlink(req.file.path).catch(() => {});
      res.status(500).json({
        detail: 'Ошибка при обработке изображения',
        errors: {
          avatar: [error.message || 'Не удалось обработать изображение'],
        },
      });
      return;
    }

    // Удаляем временный файл
    await fs.unlink(req.file.path).catch(() => {});

    // Сохраняем путь к аватару в БД
    // Используем findByIdAndUpdate вместо save(), чтобы избежать валидации всех полей (включая пароль)
    await User.findByIdAndUpdate(
      userId,
      { $set: { avatar: outputFilename } },
      { 
        runValidators: false, // Отключаем валидацию, так как обновляем только avatar
        new: false // Не возвращаем обновленный документ
      }
    );

    res.json({
      avatar: `/api/v1/avatars/${outputFilename}`,
      message: 'Аватар успешно загружен',
    });
  } catch (error: any) {
    console.error('Upload avatar error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // Удаляем временный файл в случае ошибки
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    // Удаляем выходной файл, если он был создан
    if (req.file && userId) {
      const outputFilename = `${userId}-${Date.now()}.webp`;
      const outputPath = path.join(AVATARS_DIR, outputFilename);
      await fs.unlink(outputPath).catch(() => {});
    }

    // Форматируем ошибку валидации Mongoose, если это ошибка валидации
    let errorMessage = 'Ошибка при загрузке аватара';
    let errorDetail: any = {
      detail: errorMessage,
    };

    if (error.name === 'ValidationError') {
      // Ошибка валидации Mongoose
      const validationErrors: Record<string, string[]> = {};
      Object.keys(error.errors || {}).forEach((key) => {
        validationErrors[key] = [error.errors[key].message];
      });
      
      errorDetail = {
        detail: 'Ошибка валидации данных',
        errors: validationErrors,
      };
      
      // Если ошибка связана с аватаром, добавляем в errors.avatar
      if (!validationErrors.avatar && Object.keys(validationErrors).length > 0) {
        const firstError = Object.values(validationErrors)[0];
        errorDetail.errors.avatar = firstError;
      }
    } else {
      errorMessage = process.env.NODE_ENV === 'development' 
        ? error.message || 'Ошибка при загрузке аватара'
        : 'Ошибка при загрузке аватара';
      
      errorDetail = {
        detail: errorMessage,
        errors: {
          avatar: [errorMessage],
        },
        ...(process.env.NODE_ENV === 'development' && {
          error: error.toString(),
          stack: error.stack,
        }),
      };
    }

    res.status(500).json(errorDetail);
  }
}

export async function deleteAvatar(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  
  try {
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
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

    // Удаляем файл аватара, если есть
    if (user.avatar) {
      const avatarPath = path.join(AVATARS_DIR, user.avatar);
      await fs.unlink(avatarPath).catch(() => {});
      
      // Используем findByIdAndUpdate вместо save(), чтобы избежать валидации всех полей
      await User.findByIdAndUpdate(
        userId,
        { $unset: { avatar: '' } },
        { 
          runValidators: false, // Отключаем валидацию
          new: false
        }
      );
    }

    res.json({
      message: 'Аватар успешно удален',
    });
  } catch (error: any) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      detail: 'Ошибка при удалении аватара',
    });
  }
}

// Функция getAvatar удалена - используется статическая раздача через express.static в index.ts

