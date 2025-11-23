import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  login: string;
  password: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Некорректный email'],
    },
    login: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, 'Логин должен быть не менее 3 символов'],
      maxlength: [56, 'Логин должен быть не более 56 символов'],
      match: [/^[a-zA-Z0-9._]+$/, 'Логин может содержать только буквы латиницы, цифры и символы . _'],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, 'Пароль должен быть не менее 8 символов'],
      maxlength: [24, 'Пароль должен быть не более 24 символов'],
    },
    firstName: {
      type: String,
      trim: true,
      maxlength: [24, 'Имя должно быть не более 24 символов'],
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [24, 'Фамилия должна быть не более 24 символов'],
    },
  },
  {
    timestamps: true,
  }
);

// Хеширование пароля перед сохранением
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Метод для сравнения паролей
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);

