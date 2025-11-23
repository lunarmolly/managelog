import mongoose, { Schema, Document } from 'mongoose';

export type ProjectStatus = 'new' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';

export interface IProject extends Document {
  name: string;
  description?: string;
  creator: mongoose.Types.ObjectId; // Руководитель/создатель
  participants: mongoose.Types.ObjectId[]; // Участники
  status: ProjectStatus;
  requiresAction: boolean; // Рекомендуются действия
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Название проекта должно быть не более 200 символов'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Описание проекта должно быть не более 2000 символов'],
      default: null,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'completed', 'on_hold', 'cancelled'],
      default: 'new',
      required: true,
    },
    requiresAction: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
      match: [/^#[0-9A-Fa-f]{6}$/, 'Цвет должен быть в формате HEX (#RRGGBB)'],
    },
  },
  {
    timestamps: true,
  }
);

// Индексы для оптимизации запросов
ProjectSchema.index({ creator: 1 });
ProjectSchema.index({ participants: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);

