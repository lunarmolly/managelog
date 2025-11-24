import mongoose, { Schema, Document } from 'mongoose';

export interface IColumn extends Document {
  name: string;
  project: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema = new Schema<IColumn>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, 'Название колонки должно быть не более 100 символов'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
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
ColumnSchema.index({ project: 1, order: 1 });
ColumnSchema.index({ project: 1 });

export const Column = mongoose.model<IColumn>('Column', ColumnSchema);
