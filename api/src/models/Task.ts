import mongoose, { Schema, Document } from 'mongoose';

export interface ITaskFile {
  name: string;
  url: string;
  size: number; // размер в байтах
}

export interface ITaskSubtask {
  name: string;
  isCompleted: boolean;
}

export interface ITask extends Document {
  name: string;
  description?: string;
  project: mongoose.Types.ObjectId;
  column: mongoose.Types.ObjectId;
  creator: mongoose.Types.ObjectId; // Постановщик
  assignee?: mongoose.Types.ObjectId; // Исполнитель (один пользователь)
  watchers: mongoose.Types.ObjectId[]; // Наблюдатели
  isCompleted: boolean;
  isImportant: boolean;
  subtasks: ITaskSubtask[];
  files: ITaskFile[];
  timeSpent?: number; // время в минутах
  deadline?: Date;
  order: number; // порядок в колонке
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Название задачи должно быть не более 200 символов'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Описание задачи должно быть не более 5000 символов'],
      default: null,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    column: {
      type: Schema.Types.ObjectId,
      ref: 'Column',
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    watchers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
    subtasks: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
            maxlength: [200, 'Название подзадачи должно быть не более 200 символов'],
          },
          isCompleted: {
            type: Boolean,
            default: false,
          },
        },
      ],
      default: [],
    },
    files: {
      type: [
        {
          name: {
            type: String,
            required: true,
            trim: true,
          },
          url: {
            type: String,
            required: true,
            trim: true,
          },
          size: {
            type: Number,
            required: true,
            min: [0, 'Размер файла не может быть отрицательным'],
          },
        },
      ],
      default: [],
    },
    timeSpent: {
      type: Number,
      default: null,
      min: [0, 'Время не может быть отрицательным'],
    },
    deadline: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Индексы для оптимизации запросов
TaskSchema.index({ project: 1, column: 1 });
TaskSchema.index({ creator: 1 });
TaskSchema.index({ assignee: 1 });
TaskSchema.index({ watchers: 1 });
TaskSchema.index({ order: 1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
