import { Response } from 'express';
import { Task } from '../models/Task.js';
import { Column } from '../models/Column.js';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TASKS_FILES_DIR = path.join(__dirname, '../../uploads/tasks');

// Вспомогательная функция для проверки доступа к проекту
async function checkProjectAccess(
  userId: string,
  projectId: string
): Promise<{ hasAccess: boolean; isCreator: boolean; isOwnerOrManager: boolean }> {
  const user = await User.findById(userId);
  if (!user) {
    return { hasAccess: false, isCreator: false, isOwnerOrManager: false };
  }

  // Владелец или руководитель компании имеют доступ ко всем проектам
  const isOwnerOrManager = user.companyRole === 'owner' || user.companyRole === 'manager';

  const project = await Project.findById(projectId);
  if (!project) {
    return { hasAccess: false, isCreator: false, isOwnerOrManager };
  }

  const isCreator = project.creator.toString() === userId;
  const isParticipant = project.participants.some(
    (p) => p.toString() === userId
  );

  const hasAccess = isOwnerOrManager || isCreator || isParticipant;

  return { hasAccess, isCreator, isOwnerOrManager };
}

export async function getTasks(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const { hasAccess } = await checkProjectAccess(userId, projectId);

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    const tasks = await Task.find({ project: projectId })
      .populate('creator', 'id email login firstName lastName displayName avatar')
      .populate('assignee', 'id email login firstName lastName displayName avatar')
      .populate('watchers', 'id email login firstName lastName displayName avatar')
      .populate('column', 'id name order')
      .sort({ order: 1 });

    res.json(
      tasks.map((task) => ({
        id: task._id.toString(),
        name: task.name,
        description: task.description || null,
        project: task.project.toString(),
        column: {
          id: (task.column as any)._id.toString(),
          name: (task.column as any).name,
          order: (task.column as any).order,
        },
        creator: {
          id: (task.creator as any)._id.toString(),
          email: (task.creator as any).email,
          login: (task.creator as any).login || '',
          firstName: (task.creator as any).firstName || null,
          lastName: (task.creator as any).lastName || null,
          displayName: (task.creator as any).displayName || (task.creator as any).firstName || null,
          avatar: (task.creator as any).avatar ? `/api/v1/avatars/${(task.creator as any).avatar}` : null,
        },
        assignee: task.assignee
          ? {
              id: (task.assignee as any)._id.toString(),
              email: (task.assignee as any).email,
              login: (task.assignee as any).login || '',
              firstName: (task.assignee as any).firstName || null,
              lastName: (task.assignee as any).lastName || null,
              displayName: (task.assignee as any).displayName || (task.assignee as any).firstName || null,
              avatar: (task.assignee as any).avatar ? `/api/v1/avatars/${(task.assignee as any).avatar}` : null,
            }
          : null,
        watchers: (task.watchers as any[]).map((watcher: any) => ({
          id: watcher._id.toString(),
          email: watcher.email,
          login: watcher.login || '',
          firstName: watcher.firstName || null,
          lastName: watcher.lastName || null,
          displayName: watcher.displayName || watcher.firstName || null,
          avatar: watcher.avatar ? `/api/v1/avatars/${watcher.avatar}` : null,
        })),
        isCompleted: task.isCompleted,
        isImportant: task.isImportant,
        subtasks: task.subtasks,
        files: task.files.map((file) => ({
          name: file.name,
          url: `/api/v1/tasks/files/${path.basename(file.url)}`,
          size: file.size,
        })),
        timeSpent: task.timeSpent || null,
        deadline: task.deadline ? task.deadline.toISOString() : null,
        order: task.order,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      }))
    );
  } catch (error: any) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function getTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    const { hasAccess } = await checkProjectAccess(userId, projectId);

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    const task = await Task.findOne({ _id: taskId, project: projectId })
      .populate('creator', 'id email login firstName lastName displayName avatar')
      .populate('assignee', 'id email login firstName lastName displayName avatar')
      .populate('watchers', 'id email login firstName lastName displayName avatar')
      .populate('column', 'id name order');

    if (!task) {
      res.status(404).json({
        detail: 'Задача не найдена',
      });
      return;
    }

    res.json({
      id: task._id.toString(),
      name: task.name,
      description: task.description || null,
      project: task.project.toString(),
      column: {
        id: (task.column as any)._id.toString(),
        name: (task.column as any).name,
        order: (task.column as any).order,
      },
      creator: {
        id: (task.creator as any)._id.toString(),
        email: (task.creator as any).email,
        login: (task.creator as any).login || '',
        firstName: (task.creator as any).firstName || null,
        lastName: (task.creator as any).lastName || null,
        displayName: (task.creator as any).displayName || (task.creator as any).firstName || null,
        avatar: (task.creator as any).avatar ? `/api/v1/avatars/${(task.creator as any).avatar}` : null,
      },
      assignee: task.assignee
        ? {
            id: (task.assignee as any)._id.toString(),
            email: (task.assignee as any).email,
            login: (task.assignee as any).login || '',
            firstName: (task.assignee as any).firstName || null,
            lastName: (task.assignee as any).lastName || null,
            displayName: (task.assignee as any).displayName || (task.assignee as any).firstName || null,
            avatar: (task.assignee as any).avatar ? `/api/v1/avatars/${(task.assignee as any).avatar}` : null,
          }
        : null,
      watchers: (task.watchers as any[]).map((watcher: any) => ({
        id: watcher._id.toString(),
        email: watcher.email,
        login: watcher.login || '',
        firstName: watcher.firstName || null,
        lastName: watcher.lastName || null,
        displayName: watcher.displayName || watcher.firstName || null,
        avatar: watcher.avatar ? `/api/v1/avatars/${watcher.avatar}` : null,
      })),
      isCompleted: task.isCompleted,
      isImportant: task.isImportant,
      subtasks: task.subtasks,
      files: task.files.map((file) => ({
        name: file.name,
        url: `/api/v1/tasks/files/${path.basename(file.url)}`,
        size: file.size,
      })),
      timeSpent: task.timeSpent || null,
      deadline: task.deadline ? task.deadline.toISOString() : null,
      order: task.order,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Get task error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function createTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const { name, description, columnId, assigneeId, watcherIds, subtasks, deadline, order } = req.body;

    const { hasAccess } = await checkProjectAccess(userId, projectId);

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    // Любой участник проекта может создавать задачи
    if (!name || !name.trim()) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: {
          name: ['Название задачи обязательно'],
        },
      });
      return;
    }

    if (!columnId) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: {
          columnId: ['Колонка обязательна'],
        },
      });
      return;
    }

    // Проверяем, что колонка принадлежит проекту
    const column = await Column.findOne({ _id: columnId, project: projectId });
    if (!column) {
      res.status(404).json({
        detail: 'Колонка не найдена',
      });
      return;
    }

    // Определяем порядок
    let taskOrder = order;
    if (taskOrder === undefined || taskOrder === null) {
      // Находим максимальный order в колонке и добавляем 1
      const maxOrderTask = await Task.findOne({ column: columnId })
        .sort({ order: -1 })
        .limit(1);
      taskOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;
    }

    // Валидация подзадач
    let validatedSubtasks: Array<{ name: string; isCompleted: boolean }> = [];
    if (Array.isArray(subtasks)) {
      validatedSubtasks = subtasks
        .filter((subtask: any) => subtask && subtask.name && typeof subtask.name === 'string')
        .map((subtask: any) => ({
          name: subtask.name.trim(),
          isCompleted: subtask.isCompleted === true,
        }));
    }

    // Валидация наблюдателей
    let validatedWatchers: string[] = [];
    if (Array.isArray(watcherIds)) {
      validatedWatchers = watcherIds.filter(
        (id: any) => id && typeof id === 'string'
      );
    }

    const task = new Task({
      name: name.trim(),
      description: description?.trim() || null,
      project: projectId,
      column: columnId,
      creator: userId,
      assignee: assigneeId || null,
      watchers: validatedWatchers,
      isCompleted: false,
      subtasks: validatedSubtasks,
      files: [],
      timeSpent: null,
      deadline: deadline ? new Date(deadline) : null,
      order: taskOrder,
    });

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('creator', 'id email login firstName lastName displayName avatar')
      .populate('assignee', 'id email login firstName lastName displayName avatar')
      .populate('watchers', 'id email login firstName lastName displayName avatar')
      .populate('column', 'id name order');

    res.status(201).json({
      id: populatedTask!._id.toString(),
      name: populatedTask!.name,
      description: populatedTask!.description || null,
      project: populatedTask!.project.toString(),
      column: {
        id: (populatedTask!.column as any)._id.toString(),
        name: (populatedTask!.column as any).name,
        order: (populatedTask!.column as any).order,
      },
      creator: {
        id: (populatedTask!.creator as any)._id.toString(),
        email: (populatedTask!.creator as any).email,
        login: (populatedTask!.creator as any).login || '',
        firstName: (populatedTask!.creator as any).firstName || null,
        lastName: (populatedTask!.creator as any).lastName || null,
        displayName: (populatedTask!.creator as any).displayName || (populatedTask!.creator as any).firstName || null,
        avatar: (populatedTask!.creator as any).avatar ? `/api/v1/avatars/${(populatedTask!.creator as any).avatar}` : null,
      },
      assignee: populatedTask!.assignee
        ? {
            id: (populatedTask!.assignee as any)._id.toString(),
            email: (populatedTask!.assignee as any).email,
            login: (populatedTask!.assignee as any).login || '',
            firstName: (populatedTask!.assignee as any).firstName || null,
            lastName: (populatedTask!.assignee as any).lastName || null,
            displayName: (populatedTask!.assignee as any).displayName || (populatedTask!.assignee as any).firstName || null,
            avatar: (populatedTask!.assignee as any).avatar ? `/api/v1/avatars/${(populatedTask!.assignee as any).avatar}` : null,
          }
        : null,
      watchers: (populatedTask!.watchers as any[]).map((watcher: any) => ({
        id: watcher._id.toString(),
        email: watcher.email,
        login: watcher.login || '',
        firstName: watcher.firstName || null,
        lastName: watcher.lastName || null,
        displayName: watcher.displayName || watcher.firstName || null,
        avatar: watcher.avatar ? `/api/v1/avatars/${watcher.avatar}` : null,
      })),
      isCompleted: populatedTask!.isCompleted,
      isImportant: populatedTask!.isImportant,
      subtasks: populatedTask!.subtasks,
      files: [],
      timeSpent: populatedTask!.timeSpent || null,
      deadline: populatedTask!.deadline ? populatedTask!.deadline.toISOString() : null,
      order: populatedTask!.order,
      createdAt: populatedTask!.createdAt.toISOString(),
      updatedAt: populatedTask!.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Create task error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function updateTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const {
      name,
      description,
      columnId,
      assigneeId,
      watcherIds,
      subtasks,
      timeSpent,
      deadline,
      order,
      creatorId, // Смена постановщика
      isImportant,
    } = req.body;

    const { hasAccess } = await checkProjectAccess(userId, projectId);

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });

    if (!task) {
      res.status(404).json({
        detail: 'Задача не найдена',
      });
      return;
    }

    // Только постановщик может изменять задачу
    if (task.creator.toString() !== userId) {
      res.status(403).json({
        detail: 'Только постановщик может изменять задачу',
      });
      return;
    }

    // Смена постановщика - только текущий постановщик может сменить себя
    if (creatorId !== undefined && creatorId !== null) {
      if (task.creator.toString() !== userId) {
        res.status(403).json({
          detail: 'Только текущий постановщик может сменить постановщика',
        });
        return;
      }
      task.creator = creatorId as any;
    }

    if (name !== undefined) {
      if (!name || !name.trim()) {
        res.status(422).json({
          detail: 'Ошибка валидации',
          errors: {
            name: ['Название задачи обязательно'],
          },
        });
        return;
      }
      task.name = name.trim();
    }

    if (description !== undefined) {
      task.description = description?.trim() || null;
    }

    if (columnId !== undefined) {
      // Проверяем, что колонка принадлежит проекту
      const column = await Column.findOne({ _id: columnId, project: projectId });
      if (!column) {
        res.status(404).json({
          detail: 'Колонка не найдена',
        });
        return;
      }
      task.column = columnId as any;
    }

    if (assigneeId !== undefined) {
      task.assignee = assigneeId || null;
    }

    if (watcherIds !== undefined) {
      if (Array.isArray(watcherIds)) {
        task.watchers = watcherIds.filter(
          (id: any) => id && typeof id === 'string'
        ) as any[];
      } else {
        task.watchers = [];
      }
    }

    if (subtasks !== undefined) {
      if (Array.isArray(subtasks)) {
        task.subtasks = subtasks
          .filter((subtask: any) => subtask && subtask.name && typeof subtask.name === 'string')
          .map((subtask: any) => ({
            name: subtask.name.trim(),
            isCompleted: subtask.isCompleted === true,
          }));
      } else {
        task.subtasks = [];
      }
    }

    if (timeSpent !== undefined) {
      task.timeSpent = timeSpent !== null && timeSpent >= 0 ? timeSpent : null;
    }

    if (deadline !== undefined) {
      task.deadline = deadline ? new Date(deadline) : null;
    }

    if (order !== undefined && order !== null) {
      task.order = order;
    }

    if (isImportant !== undefined) {
      task.isImportant = isImportant === true;
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('creator', 'id email login firstName lastName displayName avatar')
      .populate('assignee', 'id email login firstName lastName displayName avatar')
      .populate('watchers', 'id email login firstName lastName displayName avatar')
      .populate('column', 'id name order');

    res.json({
      id: populatedTask!._id.toString(),
      name: populatedTask!.name,
      description: populatedTask!.description || null,
      project: populatedTask!.project.toString(),
      column: {
        id: (populatedTask!.column as any)._id.toString(),
        name: (populatedTask!.column as any).name,
        order: (populatedTask!.column as any).order,
      },
      creator: {
        id: (populatedTask!.creator as any)._id.toString(),
        email: (populatedTask!.creator as any).email,
        login: (populatedTask!.creator as any).login || '',
        firstName: (populatedTask!.creator as any).firstName || null,
        lastName: (populatedTask!.creator as any).lastName || null,
        displayName: (populatedTask!.creator as any).displayName || (populatedTask!.creator as any).firstName || null,
        avatar: (populatedTask!.creator as any).avatar ? `/api/v1/avatars/${(populatedTask!.creator as any).avatar}` : null,
      },
      assignee: populatedTask!.assignee
        ? {
            id: (populatedTask!.assignee as any)._id.toString(),
            email: (populatedTask!.assignee as any).email,
            login: (populatedTask!.assignee as any).login || '',
            firstName: (populatedTask!.assignee as any).firstName || null,
            lastName: (populatedTask!.assignee as any).lastName || null,
            displayName: (populatedTask!.assignee as any).displayName || (populatedTask!.assignee as any).firstName || null,
            avatar: (populatedTask!.assignee as any).avatar ? `/api/v1/avatars/${(populatedTask!.assignee as any).avatar}` : null,
          }
        : null,
      watchers: (populatedTask!.watchers as any[]).map((watcher: any) => ({
        id: watcher._id.toString(),
        email: watcher.email,
        login: watcher.login || '',
        firstName: watcher.firstName || null,
        lastName: watcher.lastName || null,
        displayName: watcher.displayName || watcher.firstName || null,
        avatar: watcher.avatar ? `/api/v1/avatars/${watcher.avatar}` : null,
      })),
      isCompleted: populatedTask!.isCompleted,
      isImportant: populatedTask!.isImportant,
      subtasks: populatedTask!.subtasks,
      files: populatedTask!.files.map((file) => ({
        name: file.name,
        url: `/api/v1/tasks/files/${path.basename(file.url)}`,
        size: file.size,
      })),
      timeSpent: populatedTask!.timeSpent || null,
      deadline: populatedTask!.deadline ? populatedTask!.deadline.toISOString() : null,
      order: populatedTask!.order,
      createdAt: populatedTask!.createdAt.toISOString(),
      updatedAt: populatedTask!.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Update task error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function completeTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const { isCompleted } = req.body;

    const { hasAccess } = await checkProjectAccess(userId, projectId);

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });

    if (!task) {
      res.status(404).json({
        detail: 'Задача не найдена',
      });
      return;
    }

    // Только исполнитель может отметить задачу как готовую
    if (!task.assignee || task.assignee.toString() !== userId) {
      res.status(403).json({
        detail: 'Только исполнитель может отметить задачу как готовую',
      });
      return;
    }

    task.isCompleted = isCompleted === true;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('creator', 'id email login firstName lastName displayName avatar')
      .populate('assignee', 'id email login firstName lastName displayName avatar')
      .populate('watchers', 'id email login firstName lastName displayName avatar')
      .populate('column', 'id name order');

    res.json({
      id: populatedTask!._id.toString(),
      name: populatedTask!.name,
      description: populatedTask!.description || null,
      project: populatedTask!.project.toString(),
      column: {
        id: (populatedTask!.column as any)._id.toString(),
        name: (populatedTask!.column as any).name,
        order: (populatedTask!.column as any).order,
      },
      creator: {
        id: (populatedTask!.creator as any)._id.toString(),
        email: (populatedTask!.creator as any).email,
        login: (populatedTask!.creator as any).login || '',
        firstName: (populatedTask!.creator as any).firstName || null,
        lastName: (populatedTask!.creator as any).lastName || null,
        displayName: (populatedTask!.creator as any).displayName || (populatedTask!.creator as any).firstName || null,
        avatar: (populatedTask!.creator as any).avatar ? `/api/v1/avatars/${(populatedTask!.creator as any).avatar}` : null,
      },
      assignee: populatedTask!.assignee
        ? {
            id: (populatedTask!.assignee as any)._id.toString(),
            email: (populatedTask!.assignee as any).email,
            login: (populatedTask!.assignee as any).login || '',
            firstName: (populatedTask!.assignee as any).firstName || null,
            lastName: (populatedTask!.assignee as any).lastName || null,
            displayName: (populatedTask!.assignee as any).displayName || (populatedTask!.assignee as any).firstName || null,
            avatar: (populatedTask!.assignee as any).avatar ? `/api/v1/avatars/${(populatedTask!.assignee as any).avatar}` : null,
          }
        : null,
      watchers: (populatedTask!.watchers as any[]).map((watcher: any) => ({
        id: watcher._id.toString(),
        email: watcher.email,
        login: watcher.login || '',
        firstName: watcher.firstName || null,
        lastName: watcher.lastName || null,
        displayName: watcher.displayName || watcher.firstName || null,
        avatar: watcher.avatar ? `/api/v1/avatars/${watcher.avatar}` : null,
      })),
      isCompleted: populatedTask!.isCompleted,
      isImportant: populatedTask!.isImportant,
      subtasks: populatedTask!.subtasks,
      files: populatedTask!.files.map((file) => ({
        name: file.name,
        url: `/api/v1/tasks/files/${path.basename(file.url)}`,
        size: file.size,
      })),
      timeSpent: populatedTask!.timeSpent || null,
      deadline: populatedTask!.deadline ? populatedTask!.deadline.toISOString() : null,
      order: populatedTask!.order,
      createdAt: populatedTask!.createdAt.toISOString(),
      updatedAt: populatedTask!.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Complete task error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function deleteTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    const { hasAccess } = await checkProjectAccess(userId, projectId);

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });

    if (!task) {
      res.status(404).json({
        detail: 'Задача не найдена',
      });
      return;
    }

    // Только постановщик может удалять задачу
    if (task.creator.toString() !== userId) {
      res.status(403).json({
        detail: 'Только постановщик может удалять задачу',
      });
      return;
    }

    // Удаляем файлы задачи
    for (const file of task.files) {
      try {
        const filePath = path.join(TASKS_FILES_DIR, path.basename(file.url));
        await fs.unlink(filePath).catch(() => {});
      } catch (error) {
        console.error(`Ошибка удаления файла ${file.name}:`, error);
      }
    }

    await Task.deleteOne({ _id: taskId });

    res.json({
      message: 'Задача успешно удалена',
    });
  } catch (error: any) {
    console.error('Delete task error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function moveTask(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const { columnId, order } = req.body;

    const { hasAccess } = await checkProjectAccess(userId, projectId);

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });

    if (!task) {
      res.status(404).json({
        detail: 'Задача не найдена',
      });
      return;
    }

    // Только постановщик может перемещать задачу
    if (task.creator.toString() !== userId) {
      res.status(403).json({
        detail: 'Только постановщик может перемещать задачу',
      });
      return;
    }

    if (columnId) {
      // Проверяем, что колонка принадлежит проекту
      const column = await Column.findOne({ _id: columnId, project: projectId });
      if (!column) {
        res.status(404).json({
          detail: 'Колонка не найдена',
        });
        return;
      }
      task.column = columnId as any;
    }

    if (order !== undefined && order !== null) {
      task.order = order;
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('creator', 'id email login firstName lastName displayName avatar')
      .populate('assignee', 'id email login firstName lastName displayName avatar')
      .populate('watchers', 'id email login firstName lastName displayName avatar')
      .populate('column', 'id name order');

    res.json({
      id: populatedTask!._id.toString(),
      name: populatedTask!.name,
      description: populatedTask!.description || null,
      project: populatedTask!.project.toString(),
      column: {
        id: (populatedTask!.column as any)._id.toString(),
        name: (populatedTask!.column as any).name,
        order: (populatedTask!.column as any).order,
      },
      creator: {
        id: (populatedTask!.creator as any)._id.toString(),
        email: (populatedTask!.creator as any).email,
        login: (populatedTask!.creator as any).login || '',
        firstName: (populatedTask!.creator as any).firstName || null,
        lastName: (populatedTask!.creator as any).lastName || null,
        displayName: (populatedTask!.creator as any).displayName || (populatedTask!.creator as any).firstName || null,
        avatar: (populatedTask!.creator as any).avatar ? `/api/v1/avatars/${(populatedTask!.creator as any).avatar}` : null,
      },
      assignee: populatedTask!.assignee
        ? {
            id: (populatedTask!.assignee as any)._id.toString(),
            email: (populatedTask!.assignee as any).email,
            login: (populatedTask!.assignee as any).login || '',
            firstName: (populatedTask!.assignee as any).firstName || null,
            lastName: (populatedTask!.assignee as any).lastName || null,
            displayName: (populatedTask!.assignee as any).displayName || (populatedTask!.assignee as any).firstName || null,
            avatar: (populatedTask!.assignee as any).avatar ? `/api/v1/avatars/${(populatedTask!.assignee as any).avatar}` : null,
          }
        : null,
      watchers: (populatedTask!.watchers as any[]).map((watcher: any) => ({
        id: watcher._id.toString(),
        email: watcher.email,
        login: watcher.login || '',
        firstName: watcher.firstName || null,
        lastName: watcher.lastName || null,
        displayName: watcher.displayName || watcher.firstName || null,
        avatar: watcher.avatar ? `/api/v1/avatars/${watcher.avatar}` : null,
      })),
      isCompleted: populatedTask!.isCompleted,
      isImportant: populatedTask!.isImportant,
      subtasks: populatedTask!.subtasks,
      files: populatedTask!.files.map((file) => ({
        name: file.name,
        url: `/api/v1/tasks/files/${path.basename(file.url)}`,
        size: file.size,
      })),
      timeSpent: populatedTask!.timeSpent || null,
      deadline: populatedTask!.deadline ? populatedTask!.deadline.toISOString() : null,
      order: populatedTask!.order,
      createdAt: populatedTask!.createdAt.toISOString(),
      updatedAt: populatedTask!.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Move task error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function uploadTaskFile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const taskId = req.params.taskId;

    if (!req.file) {
      res.status(400).json({
        detail: 'Файл не загружен',
        errors: {
          file: ['Файл не загружен'],
        },
      });
      return;
    }

    const { hasAccess } = await checkProjectAccess(userId, projectId);

    if (!hasAccess) {
      // Удаляем загруженный файл
      await fs.unlink(req.file.path).catch(() => {});
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });

    if (!task) {
      await fs.unlink(req.file.path).catch(() => {});
      res.status(404).json({
        detail: 'Задача не найдена',
      });
      return;
    }

    // Только постановщик может загружать файлы
    if (task.creator.toString() !== userId) {
      await fs.unlink(req.file.path).catch(() => {});
      res.status(403).json({
        detail: 'Только постановщик может загружать файлы к задаче',
      });
      return;
    }

    // Перемещаем файл из временной папки в папку задач
    await fs.mkdir(TASKS_FILES_DIR, { recursive: true });
    const filename = `task-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(req.file.originalname)}`;
    const filePath = path.join(TASKS_FILES_DIR, filename);
    await fs.rename(req.file.path, filePath);

    // Добавляем файл в задачу
    task.files.push({
      name: req.file.originalname,
      url: filePath,
      size: req.file.size,
    });

    await task.save();

    res.json({
      file: {
        name: req.file.originalname,
        url: `/api/v1/tasks/files/${filename}`,
        size: req.file.size,
      },
      message: 'Файл успешно загружен',
    });
  } catch (error: any) {
    console.error('Upload task file error:', error);
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function deleteTaskFile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const taskId = req.params.taskId;
    const fileId = req.params.fileId; // Это индекс файла в массиве или имя файла

    const { hasAccess } = await checkProjectAccess(userId, projectId);

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    const task = await Task.findOne({ _id: taskId, project: projectId });

    if (!task) {
      res.status(404).json({
        detail: 'Задача не найдена',
      });
      return;
    }

    // Только постановщик может удалять файлы
    if (task.creator.toString() !== userId) {
      res.status(403).json({
        detail: 'Только постановщик может удалять файлы задачи',
      });
      return;
    }

    // Находим файл по имени или индексу
    const fileIndex = task.files.findIndex(
      (file) => path.basename(file.url) === fileId || file.name === fileId
    );

    if (fileIndex === -1) {
      res.status(404).json({
        detail: 'Файл не найден',
      });
      return;
    }

    const file = task.files[fileIndex];

    // Удаляем файл с диска
    try {
      const filePath = path.join(TASKS_FILES_DIR, path.basename(file.url));
      await fs.unlink(filePath).catch(() => {});
    } catch (error) {
      console.error(`Ошибка удаления файла ${file.name}:`, error);
    }

    // Удаляем файл из массива
    task.files.splice(fileIndex, 1);
    await task.save();

    res.json({
      message: 'Файл успешно удален',
    });
  } catch (error: any) {
    console.error('Delete task file error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}
