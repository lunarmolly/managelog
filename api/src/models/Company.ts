import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  owner: mongoose.Types.ObjectId; // Владелец/создатель компании
  members: mongoose.Types.ObjectId[]; // Участники компании
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: [200, 'Название компании должно быть не более 200 символов'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Индексы для оптимизации запросов
CompanySchema.index({ owner: 1 });
CompanySchema.index({ members: 1 });
CompanySchema.index({ name: 1 }, { unique: true }); // Уникальность названия компании

export const Company = mongoose.model<ICompany>('Company', CompanySchema);

