<template>
  <div class="projects-view">
    <!-- Секция фильтров и сортировки -->
    <div class="filters-container">
      <div class="filters-left">
        <!-- Кнопка фильтров -->
        <div class="filter-btn" :class="{ active: isFiltersMenuOpen }" @click.stop="toggleFiltersMenu">
          <div class="filter-btn-inner">
            <span class="filter-text">{{ filtersButtonText }}</span>
            <div class="filter-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3 4.5C3 4.10218 3.15804 3.72064 3.43934 3.43934C3.72064 3.15804 4.10218 3 4.5 3H19.5C19.8978 3 20.2794 3.15804 20.5607 3.43934C20.842 3.72064 21 4.10218 21 4.5V6.586C20.9999 7.11639 20.7891 7.62501 20.414 8L15 13.414V20.838C15 21.0255 14.9521 21.2099 14.8608 21.3737C14.7695 21.5375 14.6379 21.6753 14.4783 21.7739C14.3188 21.8724 14.1368 21.9286 13.9494 21.9371C13.7621 21.9455 13.5757 21.9059 13.408 21.822L9.691 19.964C9.48337 19.8602 9.30875 19.7006 9.1867 19.5031C9.06466 19.3057 9.00001 19.0781 9 18.846V13.414L3.586 8C3.2109 7.62501 3.00011 7.11639 3 6.586V4.5ZM5 5V6.586L10.56 12.146C10.6994 12.2853 10.8101 12.4507 10.8856 12.6327C10.9611 12.8148 11 13.0099 11 13.207V18.382L13 19.382V13.207C13 12.809 13.158 12.427 13.44 12.147L19 6.585V5H5Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <div v-if="isFiltersMenuOpen" class="dropdown-menu active" @click.stop>
            <!-- Исполнитель -->
            <div
              class="dropdown-item expandable"
              :class="{ expanded: isExecutorSubmenuOpen, active: selectedFilters.executor.length > 0 }"
              @click.stop="toggleFilterSubmenu('executor')"
            >
              <span>исполнитель</span>
            </div>
            <div v-if="isExecutorSubmenuOpen" class="filter-submenu active" @click.stop>
              <div class="filter-search">
                <input
                  v-model="executorSearchQuery"
                  type="text"
                  class="filter-search-input"
                  placeholder="поиск исполнителя..."
                  @click.stop
                />
              </div>
              <div class="filter-results">
                <div
                  v-for="user in filteredExecutorUsers"
                  :key="user.id"
                  class="filter-result-item"
                  :class="{ selected: isUserSelected('executor', user.id) }"
                  @click.stop="toggleUserSelection('executor', user.id)"
                >
                  <span>{{ user.name }}</span>
                  <div class="checkbox">
                    <svg v-if="isUserSelected('executor', user.id)" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="#912138"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Руководитель -->
            <div
              class="dropdown-item expandable"
              :class="{ expanded: isManagerSubmenuOpen, active: selectedFilters.manager.length > 0 }"
              @click.stop="toggleFilterSubmenu('manager')"
            >
              <span>руководитель</span>
            </div>
            <div v-if="isManagerSubmenuOpen" class="filter-submenu active" @click.stop>
              <div class="filter-search">
                <input
                  v-model="managerSearchQuery"
                  type="text"
                  class="filter-search-input"
                  placeholder="поиск руководителя..."
                  @click.stop
                />
              </div>
              <div class="filter-results">
                <div
                  v-for="user in filteredManagerUsers"
                  :key="user.id"
                  class="filter-result-item"
                  :class="{ selected: isUserSelected('manager', user.id) }"
                  @click.stop="toggleUserSelection('manager', user.id)"
                >
                  <span>{{ user.name }}</span>
                  <div class="checkbox">
                    <svg v-if="isUserSelected('manager', user.id)" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="#912138"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Статус -->
            <div
              class="dropdown-item expandable"
              :class="{ expanded: isStatusSubmenuOpen, active: selectedFilters.status.length > 0 }"
              @click.stop="toggleFilterSubmenu('status')"
            >
              <span>статус</span>
            </div>
            <div v-if="isStatusSubmenuOpen" class="filter-submenu active" @click.stop>
              <div class="filter-status-list">
                <div
                  v-for="status in availableStatuses"
                  :key="status.id"
                  class="filter-status-item"
                  :class="{ selected: isStatusSelected(status.id) }"
                  @click.stop="toggleStatusSelection(status.id)"
                >
                  <span>{{ status.name }}</span>
                  <div class="checkbox">
                    <svg v-if="isStatusSelected(status.id)" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="#912138"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Рекомендуются действия -->
            <div
              class="dropdown-item"
              :class="{ active: selectedFilters.actions }"
              @click.stop="toggleFilter('actions')"
            >
              <span>рекомендуются действия</span>
              <div class="checkbox">
                <svg v-if="selectedFilters.actions" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="#912138"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div class="filter-actions">
              <div class="apply-btn" @click.stop="applyFilters">применить</div>
              <div class="reset-filters-btn" @click.stop="resetFilters" title="Сбросить фильтры">
                <div class="reset-filters-icon">
                  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопка сортировки -->
        <div class="sort-btn" :class="{ active: isSortMenuOpen }" @click.stop="toggleSortMenu">
          <div class="sort-btn-inner">
            <span class="sort-text">{{ sortButtonText }}</span>
            <div class="sort-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.293 4.29342C17.4651 4.1211 17.6941 4.01749 17.9371 4.00202C18.1802 3.98655 18.4205 4.0603 18.613 4.20942L18.707 4.29342L21.535 7.12142C21.7143 7.30138 21.8185 7.54286 21.8262 7.79681C21.834 8.05076 21.7448 8.29814 21.5768 8.4887C21.4087 8.67927 21.1744 8.79873 20.9215 8.82282C20.6686 8.84692 20.416 8.77384 20.215 8.61842L20.121 8.53542L19 7.41442V19.8284C18.9997 20.0833 18.9021 20.3285 18.7272 20.5138C18.5522 20.6991 18.313 20.8107 18.0586 20.8256C17.8042 20.8405 17.5536 20.7577 17.3582 20.5942C17.1627 20.4306 17.0371 20.1985 17.007 19.9454L17 19.8284V7.41442L15.879 8.53542C15.6995 8.71668 15.4574 8.82246 15.2025 8.83111C14.9475 8.83976 14.6988 8.75063 14.5074 8.58196C14.316 8.41329 14.1963 8.17784 14.1728 7.9238C14.1493 7.66976 14.2238 7.41635 14.381 7.21542L14.464 7.12142L17.293 4.29342ZM13 18.8284C13.2549 18.8287 13.5 18.9263 13.6854 19.1013C13.8707 19.2762 13.9822 19.5154 13.9972 19.7698C14.0121 20.0243 13.9293 20.2748 13.7657 20.4703C13.6021 20.6657 13.3701 20.7913 13.117 20.8214L13 20.8284H4C3.74512 20.8281 3.49997 20.7305 3.31463 20.5556C3.1293 20.3806 3.01777 20.1415 3.00283 19.887C2.98789 19.6326 3.07067 19.382 3.23426 19.1866C3.39786 18.9911 3.6299 18.8655 3.883 18.8354L4 18.8284H13ZM13 11.8284C13.2652 11.8284 13.5196 11.9338 13.7071 12.1213C13.8946 12.3089 14 12.5632 14 12.8284C14 13.0936 13.8946 13.348 13.7071 13.5355C13.5196 13.7231 13.2652 13.8284 13 13.8284H4C3.73478 13.8284 3.48043 13.7231 3.29289 13.5355C3.10536 13.348 3 13.0936 3 12.8284C3 12.5632 3.10536 12.3089 3.29289 12.1213C3.48043 11.9338 3.73478 11.8284 4 11.8284H13ZM11 4.82842C11.2652 4.82842 11.5196 4.93378 11.7071 5.12132C11.8946 5.30885 12 5.56321 12 5.82842C12 6.09364 11.8946 6.34799 11.7071 6.53553C11.5196 6.72307 11.2652 6.82842 11 6.82842H4C3.73478 6.82842 3.48043 6.72307 3.29289 6.53553C3.10536 6.34799 3 6.09364 3 5.82842C3 5.56321 3.10536 5.30885 3.29289 5.12132C3.48043 4.93378 3.73478 4.82842 4 4.82842H11Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
          <div v-if="isSortMenuOpen" class="dropdown-menu active" @click.stop>
            <div
              v-for="sortOption in sortOptions"
              :key="sortOption.id"
              class="dropdown-item"
              :class="{ active: selectedSort === sortOption.id }"
              @click.stop="selectSort(sortOption.id)"
            >
              <span>{{ sortOption.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка создания проекта (неактивная) -->
      <div class="create-project-btn disabled">
        <span class="create-project-text">создать новый проект</span>
        <div class="plus-icon">
          <svg viewBox="0 0 18 18" fill="none">
            <path d="M9 0V18M0 9H18" stroke="white" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Сообщение, если проектов нет -->
    <div v-if="projects.length === 0" class="empty-projects">
      <p class="empty-projects__text">создайте свой первый проект</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Типы
interface User {
  id: string | number;
  name: string;
}

interface Status {
  id: string;
  name: string;
}

interface SelectedFilters {
  executor: (string | number)[];
  manager: (string | number)[];
  status: string[];
  actions: boolean;
}

// Состояние фильтров
const selectedFilters = ref<SelectedFilters>({
  executor: [],
  manager: [],
  status: [],
  actions: false,
});

// Состояние меню
const isFiltersMenuOpen = ref(false);
const isSortMenuOpen = ref(false);
const isExecutorSubmenuOpen = ref(false);
const isManagerSubmenuOpen = ref(false);
const isStatusSubmenuOpen = ref(false);

// Поисковые запросы
const executorSearchQuery = ref('');
const managerSearchQuery = ref('');

// Сортировка
const selectedSort = ref<string>('activity');

// Проекты (заглушка - пока пустой массив)
const projects = ref<any[]>([]);

// Данные для заглушек
const mockExecutorUsers: User[] = [
  { id: 1, name: 'Иван Иванов' },
  { id: 2, name: 'Петр Петров' },
  { id: 3, name: 'Мария Сидорова' },
  { id: 4, name: 'Алексей Смирнов' },
  { id: 5, name: 'Ольга Козлова' },
  { id: 6, name: 'Дмитрий Волков' },
];

const mockManagerUsers: User[] = [
  { id: 1, name: 'Гриднева Наталья' },
  { id: 2, name: 'Иванов Иван' },
  { id: 3, name: 'Петров Петр' },
  { id: 4, name: 'Сидорова Анна' },
  { id: 5, name: 'Смирнов Алексей' },
];

const availableStatuses: Status[] = [
  { id: 'new', name: 'новый' },
  { id: 'in_progress', name: 'в работе' },
  { id: 'completed', name: 'завершен' },
  { id: 'on_hold', name: 'на паузе' },
  { id: 'cancelled', name: 'отменен' },
];

const sortOptions = [
  { id: 'activity', name: 'активность' },
  { id: 'created', name: 'дата создания' },
  { id: 'alphabet', name: 'алфавит' },
];

// Вычисляемые свойства
const filteredExecutorUsers = computed(() => {
  const query = executorSearchQuery.value.toLowerCase().trim();
  if (!query) return mockExecutorUsers;
  return mockExecutorUsers.filter((user) => user.name.toLowerCase().includes(query));
});

const filteredManagerUsers = computed(() => {
  const query = managerSearchQuery.value.toLowerCase().trim();
  if (!query) return mockManagerUsers;
  return mockManagerUsers.filter((user) => user.name.toLowerCase().includes(query));
});

const filtersButtonText = computed(() => {
  let count = 0;
  if (selectedFilters.value.executor.length > 0) count++;
  if (selectedFilters.value.manager.length > 0) count++;
  if (selectedFilters.value.status.length > 0) count++;
  if (selectedFilters.value.actions) count++;
  return count > 0 ? `фильтры (${count})` : 'фильтры';
});

const sortButtonText = computed(() => {
  const option = sortOptions.find((opt) => opt.id === selectedSort.value);
  return option?.name || 'сортировка';
});

// Методы
function toggleFiltersMenu() {
  isFiltersMenuOpen.value = !isFiltersMenuOpen.value;
  if (isFiltersMenuOpen.value) {
    isSortMenuOpen.value = false;
  }
}

function toggleSortMenu() {
  isSortMenuOpen.value = !isSortMenuOpen.value;
  if (isSortMenuOpen.value) {
    isFiltersMenuOpen.value = false;
  }
}

function toggleFilterSubmenu(type: 'executor' | 'manager' | 'status') {
  // Закрываем другие подменю
  if (type !== 'executor') isExecutorSubmenuOpen.value = false;
  if (type !== 'manager') isManagerSubmenuOpen.value = false;
  if (type !== 'status') isStatusSubmenuOpen.value = false;

  // Переключаем текущее подменю
  if (type === 'executor') {
    isExecutorSubmenuOpen.value = !isExecutorSubmenuOpen.value;
  } else if (type === 'manager') {
    isManagerSubmenuOpen.value = !isManagerSubmenuOpen.value;
  } else if (type === 'status') {
    isStatusSubmenuOpen.value = !isStatusSubmenuOpen.value;
  }
}


function isUserSelected(type: 'executor' | 'manager', userId: string | number): boolean {
  return selectedFilters.value[type].includes(userId);
}

function toggleUserSelection(type: 'executor' | 'manager', userId: string | number) {
  const index = selectedFilters.value[type].indexOf(userId);
  if (index > -1) {
    selectedFilters.value[type].splice(index, 1);
  } else {
    selectedFilters.value[type].push(userId);
  }
}

function isStatusSelected(statusId: string): boolean {
  return selectedFilters.value.status.includes(statusId);
}

function toggleStatusSelection(statusId: string) {
  const index = selectedFilters.value.status.indexOf(statusId);
  if (index > -1) {
    selectedFilters.value.status.splice(index, 1);
  } else {
    selectedFilters.value.status.push(statusId);
  }
}

function toggleFilter(type: 'actions') {
  selectedFilters.value[type] = !selectedFilters.value[type];
}

function selectSort(sortId: string) {
  selectedSort.value = sortId;
  isSortMenuOpen.value = false;
}

function applyFilters() {
  isFiltersMenuOpen.value = false;
  isExecutorSubmenuOpen.value = false;
  isManagerSubmenuOpen.value = false;
  isStatusSubmenuOpen.value = false;
  console.log('Применены фильтры:', selectedFilters.value);
  console.log('Выбрана сортировка:', selectedSort.value);
}

function resetFilters() {
  selectedFilters.value = {
    executor: [],
    manager: [],
    status: [],
    actions: false,
  };
  executorSearchQuery.value = '';
  managerSearchQuery.value = '';
  console.log('Все фильтры сброшены');
}

// Закрытие меню при клике вне
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (
    !target.closest('.filter-btn') &&
    !target.closest('.sort-btn') &&
    !target.closest('.dropdown-menu')
  ) {
    isFiltersMenuOpen.value = false;
    isSortMenuOpen.value = false;
    isExecutorSubmenuOpen.value = false;
    isManagerSubmenuOpen.value = false;
    isStatusSubmenuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
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

.projects-view {
  padding: 24px 20px;
  font-family: 'Involve', Arial, sans-serif;
  min-height: calc(100vh - 100px);
}

/* Секция фильтров и сортировки */
.filters-container {
  max-width: 95vw;
  margin: 0 auto 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 100;
}

.filters-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.filter-btn,
.sort-btn {
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  overflow: visible;
  padding: 0;
  border: none;
}

.filter-btn {
  min-width: fit-content;
}

.sort-btn {
  min-width: fit-content;
}

.filter-btn-inner,
.sort-btn-inner {
  background: #912138;
  border-radius: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  gap: 8px;
  flex-shrink: 0;
}

.filter-text,
.sort-text,
.create-project-text {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
}

.filter-icon,
.sort-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  position: relative;
}

.filter-icon svg,
.sort-icon svg {
  width: 100%;
  height: 100%;
  display: block;
  margin: 0;
}

.plus-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plus-icon svg {
  width: 100%;
  height: 100%;
  stroke: #ffffff;
  fill: none;
}

.create-project-btn {
  background: #912138;
  border-radius: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  gap: 16px;
  cursor: pointer;
  min-width: fit-content;
  border: none;
}

.create-project-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.create-project-text {
  flex: 1;
}

/* Выпадающие меню */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: rgba(145, 33, 56, 0.95);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 16px;
  padding: 8px 0;
  min-width: 200px;
  z-index: 10000;
  display: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.dropdown-menu.active {
  display: block;
}

.dropdown-item {
  padding: 10px 20px;
  color: #e1eaf8;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.dropdown-item .checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid #e1eaf8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dropdown-item.active .checkbox {
  border-color: #ffffff;
  background: #ffffff;
}

.dropdown-item .checkbox svg {
  width: 10px;
  height: 10px;
  stroke: #912138;
  fill: none;
  display: none;
}

.dropdown-item.active .checkbox svg {
  display: block;
  stroke: #912138;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 10px 0;
}

.apply-btn {
  flex: 1;
  padding: 8px 16px;
  background: #912138;
  border-radius: 16px;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
}

.apply-btn:hover {
  background: #a02a43;
}

.reset-filters-btn {
  padding: 8px 16px;
  background: #912138;
  border-radius: 16px;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: none;
}

.reset-filters-btn:hover {
  background: #a02a43;
}

.reset-filters-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-filters-icon svg {
  width: 100%;
  height: 100%;
  stroke: #ffffff;
  fill: none;
}

.filter-btn .dropdown-menu {
  padding-bottom: 6px;
}

.sort-btn .dropdown-menu {
  min-width: 220px;
}

.filter-btn .dropdown-menu {
  min-width: 280px;
  max-width: 400px;
}

/* Подменю фильтров */
.filter-submenu {
  display: none;
  padding: 6px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 6px;
}

.filter-submenu.active {
  display: block;
}

.filter-search {
  padding: 6px 20px;
  margin-bottom: 6px;
}

.filter-search-input {
  width: 100%;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
}

.filter-search-input::placeholder {
  color: rgba(225, 234, 248, 0.6);
}

.filter-search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.filter-results {
  max-height: 180px;
  overflow-y: auto;
  padding: 0 10px;
}

.filter-result-item {
  padding: 6px 10px;
  color: #e1eaf8;
  font-size: 0.9375rem;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-radius: 6px;
  margin-bottom: 3px;
}

.filter-result-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-result-item.selected {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.filter-result-item .checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid #e1eaf8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.filter-result-item.selected .checkbox {
  border-color: #ffffff;
  background: #ffffff;
}

.filter-result-item .checkbox svg {
  width: 10px;
  height: 10px;
  stroke: #912138;
  fill: none;
  display: none;
}

.filter-result-item.selected .checkbox svg {
  display: block;
}

.filter-status-list {
  padding: 6px 0;
}

.filter-status-item {
  padding: 6px 20px;
  color: #e1eaf8;
  font-size: 0.9375rem;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.filter-status-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-status-item.selected {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.filter-status-item .checkbox {
  width: 16px;
  height: 16px;
  border: 2px solid #e1eaf8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.filter-status-item.selected .checkbox {
  border-color: #ffffff;
  background: #ffffff;
}

.filter-status-item .checkbox svg {
  width: 10px;
  height: 10px;
  stroke: #912138;
  fill: none;
  display: none;
}

.filter-status-item.selected .checkbox svg {
  display: block;
}

.dropdown-item.expandable {
  position: relative;
}

.dropdown-item.expandable::after {
  content: '';
  width: 0;
  height: 0;
  border-left: 5px solid #e1eaf8;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  margin-left: auto;
  transition: transform 0.2s;
}

.dropdown-item.expandable.expanded::after {
  transform: rotate(90deg);
}

/* Сообщение, если проектов нет */
.empty-projects {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
}

.empty-projects__text {
  color: #e1eaf8;
  font-size: 1.25rem;
  font-weight: 400;
  text-align: center;
  margin: 0;
}

/* Адаптивность для секции фильтров */
@media (max-width: 1280px) {
  .filter-text,
  .sort-text,
  .create-project-text {
    font-size: 0.9375rem;
  }

  .filter-btn-inner,
  .sort-btn-inner {
    padding: 10px 18px;
  }
}

@media (max-width: 1100px) {
  .filter-text,
  .sort-text,
  .create-project-text {
    font-size: 0.875rem;
  }

  .filter-btn-inner,
  .sort-btn-inner {
    padding: 10px 16px;
    gap: 8px;
  }
}

@media (max-width: 900px) {
  .filters-container {
    flex-wrap: wrap;
  }

  .create-project-btn {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left {
    width: 100%;
    justify-content: space-between;
  }

  .filter-btn,
  .sort-btn {
    flex: 1;
    max-width: 48%;
    background: #912138;
    border-radius: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    gap: 16px;
    min-width: fit-content;
  }

  .filter-btn-inner,
  .sort-btn-inner {
    width: 100%;
    background: transparent;
    padding: 0;
    gap: 16px;
    height: auto;
    border-radius: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .filter-text,
  .sort-text {
    font-size: 0.875rem;
  }

  .create-project-btn {
    width: 100%;
    height: 40px;
  }

  .create-project-text {
    font-size: 0.875rem;
  }
}

@media (max-width: 640px) {
  .filter-btn,
  .sort-btn {
    padding: 10px 16px;
    gap: 12px;
    height: 40px;
  }

  .filter-text,
  .sort-text {
    font-size: 0.8125rem;
  }

  .filter-btn-inner,
  .sort-btn-inner {
    padding: 0;
    gap: 12px;
  }

  .filter-icon,
  .sort-icon {
    width: 1.125rem;
    height: 1.125rem;
  }
}
</style>
