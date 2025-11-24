import { Response } from 'express';
import { Column } from '../models/Column.js';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';

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

export async function getColumns(req: AuthRequest, res: Response): Promise<void> {
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

    const columns = await Column.find({ project: projectId }).sort({ order: 1 });

    res.json(
      columns.map((column) => ({
        id: column._id.toString(),
        name: column.name,
        project: column.project.toString(),
        order: column.order,
        createdAt: column.createdAt.toISOString(),
        updatedAt: column.updatedAt.toISOString(),
      }))
    );
  } catch (error: any) {
    console.error('Get columns error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function createColumn(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const { name, order } = req.body;

    const { hasAccess, isCreator, isOwnerOrManager } = await checkProjectAccess(
      userId,
      projectId
    );

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    // Только руководитель проекта или владелец/руководитель компании могут создавать колонки
    if (!isCreator && !isOwnerOrManager) {
      res.status(403).json({
        detail: 'Только руководитель проекта или владелец/руководитель компании могут создавать колонки',
      });
      return;
    }

    if (!name || !name.trim()) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: {
          name: ['Название колонки обязательно'],
        },
      });
      return;
    }

    // Определяем порядок
    let columnOrder = order;
    if (columnOrder === undefined || columnOrder === null) {
      // Находим максимальный order и добавляем 1
      const maxOrderColumn = await Column.findOne({ project: projectId })
        .sort({ order: -1 })
        .limit(1);
      columnOrder = maxOrderColumn ? maxOrderColumn.order + 1 : 0;
    }

    const column = new Column({
      name: name.trim(),
      project: projectId,
      order: columnOrder,
    });

    await column.save();

    res.status(201).json({
      id: column._id.toString(),
      name: column.name,
      project: column.project.toString(),
      order: column.order,
      createdAt: column.createdAt.toISOString(),
      updatedAt: column.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Create column error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function updateColumn(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const columnId = req.params.columnId;
    const { name, order } = req.body;

    const { hasAccess, isCreator, isOwnerOrManager } = await checkProjectAccess(
      userId,
      projectId
    );

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    // Только руководитель проекта или владелец/руководитель компании могут обновлять колонки
    if (!isCreator && !isOwnerOrManager) {
      res.status(403).json({
        detail: 'Только руководитель проекта или владелец/руководитель компании могут обновлять колонки',
      });
      return;
    }

    const column = await Column.findOne({ _id: columnId, project: projectId });

    if (!column) {
      res.status(404).json({
        detail: 'Колонка не найдена',
      });
      return;
    }

    if (name !== undefined) {
      if (!name || !name.trim()) {
        res.status(422).json({
          detail: 'Ошибка валидации',
          errors: {
            name: ['Название колонки обязательно'],
          },
        });
        return;
      }
      column.name = name.trim();
    }

    if (order !== undefined && order !== null) {
      column.order = order;
    }

    await column.save();

    res.json({
      id: column._id.toString(),
      name: column.name,
      project: column.project.toString(),
      order: column.order,
      createdAt: column.createdAt.toISOString(),
      updatedAt: column.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Update column error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function deleteColumn(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const columnId = req.params.columnId;

    const { hasAccess, isCreator, isOwnerOrManager } = await checkProjectAccess(
      userId,
      projectId
    );

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    // Только руководитель проекта или владелец/руководитель компании могут удалять колонки
    if (!isCreator && !isOwnerOrManager) {
      res.status(403).json({
        detail: 'Только руководитель проекта или владелец/руководитель компании могут удалять колонки',
      });
      return;
    }

    const column = await Column.findOne({ _id: columnId, project: projectId });

    if (!column) {
      res.status(404).json({
        detail: 'Колонка не найдена',
      });
      return;
    }

    await Column.deleteOne({ _id: columnId });

    res.json({
      message: 'Колонка успешно удалена',
    });
  } catch (error: any) {
    console.error('Delete column error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function reorderColumns(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.projectId;
    const { columnIds } = req.body; // массив ID колонок в новом порядке

    const { hasAccess, isCreator, isOwnerOrManager } = await checkProjectAccess(
      userId,
      projectId
    );

    if (!hasAccess) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    // Только руководитель проекта или владелец/руководитель компании могут изменять порядок колонок
    if (!isCreator && !isOwnerOrManager) {
      res.status(403).json({
        detail: 'Только руководитель проекта или владелец/руководитель компании могут изменять порядок колонок',
      });
      return;
    }

    if (!Array.isArray(columnIds)) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: {
          columnIds: ['columnIds должен быть массивом'],
        },
      });
      return;
    }

    // Обновляем порядок каждой колонки
    for (let i = 0; i < columnIds.length; i++) {
      await Column.updateOne(
        { _id: columnIds[i], project: projectId },
        { $set: { order: i } }
      );
    }

    // Получаем обновленные колонки
    const columns = await Column.find({ project: projectId }).sort({ order: 1 });

    res.json(
      columns.map((column) => ({
        id: column._id.toString(),
        name: column.name,
        project: column.project.toString(),
        order: column.order,
        createdAt: column.createdAt.toISOString(),
        updatedAt: column.updatedAt.toISOString(),
      }))
    );
  } catch (error: any) {
    console.error('Reorder columns error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}
