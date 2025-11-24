import { Router } from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  completeTask,
  deleteTask,
  moveTask,
  uploadTaskFile,
  deleteTaskFile,
} from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadTaskFile as uploadMiddleware } from '../middleware/upload.js';

const router = Router({ mergeParams: true }); // mergeParams для получения projectId из родительского роута

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks:
 *   get:
 *     summary: Получить все задачи проекта
 *     tags: [Tasks]
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
 *         description: Список задач
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа к проекту
 */
router.get('/', authenticateToken, getTasks);

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks:
 *   post:
 *     summary: Создать задачу
 *     tags: [Tasks]
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
 *               - columnId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               columnId:
 *                 type: string
 *               assigneeId:
 *                 type: string
 *               watcherIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               subtasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     isCompleted:
 *                       type: boolean
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Задача создана
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа к проекту
 *       422:
 *         description: Ошибка валидации
 */
router.post('/', authenticateToken, createTask);

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks/{taskId}:
 *   get:
 *     summary: Получить задачу
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Задача
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа к проекту
 *       404:
 *         description: Задача не найдена
 */
router.get('/:taskId', authenticateToken, getTask);

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks/{taskId}:
 *   put:
 *     summary: Обновить задачу (только постановщик)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
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
 *               columnId:
 *                 type: string
 *               assigneeId:
 *                 type: string
 *               watcherIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               subtasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     isCompleted:
 *                       type: boolean
 *               timeSpent:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               order:
 *                 type: number
 *               creatorId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Задача обновлена
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа или недостаточно прав
 *       404:
 *         description: Задача не найдена
 *       422:
 *         description: Ошибка валидации
 */
router.put('/:taskId', authenticateToken, updateTask);

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks/{taskId}/complete:
 *   patch:
 *     summary: Отметить задачу как готовую (только исполнитель)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
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
 *               - isCompleted
 *             properties:
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Статус задачи обновлен
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа или недостаточно прав
 *       404:
 *         description: Задача не найдена
 */
router.patch('/:taskId/complete', authenticateToken, completeTask);

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks/{taskId}:
 *   delete:
 *     summary: Удалить задачу (только постановщик)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Задача удалена
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа или недостаточно прав
 *       404:
 *         description: Задача не найдена
 */
router.delete('/:taskId', authenticateToken, deleteTask);

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks/{taskId}/move:
 *   patch:
 *     summary: Переместить задачу в другую колонку (только постановщик)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               columnId:
 *                 type: string
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Задача перемещена
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа или недостаточно прав
 *       404:
 *         description: Задача или колонка не найдена
 */
router.patch('/:taskId/move', authenticateToken, moveTask);

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks/{taskId}/files:
 *   post:
 *     summary: Загрузить файл к задаче (только постановщик, до 10мб)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Файл загружен
 *       400:
 *         description: Файл не загружен
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа или недостаточно прав
 *       404:
 *         description: Задача не найдена
 */
router.post('/:taskId/files', authenticateToken, uploadMiddleware.single('file'), uploadTaskFile);

/**
 * @swagger
 * /api/v1/projects/{projectId}/tasks/{taskId}/files/{fileId}:
 *   delete:
 *     summary: Удалить файл задачи (только постановщик)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Файл удален
 *       401:
 *         description: Пользователь не авторизован
 *       403:
 *         description: Нет доступа или недостаточно прав
 *       404:
 *         description: Задача или файл не найдены
 */
router.delete('/:taskId/files/:fileId', authenticateToken, deleteTaskFile);

export default router;
