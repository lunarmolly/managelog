<template>
  <div class="dashboard-view">
    <!-- Первый ряд: карточка пользователя и метрики -->
    <div class="dashboard-first-row">
      <!-- Карточка пользователя -->
      <div class="user-card">
        <div class="user-card-image">
          <img :src="userData.avatar" :alt="userData.name" />
          <div class="user-card-overlay"></div>
        </div>
        <div class="user-card-info">
          <div class="user-card-name">{{ userData.name }}</div>
          <div class="user-card-role">{{ userData.role }}</div>
        </div>
      </div>

      <!-- Блоки метрик -->
      <div class="metrics-container">
        <!-- Верхний ряд: загруженность и активные проекты -->
        <div class="metrics-row">
          <!-- Блок загруженности -->
          <div class="metric-card metric-card-dark">
            <div class="metric-title">загруженность</div>
            <div class="metric-values">
              <div class="metric-value metric-value-positive">
                <div class="metric-value-number">{{ workloadData.current }}%</div>
                <div class="metric-value-label">к прошлому периоду</div>
              </div>
              <div class="metric-value">
                <div class="metric-value-number">{{ workloadData.change > 0 ? '+' : '' }}{{ workloadData.change }}%</div>
                <div class="metric-value-label">к прошлому периоду</div>
              </div>
            </div>
          </div>

          <!-- Блок активных проектов -->
          <div class="metric-card metric-card-light">
            <div class="metric-title metric-title-dark">активных проектов</div>
            <div class="metric-value">
              <div class="metric-value-number metric-value-number-dark">{{ activeProjects }}</div>
              <div class="metric-value-label metric-value-label-dark">к прошлому периоду</div>
            </div>
          </div>
        </div>

        <!-- Блок соблюдения сроков -->
        <div class="metric-card metric-card-dark metric-card-wide">
          <div class="metric-title">соблюдение сроков</div>
          <div class="deadline-compliance-content">
            <!-- Прогресс-бар -->
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div
                  class="progress-segment progress-segment-large"
                  :style="{ width: `${deadlineData.large.percentage}%` }"
                >
                  <div class="progress-segment-label">{{ deadlineData.large.percentage }}%</div>
                </div>
                <div
                  class="progress-segment progress-segment-medium"
                  :style="{ width: `${deadlineData.medium.percentage}%` }"
                >
                  <div class="progress-segment-label">{{ deadlineData.medium.percentage }}%</div>
                </div>
                <div
                  class="progress-segment progress-segment-small"
                  :style="{ width: `${deadlineData.small.percentage}%` }"
                >
                  <div class="progress-segment-label">{{ deadlineData.small.percentage }}%</div>
                </div>
              </div>
              <div class="progress-labels">
                <div
                  class="progress-label"
                  :style="{ left: `${progressLabelPositions.large}%` }"
                >
                  большие
                </div>
                <div
                  class="progress-label"
                  :style="{ left: `${progressLabelPositions.medium}%` }"
                >
                  средние
                </div>
                <div
                  class="progress-label"
                  :style="{ left: `${progressLabelPositions.small}%` }"
                >
                  малые
                </div>
              </div>
            </div>

            <!-- Дополнительная информация -->
            <div class="deadline-info">
              <div class="deadline-info-text">
                лучше всего даются <span class="highlight">{{ bestTaskType }}</span> задачи
              </div>
              <div class="deadline-stats">
                <div class="deadline-stats-value">{{ deadlineData.closedOnTime }} / {{ deadlineData.total }}</div>
                <div class="deadline-stats-label">закрыты в срок</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Второй ряд: доходы и важное/цели -->
    <div class="dashboard-second-row">
      <!-- Левая часть: доходы и важное -->
      <div class="dashboard-left-section">
        <!-- Блок доходов -->
        <div class="metric-card metric-card-light metric-card-wide">
          <div class="portfolio-header">
            <div class="portfolio-title">общий доход портфеля</div>
            <div class="portfolio-title">маржинальность портфеля</div>
          </div>
          <div class="portfolio-values">
            <div class="portfolio-value">
              <div class="portfolio-value-number">{{ portfolioData.totalIncome }} ₽</div>
            </div>
            <div class="portfolio-value">
              <div class="portfolio-value-number">{{ portfolioData.marginality }} ₽</div>
            </div>
          </div>
        </div>

        <!-- Блок важного -->
        <div class="metric-card metric-card-dark metric-card-tall">
          <div class="metric-title">важное</div>
          <div class="important-items">
            <div
              v-for="(item, index) in displayedImportantItems"
              :key="index"
              class="important-item"
            >
              {{ item }}
            </div>
            <div
              v-if="hasMoreImportantItems"
              class="important-item important-item-more"
              @click="toggleImportantItems"
            >
              {{ isImportantItemsExpanded ? 'меньше' : 'больше' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Правая часть: цели на месяц -->
      <div class="metric-card metric-card-dark metric-card-goals">
        <div class="metric-title">цели на месяц</div>
        <div class="goals-items">
          <div
            v-for="(goal, index) in monthlyGoals"
            :key="index"
            class="goal-item"
          >
            {{ goal }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Типы данных
interface UserData {
  name: string;
  role: string;
  avatar: string;
}

interface WorkloadData {
  current: number;
  change: number;
}

interface DeadlineSegment {
  percentage: number;
  label: string;
}

interface DeadlineData {
  large: DeadlineSegment;
  medium: DeadlineSegment;
  small: DeadlineSegment;
  closedOnTime: number;
  total: number;
}

// Заглушки данных
const userData = ref<UserData>({
  name: 'Наташа Гриднева',
  role: 'Менеджер',
  avatar: '/images/avatars/photo_2025-11-23_17-19-15.jpg', // Временная заглушка, будет из API
});

const workloadData = ref<WorkloadData>({
  current: 30,
  change: 10,
});

const activeProjects = ref<number>(15);

const deadlineData = ref<DeadlineData>({
  large: {
    percentage: 48,
    label: 'большие',
  },
  medium: {
    percentage: 25,
    label: 'средние',
  },
  small: {
    percentage: 27,
    label: 'малые',
  },
  closedOnTime: 132,
  total: 275,
});

// Данные портфеля
const portfolioData = ref({
  totalIncome: '765 045',
  marginality: '765 045',
});

// Важные элементы (уведомления и рекомендации)
const importantItems = ref<string[]>([
  '⚠️ Проект "Редизайн сайта" требует внимания: дедлайн через 3 дня',
  '💡 Рекомендация: увеличить загрузку на 15% для достижения месячного плана',
  '🔔 Новое уведомление: клиент запросил изменения в проекте "Мобильное приложение"',
  '📊 Отчет за прошлую неделю готов к просмотру',
  '✅ Все задачи по проекту "Корпоративный портал" выполнены в срок',
]);

// Состояние развернутости списка важных элементов
const isImportantItemsExpanded = ref<boolean>(false);

// Вычисляемое свойство для отображаемых важных элементов
const displayedImportantItems = computed(() => {
  if (importantItems.value.length <= 3) {
    return importantItems.value;
  }
  if (isImportantItemsExpanded.value) {
    return importantItems.value;
  }
  return importantItems.value.slice(0, 2);
});

// Есть ли еще элементы для показа
const hasMoreImportantItems = computed(() => {
  return importantItems.value.length > 3;
});

// Переключение развернутости
const toggleImportantItems = () => {
  isImportantItemsExpanded.value = !isImportantItemsExpanded.value;
};

// Цели на месяц
const monthlyGoals = ref<string[]>([
  'Завершить 5 крупных проектов',
  'Достичь маржинальности портфеля 45%',
  'Увеличить общий доход на 20%',
  'Соблюсти дедлайны в 95% случаев',
  'Привлечь 3 новых клиента',
  'Провести 10 встреч с командой',
]);

// Вычисляемое свойство для лучшего типа задач
const bestTaskType = computed(() => {
  const segments = [
    { type: 'большие', value: deadlineData.value.large.percentage },
    { type: 'средние', value: deadlineData.value.medium.percentage },
    { type: 'малые', value: deadlineData.value.small.percentage },
  ];
  return segments.reduce((max, current) => (current.value > max.value ? current : max)).type;
});

// Вычисляемые позиции для подписей под прогресс-баром
const progressLabelPositions = computed(() => {
  const large = deadlineData.value.large.percentage;
  const medium = deadlineData.value.medium.percentage;
  const small = deadlineData.value.small.percentage;
  
  return {
    large: large / 2, // центр первого сегмента
    medium: large + (medium / 2), // центр второго сегмента
    small: large + medium + (small / 2), // центр третьего сегмента
  };
});
</script>

<style scoped>
@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
}

.dashboard-view {
  width: 95vw;
  max-width: 100%;
  margin: 0 auto;
  padding: 24px 0;
  font-family: 'Involve', Arial, sans-serif;
  min-height: calc(100vh - 100px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Первый ряд: карточка пользователя и метрики */
.dashboard-first-row {
  width: 100%;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  box-sizing: border-box;
}

/* Карточка пользователя */
.user-card {
  width: 324px;
  min-width: 324px;
  height: 324px;
  border-radius: 40px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  box-shadow: inset 0 0 40.5px 7px rgba(4, 9, 16, 1);
}

.user-card-image {
  width: 100%;
  height: 100%;
  position: relative;
}

.user-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}

.user-card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 89px;
  background: linear-gradient(
    180deg,
    rgba(145, 33, 56, 0.98) 0%,
    rgba(145, 33, 56, 0.92) 40%,
    rgba(20, 15, 25, 0.98) 100%
  );
  backdrop-filter: blur(35px) saturate(200%);
  -webkit-backdrop-filter: blur(35px) saturate(200%);
  box-shadow: 
    0 -8px 32px rgba(145, 33, 56, 0.5),
    0 -2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-card-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 89px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #e1eaf8;
  z-index: 1;
  padding: 12px 20px 16px;
  text-align: center;
}

.user-card-name {
  font-size: 24px;
  font-weight: 500;
  font-family: 'Inter', Arial, sans-serif;
  line-height: 1.25;
  letter-spacing: -0.015em;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

.user-card-role {
  font-size: 12px;
  font-weight: 300;
  font-family: 'Inter', Arial, sans-serif;
  line-height: 1.5;
  letter-spacing: 0.02em;
  margin: 0;
  opacity: 0.85;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

/* Контейнер метрик */
.metrics-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.metrics-row {
  display: flex;
  gap: 24px;
  align-items: stretch;
  width: 100%;
}

/* Карточки метрик */
.metric-card {
  border-radius: 40px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 150px;
  box-sizing: border-box;
}

.metric-card-dark {
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
}

.metric-card-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.metric-card-wide {
  width: 100%;
}

/* Специфичные размеры из макета - пропорции */
.metrics-row .metric-card:first-child {
  flex: 2.07; /* 672 / 324 ≈ 2.07 */
  min-width: 0;
}

.metrics-row .metric-card:last-child {
  flex: 1; /* 324 / 324 = 1 */
  min-width: 0;
}

.metric-title {
  font-size: 24px;
  font-weight: 500;
  color: #e1eaf8;
  line-height: 24px;
}

.metric-title-dark {
  color: #292d32;
}

/* Значения метрик */
.metric-values {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  flex: 1;
}

.metric-value {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.metric-value-positive {
  color: #b1ff8a;
}

.metric-value-number {
  font-size: 36px;
  font-weight: 500;
  line-height: 38px;
  color: #e1eaf8;
}

.metric-value-positive .metric-value-number {
  color: #b1ff8a;
}

.metric-value-number-dark {
  color: #5d2233;
}

.metric-value-label {
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  color: #e1eaf8;
}

.metric-value-label-dark {
  color: #292d32;
}

/* Блок соблюдения сроков */
.deadline-compliance-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  flex: 1;
}

.progress-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.progress-bar {
  display: flex;
  height: 36px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.progress-segment {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 0;
}

.progress-segment-large {
  background: #d9d9d9;
  border-radius: 16px 0 0 16px;
}

.progress-segment-medium {
  background: rgba(255, 252, 252, 0.34);
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(217, 217, 217, 0.3) 4px,
    rgba(217, 217, 217, 0.3) 8px
  );
  border: 4.154px solid #d9d9d9;
  border-left: none;
  border-right: none;
}

.progress-segment-small {
  background: rgba(255, 252, 252, 0.34);
  border: 4.154px solid #d9d9d9;
  border-left: none;
  border-radius: 0 16px 16px 0;
}

.progress-segment-label {
  font-size: 36px;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  color: #5d2233;
  line-height: 36px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  padding: 0 12px;
}

.progress-segment-label-pattern {
  background-image: repeating-linear-gradient(
    45deg,
    #d9d9d9,
    #d9d9d9 2px,
    transparent 2px,
    transparent 4px
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 8px 8px;
}

.progress-labels {
  display: flex;
  gap: 0;
  position: relative;
  height: 22px;
  width: 100%;
}

.progress-label {
  font-size: 15px;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  color: #e1eaf8;
  line-height: 22px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  white-space: nowrap;
}

/* Дополнительная информация о сроках */
.deadline-info {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}

.deadline-info-text {
  font-size: 15px;
  font-weight: 500;
  color: #e1eaf8;
  line-height: 1.5;
  text-align: center;
}

.deadline-info-text .highlight {
  color: #b1ff8a;
}

.deadline-stats {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
}

.deadline-stats-value {
  font-size: 36px;
  font-weight: 500;
  color: #e1eaf8;
  line-height: 1.1;
  white-space: pre;
}

.deadline-stats-label {
  font-size: 15px;
  font-weight: 500;
  color: #e1eaf8;
  line-height: 1.5;
  white-space: pre;
  text-align: right;
}

/* Второй ряд дашборда */
.dashboard-second-row {
  width: 100%;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  box-sizing: border-box;
}

.dashboard-left-section {
  flex: 2.05; /* 904 / 440 ≈ 2.05 */
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

/* Блок доходов портфеля */
.portfolio-header {
  display: flex;
  gap: 10px;
  width: 100%;
}

.portfolio-title {
  flex: 1;
  font-size: 24px;
  font-weight: 500;
  color: #292d32;
  line-height: 24px;
}

.portfolio-values {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  flex: 1;
}

.portfolio-value {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.portfolio-value-number {
  font-size: 36px;
  font-weight: 500;
  color: #5d2233;
  line-height: 38px;
}

/* Блок важного */
.metric-card-tall {
  min-height: 259px;
  height: auto;
}

.important-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-height: 0;
}

.important-item {
  background: #912138;
  min-height: 48px;
  height: auto;
  border-radius: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;
}

.important-item-more {
  background: rgba(145, 33, 56, 0.6);
  cursor: pointer;
  transition: background 0.2s ease;
  justify-content: center;
  font-weight: 500;
  text-transform: lowercase;
}

.important-item-more:hover {
  background: rgba(145, 33, 56, 0.8);
}

/* Блок целей на месяц */
.metric-card-goals {
  flex: 1; /* 440 / 440 = 1 */
  height: 433px;
  min-width: 0;
}

.goals-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  width: 100%;
  align-items: center;
}

.goal-item {
  background: #912138;
  height: 48px;
  border-radius: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
}

/* Адаптивность */
@media (max-width: 1440px) {
  .dashboard-first-row {
    flex-wrap: wrap;
  }

  .user-card {
    width: 324px;
    min-width: 324px;
  }

  .metrics-container {
    width: 100%;
  }
}

@media (max-width: 1100px) {
  .dashboard-first-row {
    flex-direction: column;
  }

  .user-card {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }

  .metrics-container {
    width: 100%;
  }

  .metrics-row {
    flex-direction: column;
  }

  .metrics-row .metric-card:first-child,
  .metrics-row .metric-card:last-child {
    width: 100%;
  }

  .deadline-compliance-content {
    flex-direction: column;
  }

  .deadline-info {
    width: 100%;
  }

  .dashboard-second-row {
    flex-direction: column;
  }

  .dashboard-left-section {
    width: 100%;
  }

  .metric-card-goals {
    width: 100%;
    height: auto;
  }
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 16px;
    width: 100vw;
  }

  .metric-title {
    font-size: 20px;
  }

  .metric-value-number {
    font-size: 28px;
  }

  .progress-segment-label {
    font-size: 24px;
  }

  .deadline-stats-value {
    font-size: 28px;
  }

  /* Адаптивность для соблюдения сроков */
  .deadline-compliance-content {
    flex-direction: column;
    gap: 16px;
  }

  /* Скрываем прогресс-бар на мобильных */
  .progress-bar-container {
    display: none;
  }

  .deadline-info {
    width: 100%;
    align-items: center;
  }

  .deadline-info-text {
    font-size: 14px;
    text-align: center;
  }

  .deadline-stats {
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .deadline-stats-value {
    font-size: 24px;
  }

  .deadline-stats-label {
    font-size: 13px;
    text-align: center;
  }

  /* Адаптивность для дохода и маржи портфеля */
  .metric-card-wide.metric-card-light {
    display: flex;
    flex-direction: column;
  }

  /* Убираем контейнеры на мобильных, чтобы order работал */
  .portfolio-header {
    display: contents;
  }

  .portfolio-values {
    display: contents;
  }

  .portfolio-title {
    font-size: 18px;
    line-height: 22px;
    width: 100%;
  }

  /* Первая подпись */
  .portfolio-title:first-child {
    order: 1;
    margin-bottom: 8px;
  }

  /* Вторая подпись */
  .portfolio-title:last-child {
    order: 3;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  .portfolio-value {
    width: 100%;
  }

  /* Первое число */
  .portfolio-value:first-child {
    order: 2;
    margin-bottom: 0;
  }

  /* Второе число */
  .portfolio-value:last-child {
    order: 4;
    margin-top: 0;
  }

  .portfolio-value-number {
    font-size: 28px;
    line-height: 32px;
  }
}

@media (max-width: 480px) {
  .dashboard-view {
    padding: 12px;
    gap: 16px;
  }

  .metric-card {
    padding: 16px;
    height: auto;
    min-height: 120px;
  }

  .metric-title {
    font-size: 18px;
    line-height: 22px;
  }

  .metric-value-number {
    font-size: 24px;
    line-height: 28px;
  }

  .metric-value-label {
    font-size: 13px;
  }

  /* Соблюдение сроков на очень маленьких экранах */
  .deadline-info-text {
    font-size: 13px;
  }

  .deadline-stats-value {
    font-size: 20px;
  }

  .deadline-stats-label {
    font-size: 12px;
  }

  /* Доход и маржа портфеля */
  .portfolio-title {
    font-size: 16px;
    line-height: 20px;
  }

  .portfolio-value-number {
    font-size: 24px;
    line-height: 28px;
  }

  .portfolio-values {
    gap: 12px;
  }
}
</style>
