import { Router } from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Получить список проектов пользователя
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список проектов
 *       401:
 *         description: Пользователь не авторизован
 */
router.get('/', authenticateToken, getProjects);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     summary: Получить проект по ID
 *     tags: [Projects]
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
 *         description: Проект
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа к проекту
 *       404:
 *         description: Проект не найден
 */
router.get('/:id', authenticateToken, getProject);

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Создать новый проект
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - icon
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [new, in_progress, completed, on_hold, cancelled]
 *               requiresAction:
 *                 type: boolean
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Проект создан
 *       422:
 *         description: Ошибка валидации
 */
router.post('/', authenticateToken, createProject);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   put:
 *     summary: Обновить проект
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [new, in_progress, completed, on_hold, cancelled]
 *               requiresAction:
 *                 type: boolean
 *               icon:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Проект обновлен
 *       403:
 *         description: Только создатель может изменять проект
 *       404:
 *         description: Проект не найден
 */
router.put('/:id', authenticateToken, updateProject);

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   delete:
 *     summary: Удалить проект
 *     tags: [Projects]
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
 *         description: Проект удален
 *       403:
 *         description: Только создатель может удалить проект
 *       404:
 *         description: Проект не найден
 */
router.delete('/:id', authenticateToken, deleteProject);

export default router;

