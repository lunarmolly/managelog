import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  login: string;
  password: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  displayName?: string;
  birthDate?: Date;
  role?: string;
  phone?: string;
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
    middleName: {
      type: String,
      trim: true,
      maxlength: [24, 'Отчество должно быть не более 24 символов'],
      default: null,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [56, 'Отображаемое имя должно быть не более 56 символов'],
      default: null,
    },
    birthDate: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      trim: true,
      maxlength: [50, 'Роль должна быть не более 50 символов'],
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Некорректный формат телефона'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook для установки displayName и хеширования пароля
UserSchema.pre('save', async function (next) {
  // Установка displayName по умолчанию
  if (!this.displayName && this.firstName) {
    this.displayName = this.firstName;
  }

  // Хеширование пароля только если он изменен и еще не захеширован
  if (this.isModified('password')) {
    try {
      // Проверяем, не захеширован ли уже пароль (bcrypt hash начинается с $2a$, $2b$ или $2y$)
      const isAlreadyHashed = /^\$2[ayb]\$.{56}$/.test(this.password);
      
      if (!isAlreadyHashed) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Пароль захеширован для пользователя:', {
            userId: this._id,
            login: this.login,
            email: this.email,
          });
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('Пароль уже захеширован, пропускаем хеширование:', {
            userId: this._id,
            login: this.login,
          });
        }
      }
    } catch (error: any) {
      console.error('Ошибка хеширования пароля:', error);
      return next(error);
    }
  }

  next();
});

// Метод для сравнения паролей
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);

