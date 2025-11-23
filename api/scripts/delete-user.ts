import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/managelog';

async function deleteAdminUser(): Promise<void> {
  try {
    // Подключение к базе данных
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Подключено к MongoDB');
    console.log(`📍 URI: ${MONGODB_URI}`);
    
    const db = mongoose.connection.db;
    if (db) {
      console.log(`📍 База данных: ${db.databaseName}`);
      
      // Список всех коллекций
      const collections = await db.listCollections().toArray();
      console.log(`\n📚 Коллекции в базе: ${collections.map(c => c.name).join(', ')}`);
    }

    // Проверка через прямую работу с коллекцией
    const usersCollection = db?.collection('users');
    if (usersCollection) {
      const directUsers = await usersCollection.find({}).toArray();
      console.log(`\n📋 Найдено пользователей через коллекцию: ${directUsers.length}`);
      directUsers.forEach((user: any) => {
        console.log(`  - ${user.login || 'нет логина'} (${user.email || 'нет email'}) [${user._id}]`);
      });
    }

    // Список всех пользователей через модель
    const allUsers = await User.find({}, 'login email _id');
    console.log(`\n📋 Найдено пользователей через модель: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`  - ${user.login} (${user.email}) [${user._id}]`);
    });

    // Удаление по _id напрямую (строка ID)
    try {
      const userIdString = '692363896e855af4c1b47299';
      const userId = new mongoose.Types.ObjectId(userIdString);
      
      // Сначала проверим, существует ли пользователь с таким ID
      const userById = await User.findById(userId);
      if (userById) {
        console.log(`\n📌 Найден пользователь по ID: ${userById.login} (${userById.email})`);
        const resultById = await User.deleteOne({ _id: userId });
        
        if (resultById.deletedCount > 0) {
          console.log('✅ Пользователь удален по ID: 692363896e855af4c1b47299');
        } else {
          console.log('⚠️ Не удалось удалить пользователя по ID');
        }
      } else {
        console.log('\n⚠️ Пользователь с указанным ID не найден');
      }
    } catch (e: any) {
      console.log(`\n⚠️ Ошибка при удалении по ID: ${e.message}`);
    }

    // Удаление по логину "admin" (регистронезависимо)
    const resultByLogin = await User.deleteMany({ 
      $or: [
        { login: 'admin' },
        { login: 'Admin' },
        { login: 'ADMIN' }
      ]
    });
    
    if (resultByLogin.deletedCount > 0) {
      console.log(`✅ Удалено пользователей с логином "admin": ${resultByLogin.deletedCount}`);
    } else {
      console.log('⚠️ Пользователь с логином "admin" не найден');
    }

    // Удаление по email
    const resultByEmail = await User.deleteOne({ email: 'ethermolly@yandex.ru' });
    if (resultByEmail.deletedCount > 0) {
      console.log('✅ Пользователь удален по email: ethermolly@yandex.ru');
    }

    // Проверка после удаления
    const remainingUsers = await User.find({ 
      $or: [
        { login: 'admin' },
        { email: 'ethermolly@yandex.ru' }
      ]
    });
    
    if (remainingUsers.length === 0) {
      console.log('\n✅ Пользователей с логином "admin" больше нет в базе');
    } else {
      console.log(`\n⚠️ В базе осталось ${remainingUsers.length} пользователей:`);
      remainingUsers.forEach(user => {
        console.log(`  - ${user.login} (${user.email}) [${user._id}]`);
      });
    }

    // Отключение от базы данных
    await mongoose.disconnect();
    console.log('\n🔌 Отключено от MongoDB');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Ошибка:', error.message);
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

deleteAdminUser();

