import { Router } from 'express';
import {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
} from '../controllers/columnController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router({ mergeParams: true }); // mergeParams для получения projectId из родительского роута

/**
 * @swagger
 * /api/v1/projects/{projectId}/columns:
 *   get:
 *     summary: Получить все колонки проекта
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Список колонок
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа к проекту
 */
router.get('/', authenticateToken, getColumns);

/**
 * @swagger
 * /api/v1/projects/{projectId}/columns:
 *   post:
 *     summary: Создать колонку
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Колонка создана
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа или недостаточно прав
 *       422:
 *         description: Ошибка валидации
 */
router.post('/', authenticateToken, createColumn);

/**
 * @swagger
 * /api/v1/projects/{projectId}/columns/reorder:
 *   patch:
 *     summary: Изменить порядок колонок
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - columnIds
 *             properties:
 *               columnIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Порядок колонок изменен
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа или недостаточно прав
 *       422:
 *         description: Ошибка валидации
 */
router.patch('/reorder', authenticateToken, reorderColumns);

/**
 * @swagger
 * /api/v1/projects/{projectId}/columns/{columnId}:
 *   put:
 *     summary: Обновить колонку
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: columnId
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
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Колонка обновлена
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа или недостаточно прав
 *       404:
 *         description: Колонка не найдена
 *       422:
 *         description: Ошибка валидации
 */
router.put('/:columnId', authenticateToken, updateColumn);

/**
 * @swagger
 * /api/v1/projects/{projectId}/columns/{columnId}:
 *   delete:
 *     summary: Удалить колонку
 *     tags: [Columns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: columnId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Колонка удалена
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа или недостаточно прав
 *       404:
 *         description: Колонка не найдена
 */
router.delete('/:columnId', authenticateToken, deleteColumn);

export default router;
