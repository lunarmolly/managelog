import { Response } from 'express';
import { Project, ProjectStatus } from '../models/Project.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getProjects(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    // Получаем проекты, где пользователь является создателем или участником
    const projects = await Project.find({
      $or: [
        { creator: userId },
        { participants: userId },
      ],
    })
      .populate('creator', 'id email login firstName lastName displayName avatar')
      .populate('participants', 'id email login firstName lastName displayName avatar')
      .sort({ createdAt: -1 });

    res.json(projects.map(project => ({
      id: project._id.toString(),
      name: project.name,
      description: project.description || null,
      creator: {
        id: (project.creator as any)._id.toString(),
        email: (project.creator as any).email,
        login: (project.creator as any).login || '',
        firstName: (project.creator as any).firstName || null,
        lastName: (project.creator as any).lastName || null,
        displayName: (project.creator as any).displayName || (project.creator as any).firstName || null,
        avatar: (project.creator as any).avatar ? `/api/v1/avatars/${(project.creator as any).avatar}` : null,
      },
      participants: (project.participants as any[]).map((participant: any) => ({
        id: participant._id.toString(),
        email: participant.email,
        login: participant.login || '',
        firstName: participant.firstName || null,
        lastName: participant.lastName || null,
        displayName: participant.displayName || participant.firstName || null,
        avatar: participant.avatar ? `/api/v1/avatars/${participant.avatar}` : null,
      })),
      status: project.status,
      requiresAction: project.requiresAction,
      icon: project.icon,
      color: project.color,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })));
  } catch (error: any) {
    console.error('Get projects error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function getProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.id;
    const project = await Project.findById(projectId)
      .populate('creator', 'id email login firstName lastName displayName avatar')
      .populate('participants', 'id email login firstName lastName displayName avatar');

    if (!project) {
      res.status(404).json({
        detail: 'Проект не найден',
      });
      return;
    }

    // Проверяем, что пользователь имеет доступ к проекту
    const isCreator = project.creator._id.toString() === userId;
    const isParticipant = (project.participants as any[]).some(
      (p: any) => p._id.toString() === userId
    );

    if (!isCreator && !isParticipant) {
      res.status(403).json({
        detail: 'Нет доступа к проекту',
      });
      return;
    }

    res.json({
      id: project._id.toString(),
      name: project.name,
      description: project.description || null,
      creator: {
        id: (project.creator as any)._id.toString(),
        email: (project.creator as any).email,
        login: (project.creator as any).login || '',
        firstName: (project.creator as any).firstName || null,
        lastName: (project.creator as any).lastName || null,
        displayName: (project.creator as any).displayName || (project.creator as any).firstName || null,
        avatar: (project.creator as any).avatar ? `/api/v1/avatars/${(project.creator as any).avatar}` : null,
      },
      participants: (project.participants as any[]).map((participant: any) => ({
        id: participant._id.toString(),
        email: participant.email,
        login: participant.login || '',
        firstName: participant.firstName || null,
        lastName: participant.lastName || null,
        displayName: participant.displayName || participant.firstName || null,
        avatar: participant.avatar ? `/api/v1/avatars/${participant.avatar}` : null,
      })),
      status: project.status,
      requiresAction: project.requiresAction,
      icon: project.icon,
      color: project.color,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function createProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const { name, description, participants, status, requiresAction, icon, color } = req.body;

    // Валидация
    if (!name || !name.trim()) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: {
          name: ['Название проекта обязательно'],
        },
      });
      return;
    }

    if (!icon) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: {
          icon: ['Иконка проекта обязательна'],
        },
      });
      return;
    }

    if (!color || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      res.status(422).json({
        detail: 'Ошибка валидации',
        errors: {
          color: ['Цвет должен быть в формате HEX (#RRGGBB)'],
        },
      });
      return;
    }

    const validStatuses: ProjectStatus[] = ['new', 'in_progress', 'completed', 'on_hold', 'cancelled'];
    const projectStatus: ProjectStatus = status && validStatuses.includes(status) ? status : 'new';

    // Преобразуем participants в массив ObjectId
    let participantIds: string[] = [];
    if (participants && Array.isArray(participants)) {
      participantIds = participants.filter((id: any) => id && typeof id === 'string');
    }

    const project = new Project({
      name: name.trim(),
      description: description?.trim() || null,
      creator: userId,
      participants: participantIds,
      status: projectStatus,
      requiresAction: requiresAction === true,
      icon: icon.trim(),
      color: color.trim(),
    });

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('creator', 'id email login firstName lastName displayName avatar')
      .populate('participants', 'id email login firstName lastName displayName avatar');

    res.status(201).json({
      id: populatedProject!._id.toString(),
      name: populatedProject!.name,
      description: populatedProject!.description || null,
      creator: {
        id: (populatedProject!.creator as any)._id.toString(),
        email: (populatedProject!.creator as any).email,
        login: (populatedProject!.creator as any).login || '',
        firstName: (populatedProject!.creator as any).firstName || null,
        lastName: (populatedProject!.creator as any).lastName || null,
        displayName: (populatedProject!.creator as any).displayName || (populatedProject!.creator as any).firstName || null,
        avatar: (populatedProject!.creator as any).avatar ? `/api/v1/avatars/${(populatedProject!.creator as any).avatar}` : null,
      },
      participants: (populatedProject!.participants as any[]).map((participant: any) => ({
        id: participant._id.toString(),
        email: participant.email,
        login: participant.login || '',
        firstName: participant.firstName || null,
        lastName: participant.lastName || null,
        displayName: participant.displayName || participant.firstName || null,
        avatar: participant.avatar ? `/api/v1/avatars/${participant.avatar}` : null,
      })),
      status: populatedProject!.status,
      requiresAction: populatedProject!.requiresAction,
      icon: populatedProject!.icon,
      color: populatedProject!.color,
      createdAt: populatedProject!.createdAt.toISOString(),
      updatedAt: populatedProject!.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function updateProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({
        detail: 'Проект не найден',
      });
      return;
    }

    // Проверяем, что пользователь является создателем проекта
    if (project.creator.toString() !== userId) {
      res.status(403).json({
        detail: 'Только создатель проекта может его изменять',
      });
      return;
    }

    const { name, description, participants, status, requiresAction, icon, color } = req.body;

    // Обновление полей
    if (name !== undefined) {
      if (!name || !name.trim()) {
        res.status(422).json({
          detail: 'Ошибка валидации',
          errors: {
            name: ['Название проекта обязательно'],
          },
        });
        return;
      }
      project.name = name.trim();
    }

    if (description !== undefined) {
      project.description = description?.trim() || null;
    }

    if (participants !== undefined) {
      if (Array.isArray(participants)) {
        project.participants = participants
          .filter((id: any) => id && typeof id === 'string')
          .map((id: string) => id as any);
      } else {
        project.participants = [];
      }
    }

    if (status !== undefined) {
      const validStatuses: ProjectStatus[] = ['new', 'in_progress', 'completed', 'on_hold', 'cancelled'];
      if (validStatuses.includes(status)) {
        project.status = status;
      }
    }

    if (requiresAction !== undefined) {
      project.requiresAction = requiresAction === true;
    }

    if (icon !== undefined) {
      if (!icon || !icon.trim()) {
        res.status(422).json({
          detail: 'Ошибка валидации',
          errors: {
            icon: ['Иконка проекта обязательна'],
          },
        });
        return;
      }
      project.icon = icon.trim();
    }

    if (color !== undefined) {
      if (!color || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        res.status(422).json({
          detail: 'Ошибка валидации',
          errors: {
            color: ['Цвет должен быть в формате HEX (#RRGGBB)'],
          },
        });
        return;
      }
      project.color = color.trim();
    }

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('creator', 'id email login firstName lastName displayName avatar')
      .populate('participants', 'id email login firstName lastName displayName avatar');

    res.json({
      id: populatedProject!._id.toString(),
      name: populatedProject!.name,
      description: populatedProject!.description || null,
      creator: {
        id: (populatedProject!.creator as any)._id.toString(),
        email: (populatedProject!.creator as any).email,
        login: (populatedProject!.creator as any).login || '',
        firstName: (populatedProject!.creator as any).firstName || null,
        lastName: (populatedProject!.creator as any).lastName || null,
        displayName: (populatedProject!.creator as any).displayName || (populatedProject!.creator as any).firstName || null,
        avatar: (populatedProject!.creator as any).avatar ? `/api/v1/avatars/${(populatedProject!.creator as any).avatar}` : null,
      },
      participants: (populatedProject!.participants as any[]).map((participant: any) => ({
        id: participant._id.toString(),
        email: participant.email,
        login: participant.login || '',
        firstName: participant.firstName || null,
        lastName: participant.lastName || null,
        displayName: participant.displayName || participant.firstName || null,
        avatar: participant.avatar ? `/api/v1/avatars/${participant.avatar}` : null,
      })),
      status: populatedProject!.status,
      requiresAction: populatedProject!.requiresAction,
      icon: populatedProject!.icon,
      color: populatedProject!.color,
      createdAt: populatedProject!.createdAt.toISOString(),
      updatedAt: populatedProject!.updatedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Update project error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

export async function deleteProject(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        detail: 'Пользователь не авторизован',
      });
      return;
    }

    const projectId = req.params.id;
    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({
        detail: 'Проект не найден',
      });
      return;
    }

    // Проверяем, что пользователь является создателем проекта
    if (project.creator.toString() !== userId) {
      res.status(403).json({
        detail: 'Только создатель проекта может его удалить',
      });
      return;
    }

    await Project.findByIdAndDelete(projectId);

    res.json({
      message: 'Проект успешно удален',
    });
  } catch (error: any) {
    console.error('Delete project error:', error);
    res.status(500).json({
      detail: 'Внутренняя ошибка сервера',
    });
  }
}

