import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Получить профиль текущего пользователя
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 login:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 middleName:
 *                   type: string
 *                 displayName:
 *                   type: string
 *                 birthDate:
 *                   type: string
 *                   format: date-time
 *                 role:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пользователь не найден
 */
router.get('/', authenticateToken, getProfile);

/**
 * @swagger
 * /api/v1/profile:
 *   put:
 *     summary: Обновить профиль текущего пользователя
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               displayName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Профиль успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 login:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 middleName:
 *                   type: string
 *                 displayName:
 *                   type: string
 *                 birthDate:
 *                   type: string
 *                   format: date-time
 *                 role:
 *                   type: string
 *                 phone:
 *                   type: string
 *       401:
 *         description: Пользователь не авторизован
 *       422:
 *         description: Ошибка валидации
 *       409:
 *         description: Конфликт (например, email уже используется)
 */
router.put('/', authenticateToken, updateProfile);

export default router;

