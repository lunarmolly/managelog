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

    // Валидация размера (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      await fs.unlink(req.file.path).catch(() => {});
      res.status(422).json({
        detail: 'Файл слишком большой',
        errors: {
          avatar: ['Максимальный размер файла: 10MB'],
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
    const metadata = await sharp(req.file.path).metadata();
    const size = Math.min(metadata.width || 800, metadata.height || 800);

    // Обрезаем до квадрата и сжимаем
    await sharp(req.file.path)
      .resize(size, size, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 85 }) // Качество 85% для баланса между размером и качеством
      .toFile(outputPath);

    // Удаляем временный файл
    await fs.unlink(req.file.path).catch(() => {});

    // Сохраняем путь к аватару в БД
    user.avatar = outputFilename;
    await user.save();

    res.json({
      avatar: `/api/v1/avatars/${outputFilename}`,
      message: 'Аватар успешно загружен',
    });
  } catch (error: any) {
    console.error('Upload avatar error:', error);
    
    // Удаляем временный файл в случае ошибки
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    res.status(500).json({
      detail: 'Ошибка при загрузке аватара',
    });
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
      
      user.avatar = undefined;
      await user.save();
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

