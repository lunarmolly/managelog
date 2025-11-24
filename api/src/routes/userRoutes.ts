import { Router } from 'express';
import { getUserInfo, updateUserInfo, getCompanyUsers, getUserById, createEmployee } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Получить информацию о текущем пользователе
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Информация о пользователе
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
 *                 avatar:
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
router.get('/', authenticateToken, getUserInfo);

/**
 * @swagger
 * /api/v1/user:
 *   put:
 *     summary: Обновить информацию о текущем пользователе
 *     tags: [User]
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
 *         description: Информация о пользователе успешно обновлена
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
 *                 avatar:
 *                   type: string
 *       401:
 *         description: Пользователь не авторизован
 *       422:
 *         description: Ошибка валидации
 *       409:
 *         description: Конфликт (например, email уже используется)
 */
router.put('/', authenticateToken, updateUserInfo);

/**
 * @swagger
 * /api/v1/user/company/users:
 *   get:
 *     summary: Получить список сотрудников компании
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список сотрудников компании
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   login:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   displayName:
 *                     type: string
 *                   role:
 *                     type: string
 *                   avatar:
 *                     type: string
 *       401:
 *         description: Пользователь не авторизован
 *       404:
 *         description: Пользователь не привязан к компании
 */
router.get('/company/users', authenticateToken, getCompanyUsers);

/**
 * @swagger
 * /api/v1/user/company/employees:
 *   post:
 *     summary: Создать нового сотрудника компании (только для owner и manager)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - login
 *               - password
 *               - firstName
 *               - lastName
 *               - companyRole
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
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
 *               companyRole:
 *                 type: string
 *                 enum: [owner, manager, employee]
 *     responses:
 *       201:
 *         description: Сотрудник успешно создан
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет прав для создания сотрудников
 *       422:
 *         description: Ошибка валидации
 *       409:
 *         description: Пользователь с таким email или логином уже существует
 */
router.post('/company/employees', authenticateToken, createEmployee);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Получить информацию о пользователе по ID (только сотрудники компании)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Информация о пользователе
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа к информации о пользователе
 *       404:
 *         description: Пользователь не найден
 */
router.get('/:id', authenticateToken, getUserById);

export default router;

