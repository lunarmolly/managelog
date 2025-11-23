import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/managelog';

/**
 * Создает индексы для всех моделей
 */
export const createIndexes = async (): Promise<void> => {
  try {
    console.log('📋 Создание индексов...');
    
    // Создание индексов для модели User
    await User.createIndexes();
    console.log('✅ Индексы для модели User созданы');
    
    // Проверка существования коллекций
    const db = mongoose.connection.db;
    if (db) {
      const collections = await db.listCollections().toArray();
      const collectionNames = collections.map(c => c.name);
      console.log(`📚 Существующие коллекции: ${collectionNames.length > 0 ? collectionNames.join(', ') : 'нет'}`);
      
      // Если коллекция users не существует, создадим её через создание пустого документа
      if (!collectionNames.includes('users')) {
        console.log('📝 Создание коллекции users...');
        // Коллекция создастся автоматически при первой записи
        // Но мы можем явно создать её через createCollection
        try {
          await db.createCollection('users');
          console.log('✅ Коллекция users создана');
        } catch (err: any) {
          // Коллекция может уже существовать или создаться автоматически
          if (err.code !== 48) { // 48 = namespace exists
            console.log('ℹ️ Коллекция users будет создана автоматически при первой записи');
          }
        }
      }
    }
    
    console.log('✅ Инициализация базы данных завершена');
  } catch (error: any) {
    console.error('❌ Ошибка при создании индексов:', error.message || error);
    // Не прерываем запуск, индексы могут быть созданы позже
  }
};

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB подключена успешно');
    const dbName = mongoose.connection.db?.databaseName || mongoose.connection.name;
    console.log(`📊 База данных: ${dbName}`);
    
    // Создаем индексы и коллекции после подключения
    await createIndexes();
  } catch (error: any) {
    console.error('❌ Ошибка подключения к MongoDB:', error.message || error);
    console.error('💡 Убедитесь, что MongoDB запущена на mongodb://localhost:27017/');
    // Не завершаем процесс сразу, даем серверу запуститься
    // Процесс завершится при попытке использовать БД
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

