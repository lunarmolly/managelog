import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/managelog';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB подключена успешно');
    const dbName = mongoose.connection.db?.databaseName || mongoose.connection.name;
    console.log(`📊 База данных: ${dbName}`);
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('🔌 MongoDB отключена');
  } catch (error) {
    console.error('❌ Ошибка отключения от MongoDB:', error);
  }
};

