import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User.js';
import { Company } from '../src/models/Company.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/managelog';
const KEEP_LOGIN = 'solarmolly';

async function deleteAllUsersExcept(): Promise<void> {
  try {
    // Подключение к базе данных
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Подключено к MongoDB');
    console.log(`📍 URI: ${MONGODB_URI}`);

    // Находим пользователя, которого нужно оставить
    const keepUser = await User.findOne({ login: KEEP_LOGIN });
    if (!keepUser) {
      console.error(`❌ Пользователь с логином "${KEEP_LOGIN}" не найден`);
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`\n📌 Найден пользователь для сохранения: ${keepUser.login} (${keepUser.email}) [ID: ${keepUser._id}]`);

    // Получаем ID пользователя для сохранения
    const keepUserId = keepUser._id;

    // Находим всех пользователей, кроме того, кого нужно оставить
    const usersToDelete = await User.find({ _id: { $ne: keepUserId } });
    console.log(`\n📋 Найдено пользователей для удаления: ${usersToDelete.length}`);

    if (usersToDelete.length === 0) {
      console.log('✅ Нет пользователей для удаления');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Выводим список пользователей для удаления
    console.log('\n🗑️  Пользователи для удаления:');
    usersToDelete.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.login} (${user.email}) [ID: ${user._id}]`);
    });

    // Удаляем пользователей
    const deleteResult = await User.deleteMany({ _id: { $ne: keepUserId } });
    console.log(`\n✅ Удалено пользователей: ${deleteResult.deletedCount}`);

    // Обновляем компании - удаляем удаленных пользователей из members
    const companies = await Company.find({});
    console.log(`\n🏢 Найдено компаний: ${companies.length}`);

    for (const company of companies) {
      const originalMembersCount = company.members.length;
      // Оставляем только пользователя, которого нужно сохранить
      company.members = company.members.filter(
        (memberId: any) => memberId.toString() === keepUserId.toString()
      );
      
      if (company.members.length !== originalMembersCount) {
        await company.save();
        console.log(`   ✅ Обновлена компания "${company.name}": удалено ${originalMembersCount - company.members.length} участников`);
      }

      // Если владелец компании был удален, обновляем владельца на оставшегося пользователя
      if (company.owner && company.owner.toString() !== keepUserId.toString()) {
        company.owner = keepUserId;
        await company.save();
        console.log(`   ✅ Обновлен владелец компании "${company.name}"`);
      }
    }

    // Проверяем результат
    const remainingUsers = await User.find({});
    console.log(`\n📊 Осталось пользователей: ${remainingUsers.length}`);
    remainingUsers.forEach((user) => {
      console.log(`   - ${user.login} (${user.email}) [ID: ${user._id}]`);
    });

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

deleteAllUsersExcept();

