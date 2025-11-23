import { Router } from 'express';
import { uploadAvatar, deleteAvatar } from '../controllers/avatarController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadAvatar as uploadMiddleware } from '../middleware/upload.js';

const router = Router();

/**
 * @swagger
 * /api/v1/avatar:
 *   post:
 *     summary: Загрузить аватар пользователя
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Аватар успешно загружен
 *       400:
 *         description: Файл не загружен
 *       422:
 *         description: Ошибка валидации (неподдерживаемый формат или размер)
 *       401:
 *         description: Пользователь не авторизован
 */
router.post('/', authenticateToken, uploadMiddleware.single('avatar'), uploadAvatar);

/**
 * @swagger
 * /api/v1/avatar:
 *   delete:
 *     summary: Удалить аватар пользователя
 *     tags: [Avatar]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Аватар успешно удален
 *       401:
 *         description: Пользователь не авторизован
 */
router.delete('/', authenticateToken, deleteAvatar);

// Примечание: получение аватаров обрабатывается через статическую раздачу в index.ts
// Endpoint /api/v1/avatars/{filename} обслуживается express.static

export default router;

