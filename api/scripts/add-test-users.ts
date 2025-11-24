import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User } from '../src/models/User.js';
import { Company } from '../src/models/Company.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/managelog';

interface TestUser {
  email: string;
  login: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  role?: string;
}

const testUsers: TestUser[] = [
  {
    email: 'alex.dev@managelog.test',
    login: 'alexdev',
    password: 'Test1234',
    firstName: 'Алексей',
    lastName: 'Разработчик',
    displayName: 'Алекс',
    role: 'разработчик',
  },
  {
    email: 'maria.design@managelog.test',
    login: 'mariadesign',
    password: 'Test1234',
    firstName: 'Мария',
    lastName: 'Дизайнер',
    displayName: 'Маша',
    role: 'дизайнер',
  },
  {
    email: 'ivan.manager@managelog.test',
    login: 'ivanmanager',
    password: 'Test1234',
    firstName: 'Иван',
    lastName: 'Менеджер',
    displayName: 'Ваня',
    role: 'менеджер',
  },
  {
    email: 'anna.analyst@managelog.test',
    login: 'annaanalyst',
    password: 'Test1234',
    firstName: 'Анна',
    lastName: 'Аналитик',
    displayName: 'Аня',
    role: 'аналитик',
  },
  {
    email: 'dmitry.lead@managelog.test',
    login: 'dmitrylead',
    password: 'Test1234',
    firstName: 'Дмитрий',
    lastName: 'Тимлид',
    displayName: 'Дима',
    role: 'менеджер',
  },
];

async function addTestUsers(): Promise<void> {
  try {
    // Подключение к базе данных
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Подключено к MongoDB');
    console.log(`📍 URI: ${MONGODB_URI}`);

    // Находим компанию managelog
    const company = await Company.findOne({ name: 'managelog' });
    if (!company) {
      console.error('❌ Компания "managelog" не найдена');
      console.log('💡 Создайте компанию через регистрацию пользователя');
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`\n📌 Найдена компания: ${company.name} (ID: ${company._id})`);

    // Получаем текущих участников компании
    const currentMembers = company.members || [];
    console.log(`\n👥 Текущих участников в компании: ${currentMembers.length}`);

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const testUser of testUsers) {
      try {
        // Проверяем, существует ли пользователь
        let user = await User.findOne({
          $or: [
            { email: testUser.email },
            { login: testUser.login },
          ],
        });

        if (user) {
          console.log(`\n⚠️  Пользователь уже существует: ${testUser.login} (${testUser.email})`);
          
          // Обновляем компанию, если пользователь не в ней
          if (!user.company || user.company.toString() !== company._id.toString()) {
            user.company = company._id;
            await user.save();
            
            // Добавляем в members компании, если его там нет
            if (!company.members.some(m => m.toString() === user!._id.toString())) {
              company.members.push(user._id);
            }
            
            updatedCount++;
            console.log(`   ✅ Пользователь добавлен в компанию`);
          } else {
            skippedCount++;
            console.log(`   ⏭️  Пользователь уже в компании`);
          }
        } else {
          // Хешируем пароль
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(testUser.password, salt);

          // Создаем нового пользователя
          user = new User({
            email: testUser.email,
            login: testUser.login,
            password: hashedPassword,
            firstName: testUser.firstName,
            lastName: testUser.lastName,
            displayName: testUser.displayName || testUser.firstName,
            role: testUser.role,
            company: company._id,
          });

          await user.save();
          console.log(`\n✅ Создан пользователь: ${testUser.login} (${testUser.email})`);

          // Добавляем в members компании
          company.members.push(user._id);
          createdCount++;
        }
      } catch (error: any) {
        console.error(`\n❌ Ошибка при создании/обновлении пользователя ${testUser.login}:`, error.message);
      }
    }

    // Сохраняем обновленную компанию
    await company.save();
    console.log(`\n✅ Компания обновлена`);

    // Выводим итоги
    console.log(`\n📊 Итоги:`);
    console.log(`   ✅ Создано новых пользователей: ${createdCount}`);
    console.log(`   🔄 Обновлено существующих: ${updatedCount}`);
    console.log(`   ⏭️  Пропущено: ${skippedCount}`);

    // Выводим список всех участников компании
    const updatedCompany = await Company.findById(company._id).populate('members', 'login email firstName lastName displayName role');
    console.log(`\n👥 Все участники компании "${company.name}":`);
    if (updatedCompany && updatedCompany.members) {
      (updatedCompany.members as any[]).forEach((member: any, index: number) => {
        console.log(`   ${index + 1}. ${member.login} (${member.email}) - ${member.displayName || member.firstName || 'Без имени'} [${member.role || 'без роли'}]`);
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

addTestUsers();

