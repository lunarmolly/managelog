<template>
  <div class="tasks-view">
    <!-- Мобильная панель сверху -->
    <div class="tasks-mobile-header">
      <button class="back-btn" @click="$router.push('/projects')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>к проектам</span>
      </button>
      <h2 class="mobile-project-name">{{ project?.name || 'Загрузка...' }}</h2>
      <div class="mobile-actions">
        <button class="info-btn" @click="showProjectInfo = !showProjectInfo">
          информация
        </button>
        <div class="search-box-mobile">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="найти"
            class="search-input"
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="search-icon">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Левая панель -->
    <div class="tasks-sidebar">
      <button class="back-btn" @click="$router.push('/projects')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>к проектам</span>
      </button>
      
      <div class="project-info">
        <h2 class="project-name">{{ project?.name || 'Загрузка...' }}</h2>
        <button class="info-btn" @click="showProjectInfo = !showProjectInfo">
          информация
        </button>
      </div>

      <div class="projects-list">
        <h3 class="projects-list-title">актуальные проекты</h3>
        <div class="projects-list-items">
          <div
            v-for="proj in displayedProjects"
            :key="proj.id"
            class="project-item"
            @click="navigateToProject(proj.id)"
          >
            <span class="project-item-name">{{ proj.name }}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div v-if="hasMoreProjects" class="project-item">
            <span class="project-item-name">еще</span>
          </div>
        </div>
      </div>

      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="найти"
          class="search-input"
        />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="search-icon">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>

    <!-- Основная область -->
    <div class="tasks-main">
      <div class="kanban-board">
        <div
          v-for="column in sortedColumns"
          :key="column.id"
          class="kanban-column"
          :class="{ 'drag-over': draggedOverColumn === column.id }"
          @dragover="handleDragOver(column.id, $event)"
          @dragleave="handleDragLeave(column.id)"
          @drop="handleDrop(column.id, $event)"
        >
          <div class="column-header">
            <h3 class="column-title">{{ column.name }}</h3>
            <div class="column-actions">
              <button class="column-action-btn" @click.stop="openCreateTaskModal(column.id)" title="Добавить задачу">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <button class="column-action-btn" @click.stop="toggleColumnMenu(column.id)" title="Меню">
                <svg width="3" height="15" viewBox="0 0 3 15" fill="none">
                  <circle cx="1.5" cy="2.5" r="1.5" fill="currentColor"/>
                  <circle cx="1.5" cy="7.5" r="1.5" fill="currentColor"/>
                  <circle cx="1.5" cy="12.5" r="1.5" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="column-tasks">
            <div
              v-for="task in getTasksForColumn(column.id)"
              :key="task.id"
              class="task-card"
              :class="{ 'dragging': draggedTask?.id === task.id }"
              draggable="true"
              @dragstart="handleDragStart(task, $event)"
              @dragend="handleDragEnd"
              @click="openTaskModal(task)"
            >
              <!-- 1. Чекбокс -->
              <div class="task-card-top">
                <label class="task-checkbox-wrapper" @click.stop>
                  <input
                    type="checkbox"
                    :checked="task.isCompleted"
                    @change="toggleTaskComplete(task)"
                    :disabled="!canCompleteTask(task)"
                    class="task-checkbox"
                  />
                  <span class="task-checkbox-custom"></span>
                </label>
                
                <!-- 2. Название -->
                <h4 class="task-name" @click.stop="openTaskModal(task)">{{ task.name }}</h4>
                
                <!-- 3. Важная или нет -->
                <button 
                  class="task-important-btn"
                  :class="{ 'active': task.isImportant }"
                  @click.stop="toggleTaskImportant(task)"
                  :title="task.isImportant ? 'убрать важность' : 'отметить важной'"
                >
                  <img 
                    :src="task.isImportant ? '/images/icons/tasks/fire-active.svg' : '/images/icons/tasks/fire-unactive.svg'" 
                    :alt="task.isImportant ? 'важная задача' : 'не важная задача'" 
                  />
                </button>
              </div>

              <!-- 4. Отслеживание времени -->
              <div class="task-timer-section">
                <button 
                  class="task-timer-btn"
                  :class="{ 
                    'running': activeTimerTaskId === task.id,
                    'has-time': task.timeSpent && task.timeSpent > 0
                  }"
                  @click.stop="toggleTimer(task)"
                  :disabled="task.isCompleted"
                >
                  <svg v-if="activeTimerTaskId === task.id" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ getDisplayTime(task) }}</span>
                </button>
              </div>

              <!-- 5. Дедлайн -->
              <div class="task-deadline-section">
                <button 
                  class="task-deadline-btn"
                  :class="{ 
                    'empty': !task.deadline, 
                    'filled': task.deadline && !isDeadlineOverdue(task.deadline, task.isCompleted),
                    'overdue': isDeadlineOverdue(task.deadline, task.isCompleted)
                  }"
                  @click.stop="openDeadlinePicker(task, $event)"
                  :title="task.deadline ? 'изменить дедлайн' : 'установить дедлайн'"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>{{ task.deadline ? formatDate(task.deadline) : 'установить дедлайн' }}</span>
                </button>
              </div>

              <!-- 6. Участники (кроме наблюдателей) -->
              <div v-if="getTaskActiveParticipants(task).length > 0" class="task-participants">
                <div
                  v-for="(participant, index) in getTaskActiveParticipants(task)"
                  :key="participant.id"
                  class="participant-avatar"
                  :style="{ 
                    zIndex: getTaskActiveParticipants(task).length - index,
                    marginLeft: index > 0 ? '-12px' : '0'
                  }"
                  @click.stop
                >
                  <img
                    v-if="participant.avatar"
                    :src="getAvatarUrl(participant.avatar)"
                    :alt="participant.displayName || participant.firstName || ''"
                  />
                  <div v-else class="participant-placeholder">
                    {{ (participant.displayName || participant.firstName || participant.login || '?')[0].toUpperCase() }}
                  </div>
                </div>
              </div>

              <!-- 7. Прикрепленные файлы -->
              <div v-if="task.files.length > 0" class="task-files-section">
                <div
                  v-for="file in task.files"
                  :key="file.url"
                  class="task-file-item"
                  @click.stop="downloadFile(file.url, file.name)"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="task-file-name">{{ file.name }}</span>
                </div>
              </div>
            </div>

            <!-- Кнопка создания первой задачи -->
            <div v-if="getTasksForColumn(column.id).length === 0" class="create-first-task" @click="openCreateTaskModal(column.id)">
              <span>Создать первую задачу</span>
            </div>
          </div>
        </div>

        <!-- Кнопка создания столбца -->
        <button
          v-if="canCreateColumn"
          class="add-column-btn"
          @click="openCreateColumnModal"
        >
          <span>Создать столбец</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Модальное окно создания задачи -->
    <Teleport to="body">
      <div v-if="showCreateTaskModal" class="modal-overlay" @click="closeCreateTaskModal">
        <div class="create-task-modal" @click.stop>
          <div class="modal-header">
            <button class="modal-close-btn" @click="closeCreateTaskModal" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <h2 class="modal-title">создать задачу</h2>
            <div class="modal-subtitle">заполните информацию о задаче</div>
          </div>

          <!-- Название -->
          <div class="modal-field">
            <label class="modal-field-label" for="task-name">
              название задачи
              <span class="modal-field-required">*</span>
            </label>
            <div class="modal-input-wrapper">
              <input
                id="task-name"
                v-model="newTask.name"
                type="text"
                class="modal-field-input"
                placeholder="введите название задачи"
                required
              />
            </div>
          </div>

          <!-- Описание -->
          <div class="modal-field">
            <label class="modal-field-label" for="task-description">
              описание задачи
            </label>
            <div class="modal-textarea-wrapper">
              <textarea
                id="task-description"
                v-model="newTask.description"
                class="modal-description-textarea"
                placeholder="опишите задачу..."
                rows="6"
              ></textarea>
              <div class="modal-textarea-footer">
                <span class="modal-char-count">{{ newTask.description.length }} символов</span>
              </div>
            </div>
          </div>

           <!-- Генерация описания -->
           <div class="modal-generate-section">
             <div class="modal-generate-btn" @click="generateDescription">
               <div class="modal-generate-btn-icon">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path
                     d="M9.01238 5.448C9.61038 3.698 12.0284 3.645 12.7374 5.289L12.7974 5.449L13.6044 7.809C13.7893 8.35023 14.0882 8.84551 14.4808 9.26142C14.8734 9.67734 15.3507 10.0042 15.8804 10.22L16.0974 10.301L18.4574 11.107C20.2074 11.705 20.2604 14.123 18.6174 14.832L18.4574 14.892L16.0974 15.699C15.556 15.8838 15.0605 16.1826 14.6444 16.5753C14.2283 16.9679 13.9013 17.4452 13.6854 17.975L13.6044 18.191L12.7984 20.552C12.2004 22.302 9.78238 22.355 9.07438 20.712L9.01238 20.552L8.20638 18.192C8.02156 17.6506 7.72275 17.1551 7.33012 16.739C6.93749 16.3229 6.46017 15.9959 5.93038 15.78L5.71438 15.699L3.35438 14.893C1.60338 14.295 1.55038 11.877 3.19438 11.169L3.35438 11.107L5.71438 10.301C6.25561 10.1161 6.75089 9.81719 7.1668 9.42457C7.58271 9.03195 7.90959 8.55469 8.12538 8.025L8.20638 7.809L9.01238 5.448ZM10.9054 6.094L10.0994 8.454C9.81777 9.2793 9.35965 10.0333 8.75691 10.6635C8.15418 11.2937 7.42132 11.7849 6.60938 12.103L6.35938 12.194L3.99938 13L6.35938 13.806C7.18468 14.0876 7.93868 14.5457 8.56887 15.1485C9.19907 15.7512 9.6903 16.4841 10.0084 17.296L10.0994 17.546L10.9054 19.906L11.7114 17.546C11.993 16.7207 12.4511 15.9667 13.0538 15.3365C13.6566 14.7063 14.3894 14.2151 15.2014 13.897L15.4514 13.807L17.8114 13L15.4514 12.194C14.6261 11.9124 13.8721 11.4543 13.2419 10.8515C12.6117 10.2488 12.1205 9.51595 11.8024 8.704L11.7124 8.454L10.9054 6.094ZM18.9054 2C19.0925 2 19.2758 2.05248 19.4345 2.15147C19.5933 2.25046 19.7211 2.392 19.8034 2.56L19.8514 2.677L20.2014 3.703L21.2284 4.053C21.4159 4.1167 21.5802 4.23462 21.7006 4.39182C21.821 4.54902 21.892 4.73842 21.9047 4.93602C21.9173 5.13362 21.871 5.33053 21.7716 5.50179C21.6722 5.67304 21.5242 5.81094 21.3464 5.898L21.2284 5.946L20.2024 6.296L19.8524 7.323C19.7886 7.51043 19.6706 7.6747 19.5133 7.79499C19.356 7.91529 19.1666 7.98619 18.969 7.99872C18.7714 8.01125 18.5746 7.96484 18.4034 7.86538C18.2322 7.76591 18.0944 7.61787 18.0074 7.44L17.9594 7.323L17.6094 6.297L16.5824 5.947C16.3949 5.8833 16.2305 5.76538 16.1101 5.60819C15.9898 5.45099 15.9187 5.26158 15.9061 5.06398C15.8935 4.86638 15.9398 4.66947 16.0392 4.49821C16.1385 4.32696 16.2865 4.18906 16.4644 4.102L16.5824 4.054L17.6084 3.704L17.9584 2.677C18.0258 2.47943 18.1534 2.30791 18.3232 2.1865C18.493 2.06509 18.6966 1.99987 18.9054 2Z"
                     fill="currentColor"
                   />
                 </svg>
               </div>
               <div class="modal-generate-btn-text">сгенерировать описание</div>
             </div>
            <div
              v-if="generatedDescription"
              class="modal-generated-description"
            >
              <div class="modal-generated-content">
                <div class="modal-generated-text">{{ generatedDescription }}</div>
                <div class="modal-generated-actions">
                  <div class="modal-action-btn modal-action-accept" @click="acceptGeneratedDescription">
                    <div class="modal-action-btn-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <span>принять</span>
                  </div>
                  <div class="modal-action-btn modal-action-refine" @click="refineGeneratedDescription">
                    <div class="modal-action-btn-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <span>доработать</span>
                  </div>
                  <div class="modal-action-btn modal-action-delete" @click="deleteGeneratedDescription">
                    <div class="modal-action-btn-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <span>удалить</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Постановщик, исполнитель, наблюдатели -->
          <div class="modal-field">
            <label class="modal-field-label">участники</label>
            <div class="task-modal-participants-row">
              <div class="task-modal-participant-field">
                <button
                  class="task-modal-participant-btn"
                  :class="{ 'selected': newTask.creatorId }"
                  @click="showCreatorSelect = !showCreatorSelect"
                >
                  <img v-if="getCreatorAvatar()" :src="getAvatarUrl(getCreatorAvatar())" alt="постановщик" class="task-modal-participant-avatar-btn" />
                  <img v-else src="/images/icons/tasks/creator.svg" alt="постановщик" />
                  <span>{{ getCreatorName() || 'постановщик' }}</span>
                </button>
                <!-- Выпадающий список постановщика -->
                <div v-if="showCreatorSelect" class="task-modal-participants-dropdown" @click.stop>
                  <div class="task-modal-participants-search">
                    <input
                      v-model="creatorSearchQuery"
                      type="text"
                      placeholder="поиск..."
                      class="task-modal-participants-search-input"
                      @click.stop
                    />
                  </div>
                  <div class="task-modal-participants-list">
                    <div
                      v-for="user in filteredCreatorUsers"
                      :key="user.id"
                      class="task-modal-participant-option"
                      @click="selectCreator(user.id)"
                    >
                      <img v-if="user.avatar" :src="getAvatarUrl(user.avatar)" :alt="getUserDisplayNameWithRole(user)" />
                      <div v-else class="task-modal-participant-avatar-placeholder">
                        {{ (user.firstName || user.displayName || user.login || '?')[0].toUpperCase() }}
                      </div>
                      <span>{{ getUserDisplayNameWithRole(user) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="task-modal-participant-field">
                <button
                  class="task-modal-participant-btn"
                  :class="{ 'selected': newTask.assigneeId }"
                  @click="showAssigneeSelect = !showAssigneeSelect"
                >
                  <img v-if="getAssigneeAvatar()" :src="getAvatarUrl(getAssigneeAvatar())" alt="исполнитель" class="task-modal-participant-avatar-btn" />
                  <img v-else src="/images/icons/tasks/executor.svg" alt="исполнитель" />
                  <span>{{ getAssigneeName() || 'исполнитель' }}</span>
                  <button
                    v-if="newTask.assigneeId"
                    class="task-modal-participant-clear"
                    @click.stop="clearAssignee"
                    title="Очистить"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </button>
                <!-- Выпадающий список исполнителя -->
                <div v-if="showAssigneeSelect" class="task-modal-participants-dropdown" @click.stop>
                  <div class="task-modal-participants-search">
                    <input
                      v-model="assigneeSearchQuery"
                      type="text"
                      placeholder="поиск..."
                      class="task-modal-participants-search-input"
                      @click.stop
                    />
                  </div>
                  <div class="task-modal-participants-list">
                    <div
                      v-for="user in filteredAssigneeUsers"
                      :key="user.id"
                      class="task-modal-participant-option"
                      @click="selectAssignee(user.id)"
                    >
                      <img v-if="user.avatar" :src="getAvatarUrl(user.avatar)" :alt="getUserDisplayNameWithRole(user)" />
                      <div v-else class="task-modal-participant-avatar-placeholder">
                        {{ (user.firstName || user.displayName || user.login || '?')[0].toUpperCase() }}
                      </div>
                      <span>{{ getUserDisplayNameWithRole(user) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="task-modal-participant-field">
                <button
                  class="task-modal-participant-btn"
                  :class="{ 'selected': newTask.watcherIds.length > 0 }"
                  @click="showWatchersSelect = !showWatchersSelect"
                >
                  <img v-if="getWatchersAvatar()" :src="getAvatarUrl(getWatchersAvatar())" alt="наблюдатели" class="task-modal-participant-avatar-btn" />
                  <img v-else src="/images/icons/tasks/watcher.svg" alt="наблюдатели" />
                  <span>{{ getWatchersDisplayText() }}</span>
                  <button
                    v-if="newTask.watcherIds.length > 0"
                    class="task-modal-participant-clear"
                    @click.stop="clearWatchers"
                    title="Очистить"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </button>
                <!-- Выпадающий список наблюдателей -->
                <div v-if="showWatchersSelect" class="task-modal-participants-dropdown" @click.stop>
                  <div class="task-modal-participants-search">
                    <input
                      v-model="watchersSearchQuery"
                      type="text"
                      placeholder="поиск..."
                      class="task-modal-participants-search-input"
                      @click.stop
                    />
                  </div>
                  <div class="task-modal-participants-list">
                    <div
                      v-for="user in filteredWatcherUsers"
                      :key="user.id"
                      class="task-modal-participant-option"
                      :class="{ 'selected': newTask.watcherIds.includes(user.id) }"
                      @click="toggleWatcher(user.id)"
                    >
                      <img v-if="user.avatar" :src="getAvatarUrl(user.avatar)" :alt="getUserDisplayNameWithRole(user)" />
                      <div v-else class="task-modal-participant-avatar-placeholder">
                        {{ (user.firstName || user.displayName || user.login || '?')[0].toUpperCase() }}
                      </div>
                      <span>{{ getUserDisplayNameWithRole(user) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Важная задача и дедлайн -->
          <div class="modal-field-group">
            <div class="modal-field">
              <label class="modal-field-label">важная задача</label>
              <button 
                class="task-important-btn"
                :class="{ 'active': isImportantTask }"
                @click="isImportantTask = !isImportantTask"
              >
                <img 
                  :src="isImportantTask ? '/images/icons/tasks/fire-active.svg' : '/images/icons/tasks/fire-unactive.svg'" 
                  alt="важная задача" 
                />
              </button>
            </div>
            <div class="modal-field">
              <label class="modal-field-label" for="task-deadline">дедлайн</label>
              <div class="modal-input-wrapper">
                <input
                  id="task-deadline"
                  v-model="newTask.deadline"
                  type="datetime-local"
                  class="modal-field-input"
                />
              </div>
            </div>
          </div>

          <!-- Загрузка файлов -->
          <div class="modal-field">
            <label class="modal-field-label" for="task-files">прикрепленные файлы</label>
            <div class="modal-file-upload">
              <input
                id="task-files"
                ref="taskFilesInput"
                type="file"
                multiple
                accept="*/*"
                @change="handleFileSelect"
                class="modal-file-input"
              />
              <label for="task-files" class="modal-file-label">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>выбрать файлы (до 10 МБ)</span>
              </label>
              <div v-if="selectedFiles.length > 0" class="modal-file-list">
                <div
                  v-for="(file, index) in selectedFiles"
                  :key="index"
                  class="modal-file-item"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span class="modal-file-name">{{ file.name }}</span>
                  <button
                    type="button"
                    class="modal-file-remove"
                    @click="removeFile(index)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="modal-actions">
            <div class="modal-btn modal-btn-create" @click="createTask">
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 5v14m7-7H5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>создать задачу</span>
            </div>
            <div class="modal-btn modal-btn-cancel" @click="closeCreateTaskModal">
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6C21 6.26522 20.8946 6.51957 20.7071 6.70711C20.5196 6.89464 20.2652 7 20 7H19L18.997 7.071L18.064 20.142C18.0281 20.6466 17.8023 21.1188 17.4321 21.4636C17.0619 21.8083 16.5749 22 16.069 22H7.93C7.42414 22 6.93707 21.8083 6.56688 21.4636C6.1967 21.1188 5.97092 20.6466 5.935 20.142L5.002 7.072L5 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H20ZM16.997 7H7.003L7.931 20H16.069L16.997 7ZM14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3C15 3.26522 14.8946 3.51957 14.7071 3.70711C14.5196 3.89464 14.2652 4 14 4H10C9.73478 4 9.48043 3.89464 9.29289 3.70711C9.10536 3.51957 9 3.26522 9 3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2H14Z"
                    fill="#912138"
                  />
                </svg>
              </div>
              <span>отмена</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Модальное окно редактирования задачи -->
    <Teleport to="body">
      <div v-if="showEditTaskModal && selectedTask" class="modal-overlay" @click="closeEditTaskModal">
        <div class="edit-task-modal" @click.stop>
          <div class="modal-header">
            <button class="modal-close-btn" @click="closeEditTaskModal" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <h2 class="modal-title">Редактировать задачу</h2>
            <div class="modal-subtitle">Измените информацию о задаче</div>
          </div>

          <!-- Название -->
          <div class="modal-field">
            <label class="modal-field-label" for="edit-task-name">
              Название задачи
              <span class="modal-field-required">*</span>
            </label>
            <div class="modal-input-wrapper">
              <input
                id="edit-task-name"
                v-model="editTask.name"
                type="text"
                class="modal-field-input"
                :disabled="!canEditTask(selectedTask) && !canCompleteTask(selectedTask)"
                required
              />
            </div>
          </div>

          <!-- Описание -->
          <div class="modal-field">
            <label class="modal-field-label" for="edit-task-description">
              Описание задачи
            </label>
            <div class="modal-textarea-wrapper">
              <textarea
                id="edit-task-description"
                v-model="editTask.description"
                class="modal-description-textarea"
                :disabled="!canEditTask(selectedTask) && !canCompleteTask(selectedTask)"
                placeholder="Опишите задачу..."
                rows="6"
              ></textarea>
              <div class="modal-textarea-footer">
                <span class="modal-char-count">{{ editTask.description.length }} символов</span>
              </div>
            </div>
          </div>

          <!-- Постановщик, исполнитель, наблюдатели -->
          <div class="modal-field">
            <label class="modal-field-label">Участники</label>
            <div class="task-modal-participants-row">
              <div class="task-modal-participant-display">
                <img
                  v-if="selectedTask.creator.avatar"
                  :src="getAvatarUrl(selectedTask.creator.avatar)"
                  :alt="selectedTask.creator.displayName || ''"
                  class="task-modal-participant-avatar"
                />
                <div v-else class="task-modal-participant-avatar-placeholder">
                  {{ (selectedTask.creator.displayName || selectedTask.creator.firstName || selectedTask.creator.login || '?')[0].toUpperCase() }}
                </div>
                <span>{{ getCreatorDisplayName(selectedTask.creator) }}</span>
              </div>
              <div class="task-modal-participant-display">
                <img
                  v-if="selectedTask.assignee?.avatar"
                  :src="getAvatarUrl(selectedTask.assignee.avatar)"
                  :alt="selectedTask.assignee.displayName || ''"
                  class="task-modal-participant-avatar"
                />
                <div v-else-if="selectedTask.assignee" class="task-modal-participant-avatar-placeholder">
                  {{ (selectedTask.assignee.displayName || selectedTask.assignee.firstName || selectedTask.assignee.login || '?')[0].toUpperCase() }}
                </div>
                <span>{{ selectedTask.assignee ? getCreatorDisplayName(selectedTask.assignee) : 'исполнитель' }}</span>
              </div>
              <div class="task-modal-participant-display">
                <img
                  v-if="selectedTask.watchers && selectedTask.watchers.length > 0 && selectedTask.watchers[0].avatar"
                  :src="getAvatarUrl(selectedTask.watchers[0].avatar)"
                  :alt="selectedTask.watchers[0].displayName || ''"
                  class="task-modal-participant-avatar"
                />
                <div v-else-if="selectedTask.watchers && selectedTask.watchers.length > 0" class="task-modal-participant-avatar-placeholder">
                  {{ (selectedTask.watchers[0].displayName || selectedTask.watchers[0].firstName || selectedTask.watchers[0].login || '?')[0].toUpperCase() }}
                </div>
                <span>{{ selectedTask.watchers && selectedTask.watchers.length > 0 ? getCreatorDisplayName(selectedTask.watchers[0]) : 'наблюдатели' }}</span>
              </div>
            </div>
          </div>

          <!-- Время, редактор, дедлайн -->
          <div class="modal-field-group">
            <div class="modal-field">
              <label class="modal-field-label">Время</label>
              <div class="modal-input-wrapper">
                <input
                  v-model="editTask.timeSpent"
                  type="text"
                  class="modal-field-input"
                  :disabled="!canEditTask(selectedTask) && !canCompleteTask(selectedTask)"
                  placeholder="00:00"
                />
              </div>
            </div>
            <div class="modal-field">
              <label class="modal-field-label" for="edit-task-deadline">Дедлайн</label>
              <div class="modal-input-wrapper">
                <input
                  id="edit-task-deadline"
                  v-model="editTask.deadline"
                  type="datetime-local"
                  class="modal-field-input"
                  :disabled="!canEditTask(selectedTask) && !canCompleteTask(selectedTask)"
                />
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="modal-actions">
            <button
              v-if="canEditTask(selectedTask)"
              class="modal-btn modal-btn-create"
              @click="updateTask"
            >
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>сохранить</span>
            </button>
            <button
              v-if="canCompleteTask(selectedTask) && !canEditTask(selectedTask)"
              class="modal-btn modal-btn-create"
              @click="completeTask"
            >
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>готово</span>
            </button>
            <button
              v-if="canEditTask(selectedTask)"
              class="modal-btn modal-btn-cancel"
              @click="deleteTask"
            >
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6C21 6.26522 20.8946 6.51957 20.7071 6.70711C20.5196 6.89464 20.2652 7 20 7H19L18.997 7.071L18.064 20.142C18.0281 20.6466 17.8023 21.1188 17.4321 21.4636C17.0619 21.8083 16.5749 22 16.069 22H7.93C7.42414 22 6.93707 21.8083 6.56688 21.4636C6.1967 21.1188 5.97092 20.6466 5.935 20.142L5.002 7.072L5 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H20ZM16.997 7H7.003L7.931 20H16.069L16.997 7ZM14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3C15 3.26522 14.8946 3.51957 14.7071 3.70711C14.5196 3.89464 14.2652 4 14 4H10C9.73478 4 9.48043 3.89464 9.29289 3.70711C9.10536 3.51957 9 3.26522 9 3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2H14Z"
                    fill="#912138"
                  />
                </svg>
              </div>
              <span>удалить</span>
            </button>
            <button class="modal-btn modal-btn-cancel" @click="closeEditTaskModal">
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6C21 6.26522 20.8946 6.51957 20.7071 6.70711C20.5196 6.89464 20.2652 7 20 7H19L18.997 7.071L18.064 20.142C18.0281 20.6466 17.8023 21.1188 17.4321 21.4636C17.0619 21.8083 16.5749 22 16.069 22H7.93C7.42414 22 6.93707 21.8083 6.56688 21.4636C6.1967 21.1188 5.97092 20.6466 5.935 20.142L5.002 7.072L5 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H20ZM16.997 7H7.003L7.931 20H16.069L16.997 7ZM14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3C15 3.26522 14.8946 3.51957 14.7071 3.70711C14.5196 3.89464 14.2652 4 14 4H10C9.73478 4 9.48043 3.89464 9.29289 3.70711C9.10536 3.51957 9 3.26522 9 3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2H14Z"
                    fill="#912138"
                  />
                </svg>
              </div>
              <span>отмена</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showCreateColumnModal" class="modal-overlay" @click="closeCreateColumnModal">
        <div class="task-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">создать столбец</h3>
            <button class="modal-close" @click="closeCreateColumnModal">×</button>
          </div>
          <div class="modal-content">
            <div class="form-group">
              <label class="form-label">название:</label>
              <input
                v-model="newColumn.name"
                type="text"
                class="form-input"
                placeholder="Введите название колонки"
              />
            </div>
            <div class="form-actions">
              <button class="btn-create" @click="createColumn">создать столбец</button>
              <button class="btn-cancel" @click="closeCreateColumnModal">отмена</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getColumns,
  createColumn as createColumnApi,
  getTasks,
  getTask as getTaskApi,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  completeTask as completeTaskApi,
  deleteTask as deleteTaskApi,
  uploadTaskFile,
  type Column,
  type Task,
  type UserInfo,
} from '../api/tasks';
import { getProject, getProjects, updateProject, type Project } from '../api/projects';
import { getCompanyUsers, getUserInfo, type CompanyUser } from '../api/user';

const route = useRoute();
const router = useRouter();

const projectId = computed(() => route.params.id as string);

const project = ref<Project | null>(null);
const projects = ref<Project[]>([]);
const columns = ref<Column[]>([]);
const tasks = ref<Task[]>([]);
const projectParticipants = ref<CompanyUser[]>([]);
const companyUsers = ref<CompanyUser[]>([]);
const currentUser = ref<CompanyUser | null>(null);

const searchQuery = ref('');
const showCreateTaskModal = ref(false);
const showEditTaskModal = ref(false);
const showCreateColumnModal = ref(false);
const showProjectInfo = ref(false);
const selectedTask = ref<Task | null>(null);
const selectedColumnId = ref<string>('');

const newTask = ref({
  name: '',
  description: '',
  columnId: '',
  creatorId: '',
  assigneeId: '',
  watcherIds: [] as string[],
  deadline: '',
  subtasks: [] as Array<{ name: string; isCompleted: boolean }>,
});

const showCreatorSelect = ref(false);
const showAssigneeSelect = ref(false);
const showWatchersSelect = ref(false);
const showDeadlinePicker = ref(false);
const showSubtasksModal = ref(false);
const showChecklistModal = ref(false);

const creatorSearchQuery = ref('');
const assigneeSearchQuery = ref('');
const watchersSearchQuery = ref('');

const editTask = ref({
  name: '',
  description: '',
  assigneeId: '',
  watcherIds: [] as string[],
  subtasks: [] as Array<{ name: string; isCompleted: boolean }>,
  deadline: '',
  timeSpent: 0,
});

const showEditSubtasksModal = ref(false);
const showEditChecklistModal = ref(false);
const generatedDescription = ref('');
const isImportantTask = ref(false);

// Таймер для отслеживания времени
const activeTimerTaskId = ref<string | null>(null);
const timerStartTime = ref<number | null>(null);
const timerInterval = ref<number | null>(null);
const timerElapsedMinutes = ref<number>(0);

// Файлы для загрузки
const selectedFiles = ref<File[]>([]);
const taskFilesInput = ref<HTMLInputElement | null>(null);

const newColumn = ref({
  name: '',
});

// Drag and Drop state
const draggedTask = ref<Task | null>(null);
const draggedOverColumn = ref<string | null>(null);
const isDragging = ref(false);

function getUserDisplayNameWithRole(user: CompanyUser): string {
  const firstName = user.firstName || user.displayName || user.login || '';
  const lastName = user.lastName || '';
  const role = user.role || '';
  
  if (role) {
    return `${firstName} ${role}`;
  }
  
  if (lastName) {
    return `${firstName} ${lastName}`;
  }
  
  return firstName;
}

const sortedColumns = computed(() => {
  return [...columns.value].sort((a, b) => a.order - b.order);
});

const availableProjects = computed(() => {
  // Исключаем текущий проект из списка
  return projects.value.filter(proj => proj.id !== projectId.value);
});

const displayedProjects = computed(() => {
  // Показываем до 5 проектов
  return availableProjects.value.slice(0, 5);
});

const hasMoreProjects = computed(() => {
  // Проверяем, есть ли еще проекты после первых 5
  return availableProjects.value.length > 5;
});

const filteredCreatorUsers = computed(() => {
  if (!creatorSearchQuery.value.trim()) {
    return companyUsers.value;
  }
  const query = creatorSearchQuery.value.toLowerCase().trim();
  return companyUsers.value.filter((user) => {
    const firstName = (user.firstName || user.displayName || user.login || '').toLowerCase();
    const lastName = (user.lastName || '').toLowerCase();
    const role = (user.role || '').toLowerCase();
    return firstName.includes(query) || lastName.includes(query) || role.includes(query);
  });
});

const filteredAssigneeUsers = computed(() => {
  if (!assigneeSearchQuery.value.trim()) {
    return companyUsers.value;
  }
  const query = assigneeSearchQuery.value.toLowerCase().trim();
  return companyUsers.value.filter((user) => {
    const firstName = (user.firstName || user.displayName || user.login || '').toLowerCase();
    const lastName = (user.lastName || '').toLowerCase();
    const role = (user.role || '').toLowerCase();
    return firstName.includes(query) || lastName.includes(query) || role.includes(query);
  });
});

const filteredWatcherUsers = computed(() => {
  if (!watchersSearchQuery.value.trim()) {
    return companyUsers.value;
  }
  const query = watchersSearchQuery.value.toLowerCase().trim();
  return companyUsers.value.filter((user) => {
    const firstName = (user.firstName || user.displayName || user.login || '').toLowerCase();
    const lastName = (user.lastName || '').toLowerCase();
    const role = (user.role || '').toLowerCase();
    return firstName.includes(query) || lastName.includes(query) || role.includes(query);
  });
});

const filteredTasks = computed(() => {
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    return tasks.value;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  
  return tasks.value.filter((task) => {
    // Поиск по названию задачи
    if (task.name.toLowerCase().includes(query)) {
      return true;
    }
    
    // Поиск по описанию
    if (task.description && task.description.toLowerCase().includes(query)) {
      return true;
    }
    
    // Поиск по подзадачам
    if (task.subtasks && task.subtasks.some(subtask => 
      subtask.name.toLowerCase().includes(query)
    )) {
      return true;
    }
    
    // Поиск по участникам (создатель, исполнитель, наблюдатели)
    if (task.creator) {
      const creatorName = (
        task.creator.displayName || 
        task.creator.firstName || 
        task.creator.login || 
        ''
      ).toLowerCase();
      if (creatorName.includes(query)) {
        return true;
      }
    }
    
    if (task.assignee) {
      const assigneeName = (
        task.assignee.displayName || 
        task.assignee.firstName || 
        task.assignee.login || 
        ''
      ).toLowerCase();
      if (assigneeName.includes(query)) {
        return true;
      }
    }
    
    if (task.watchers && task.watchers.some(watcher => {
      const watcherName = (
        watcher.displayName || 
        watcher.firstName || 
        watcher.login || 
        ''
      ).toLowerCase();
      return watcherName.includes(query);
    })) {
      return true;
    }
    
    // Поиск по названиям файлов
    if (task.files && task.files.some(file => 
      file.name.toLowerCase().includes(query)
    )) {
      return true;
    }
    
    return false;
  });
});

function getTasksForColumn(columnId: string): Task[] {
  return filteredTasks.value.filter((task) => task.column.id === columnId);
}

function getCompletedSubtasksCount(task: Task): number {
  return task.subtasks.filter((st) => st.isCompleted).length;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}.${month} ${hours}:${minutes}`;
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  }
  return `0:${mins.toString().padStart(2, '0')}`;
}

function isDeadlineOverdue(deadline: string | null | undefined, isCompleted: boolean): boolean {
  if (!deadline || isCompleted) return false;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return deadlineDate < now;
}

function getTaskParticipants(task: Task): CompanyUser[] {
  const participants: CompanyUser[] = [];
  if (task.assignee) {
    participants.push(task.assignee);
  }
  if (task.watchers) {
    participants.push(...task.watchers);
  }
  return participants;
}

function getTaskActiveParticipants(task: Task): CompanyUser[] {
  const participants: CompanyUser[] = [];
  if (task.creator) {
    participants.push(task.creator);
  }
  if (task.assignee) {
    participants.push(task.assignee);
  }
  // Наблюдатели не включаются
  return participants;
}

function getDisplayTime(task: Task): string {
  if (activeTimerTaskId.value === task.id) {
    // Показываем время с таймера
    const totalMinutes = (task.timeSpent || 0) + timerElapsedMinutes.value;
    return formatTime(totalMinutes);
  }
  return task.timeSpent ? formatTime(task.timeSpent) : '0:00';
}

function toggleTimer(task: Task) {
  if (task.isCompleted) return;
  
  if (activeTimerTaskId.value === task.id) {
    // Останавливаем таймер
    stopTimer(task);
  } else {
    // Останавливаем предыдущий таймер, если есть
    if (activeTimerTaskId.value) {
      const previousTask = tasks.value.find(t => t.id === activeTimerTaskId.value);
      if (previousTask) {
        stopTimer(previousTask);
      }
    }
    // Запускаем новый таймер
    startTimer(task);
  }
}

function startTimer(task: Task) {
  activeTimerTaskId.value = task.id;
  timerStartTime.value = Date.now();
  timerElapsedMinutes.value = 0;
  
  timerInterval.value = window.setInterval(() => {
    if (timerStartTime.value) {
      const elapsed = Math.floor((Date.now() - timerStartTime.value) / 1000 / 60);
      timerElapsedMinutes.value = elapsed;
    }
  }, 1000);
}

async function stopTimer(task: Task) {
  if (!activeTimerTaskId.value || activeTimerTaskId.value !== task.id) return;
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  
  // Сохраняем время
  const totalMinutes = (task.timeSpent || 0) + timerElapsedMinutes.value;
  try {
    const updatedTask = await updateTaskApi(projectId.value, task.id, {
      timeSpent: totalMinutes,
    });
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  } catch (error: any) {
    console.error('Ошибка сохранения времени:', error);
  }
  
  activeTimerTaskId.value = null;
  timerStartTime.value = null;
  timerElapsedMinutes.value = 0;
}

function downloadFile(url: string, name: string) {
  const link = document.createElement('a');
  link.href = url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${url}`;
  link.download = name;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function canEditTask(task: Task): boolean {
  if (!currentUser.value || !project.value) return false;
  // Руководитель проекта имеет доступ ко всем задачам
  if (project.value.creator.id === currentUser.value.id) return true;
  // Владелец и менеджер компании имеют доступ ко всем задачам
  if (currentUser.value.companyRole === 'owner' || currentUser.value.companyRole === 'manager') return true;
  // Постановщик может редактировать свою задачу
  return task.creator.id === currentUser.value.id;
}

function canCompleteTask(task: Task): boolean {
  if (!currentUser.value) return false;
  // Исполнитель может только нажать "готово"
  return task.assignee?.id === currentUser.value.id;
}

function canViewTask(task: Task): boolean {
  if (!currentUser.value || !project.value) return false;
  // Руководитель проекта имеет доступ ко всем задачам
  if (project.value.creator.id === currentUser.value.id) return true;
  // Владелец и менеджер компании имеют доступ ко всем задачам
  if (currentUser.value.companyRole === 'owner' || currentUser.value.companyRole === 'manager') return true;
  // Постановщик, исполнитель и наблюдатели имеют доступ
  if (task.creator.id === currentUser.value.id) return true;
  if (task.assignee?.id === currentUser.value.id) return true;
  if (task.watchers?.some(w => w.id === currentUser.value?.id)) return true;
  return false;
}

const canCreateColumn = computed(() => {
  if (!project.value || !currentUser.value) return false;
  return (
    project.value.creator.id === currentUser.value.id ||
    currentUser.value.companyRole === 'owner' ||
    currentUser.value.companyRole === 'manager'
  );
});

function navigateToProject(id: string) {
  router.push(`/projects/${id}/tasks`);
}

function toggleColumnMenu(columnId: string) {
  // TODO: Реализовать меню колонки
  console.log('Toggle menu for column:', columnId);
}

function openCreateTaskModal(columnId: string) {
  selectedColumnId.value = columnId;
  newTask.value = {
    name: '',
    description: '',
    columnId,
    creatorId: currentUser.value?.id || '',
    assigneeId: '',
    watcherIds: [],
    deadline: '',
    subtasks: [],
  };
  generatedDescription.value = '';
  isImportantTask.value = false;
  showCreateTaskModal.value = true;
  showCreatorSelect.value = false;
  showAssigneeSelect.value = false;
  showWatchersSelect.value = false;
  showDeadlinePicker.value = false;
  creatorSearchQuery.value = '';
  assigneeSearchQuery.value = '';
  watchersSearchQuery.value = '';
}

function getAvatarUrl(avatar: string | null | undefined): string {
  if (!avatar) return '';
  
  // Если уже полный URL, возвращаем как есть
  if (avatar.startsWith('http')) {
    return avatar;
  }
  
  // Если относительный путь, формируем полный URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
  if (avatar.startsWith('/')) {
    return `${baseUrl}${avatar}`;
  }
  
  // Если просто имя файла, формируем полный путь
  return `${baseUrl}/api/v1/avatars/${avatar}`;
}

function getCreatorName(): string {
  if (!newTask.value.creatorId) return '';
  const user = companyUsers.value.find(u => u.id === newTask.value.creatorId);
  return user ? getUserDisplayNameWithRole(user) : '';
}

function getCreatorAvatar(): string | null {
  if (!newTask.value.creatorId) return null;
  const user = companyUsers.value.find(u => u.id === newTask.value.creatorId);
  return user?.avatar || null;
}

function getAssigneeName(): string {
  if (!newTask.value.assigneeId) return '';
  const user = companyUsers.value.find(u => u.id === newTask.value.assigneeId);
  return user ? getUserDisplayNameWithRole(user) : '';
}

function getAssigneeAvatar(): string | null {
  if (!newTask.value.assigneeId) return null;
  const user = companyUsers.value.find(u => u.id === newTask.value.assigneeId);
  return user?.avatar || null;
}

function getWatchersDisplayText(): string {
  if (newTask.value.watcherIds.length === 0) {
    return 'наблюдатели';
  }
  if (newTask.value.watcherIds.length === 1) {
    const user = companyUsers.value.find(u => u.id === newTask.value.watcherIds[0]);
    return user ? getUserDisplayNameWithRole(user) : 'наблюдатель';
  }
  return `${newTask.value.watcherIds.length} наблюдателей`;
}

function getWatchersAvatar(): string | null {
  if (newTask.value.watcherIds.length === 0) return null;
  if (newTask.value.watcherIds.length === 1) {
    const user = companyUsers.value.find(u => u.id === newTask.value.watcherIds[0]);
    return user?.avatar || null;
  }
  return null;
}

function clearAssignee() {
  newTask.value.assigneeId = '';
  assigneeSearchQuery.value = '';
}

function clearWatchers() {
  newTask.value.watcherIds = [];
  watchersSearchQuery.value = '';
}

async function addTaskParticipantsToProject() {
  if (!project.value) return;
  
  // Собираем всех участников задачи
  const taskParticipantIds: string[] = [];
  if (newTask.value.creatorId) {
    taskParticipantIds.push(newTask.value.creatorId);
  }
  if (newTask.value.assigneeId) {
    taskParticipantIds.push(newTask.value.assigneeId);
  }
  taskParticipantIds.push(...newTask.value.watcherIds);
  
  // Убираем дубликаты
  const uniqueParticipantIds = [...new Set(taskParticipantIds)];
  
  // Проверяем, какие пользователи еще не являются участниками проекта
  const currentParticipantIds = project.value.participants.map(p => p.id);
  const newParticipantIds = uniqueParticipantIds.filter(id => !currentParticipantIds.includes(id));
  
  if (newParticipantIds.length > 0) {
    try {
      // Добавляем новых участников в проект
      const updatedProject = await updateProject(project.value.id, {
        participants: [...currentParticipantIds, ...newParticipantIds],
      });
      
      // Обновляем список участников проекта
      project.value = updatedProject;
      projectParticipants.value = [
        updatedProject.creator,
        ...updatedProject.participants,
      ];
    } catch (error: any) {
      console.error('Ошибка добавления участников в проект:', error);
    }
  }
}

function selectCreator(userId: string) {
  newTask.value.creatorId = userId;
  showCreatorSelect.value = false;
  creatorSearchQuery.value = '';
}

function selectAssignee(userId: string) {
  newTask.value.assigneeId = userId;
  showAssigneeSelect.value = false;
  assigneeSearchQuery.value = '';
}

function toggleWatcher(userId: string) {
  const index = newTask.value.watcherIds.indexOf(userId);
  if (index > -1) {
    newTask.value.watcherIds.splice(index, 1);
  } else {
    newTask.value.watcherIds.push(userId);
  }
}

async function generateDescription() {
  try {
    // TODO: Реализовать генерацию описания через AI
    generatedDescription.value = 'Сгенерированное описание задачи будет здесь...';
  } catch (error: any) {
    console.error('Ошибка генерации описания:', error);
  }
}

function acceptGeneratedDescription() {
  if (generatedDescription.value) {
    newTask.value.description = generatedDescription.value;
    generatedDescription.value = '';
  }
}

function refineGeneratedDescription() {
  // TODO: Реализовать доработку описания
  console.log('Refine description');
}

function deleteGeneratedDescription() {
  generatedDescription.value = '';
}

function closeCreateTaskModal() {
  showCreateTaskModal.value = false;
  selectedColumnId.value = '';
  showCreatorSelect.value = false;
  showAssigneeSelect.value = false;
  showWatchersSelect.value = false;
  showDeadlinePicker.value = false;
  creatorSearchQuery.value = '';
  assigneeSearchQuery.value = '';
  watchersSearchQuery.value = '';
  selectedFiles.value = [];
  if (taskFilesInput.value) {
    taskFilesInput.value.value = '';
  }
  generatedDescription.value = '';
  isImportantTask.value = false;
}

function openCreateSubtaskModal(task: Task) {
  // TODO: Реализовать модальное окно создания подзадачи
  console.log('Create subtask for task:', task.id);
}

function openEditTaskModal(task: Task) {
  selectedTask.value = task;
  editTask.value = {
    name: task.name,
    description: task.description || '',
    assigneeId: task.assignee?.id || '',
    watcherIds: task.watchers.map((w) => w.id),
    subtasks: task.subtasks.map((st) => ({ ...st })),
    deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
    timeSpent: task.timeSpent || 0,
  };
  showEditTaskModal.value = true;
}

function getCreatorDisplayName(user: UserInfo): string {
  if (user.displayName) return user.displayName;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName[0]}.`;
  if (user.firstName) return user.firstName;
  return user.login || '';
}

function sendToRework() {
  // TODO: Реализовать отправку на доработку
  console.log('Send to rework');
}

function closeEditTaskModal() {
  showEditTaskModal.value = false;
  selectedTask.value = null;
  showEditSubtasksModal.value = false;
  showEditChecklistModal.value = false;
}

function openTaskModal(task: Task) {
  openEditTaskModal(task);
}

function openCreateColumnModal() {
  newColumn.value = { name: '' };
  showCreateColumnModal.value = true;
}

function closeCreateColumnModal() {
  showCreateColumnModal.value = false;
}

function addSubtask() {
  editTask.value.subtasks.push({ name: '', isCompleted: false });
}

function removeSubtask(index: number) {
  editTask.value.subtasks.splice(index, 1);
}

async function loadData() {
  try {
    const [projectData, columnsData, tasksData, projectsData, userInfo, companyUsersData] = await Promise.all([
      getProject(projectId.value),
      getColumns(projectId.value),
      getTasks(projectId.value),
      getProjects(),
      getUserInfo(),
      getCompanyUsers(),
    ]);

    project.value = projectData;
    columns.value = columnsData;
    tasks.value = tasksData;
    projects.value = projectsData;
    projectParticipants.value = [
      projectData.creator,
      ...projectData.participants,
    ];
    companyUsers.value = companyUsersData;
    currentUser.value = userInfo;
  } catch (error: any) {
    console.error('Ошибка загрузки данных:', error);
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;
  
  const files = Array.from(input.files);
  const maxSize = 10 * 1024 * 1024; // 10 МБ
  
  for (const file of files) {
    if (file.size > maxSize) {
      alert(`Файл "${file.name}" превышает максимальный размер 10 МБ`);
      continue;
    }
    selectedFiles.value.push(file);
  }
  
  // Очищаем input для возможности повторного выбора того же файла
  if (taskFilesInput.value) {
    taskFilesInput.value.value = '';
  }
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1);
}

async function createTask() {
  try {
    if (!newTask.value.name.trim()) {
      alert('Введите название задачи');
      return;
    }

    const taskData = {
      name: newTask.value.name,
      description: newTask.value.description || undefined,
      columnId: newTask.value.columnId,
      creatorId: newTask.value.creatorId || currentUser.value?.id || '',
      assigneeId: newTask.value.assigneeId || undefined,
      watcherIds: newTask.value.watcherIds,
      subtasks: newTask.value.subtasks,
      deadline: newTask.value.deadline ? new Date(newTask.value.deadline).toISOString() : undefined,
      isImportant: isImportantTask.value,
    };

    const createdTask = await createTaskApi(projectId.value, taskData);
    
    // Загружаем файлы, если они есть
    if (selectedFiles.value.length > 0) {
      for (const file of selectedFiles.value) {
        try {
          await uploadTaskFile(projectId.value, createdTask.id, file);
        } catch (error: any) {
          console.error(`Ошибка загрузки файла ${file.name}:`, error);
        }
      }
      // Перезагружаем задачу, чтобы получить обновленный список файлов
      const updatedTask = await getTaskApi(projectId.value, createdTask.id);
      const index = tasks.value.findIndex(t => t.id === createdTask.id);
      if (index !== -1) {
        tasks.value[index] = updatedTask;
      } else {
        tasks.value.push(updatedTask);
      }
    } else {
      tasks.value.push(createdTask);
    }
    
    // Добавляем участников задачи в участники проекта
    await addTaskParticipantsToProject();
    
    // Очищаем выбранные файлы
    selectedFiles.value = [];
    
    closeCreateTaskModal();
  } catch (error: any) {
    console.error('Ошибка создания задачи:', error);
    alert(error.message || 'Ошибка создания задачи');
  }
}

async function addEditTaskParticipantsToProject() {
  if (!project.value || !selectedTask.value) return;
  
  // Собираем всех участников задачи из editTask
  const taskParticipantIds: string[] = [];
  if (selectedTask.value.creator.id) {
    taskParticipantIds.push(selectedTask.value.creator.id);
  }
  if (editTask.value.assigneeId) {
    taskParticipantIds.push(editTask.value.assigneeId);
  }
  taskParticipantIds.push(...editTask.value.watcherIds);
  
  // Убираем дубликаты
  const uniqueParticipantIds = [...new Set(taskParticipantIds)];
  
  // Проверяем, какие пользователи еще не являются участниками проекта
  const currentParticipantIds = project.value.participants.map(p => p.id);
  const newParticipantIds = uniqueParticipantIds.filter(id => !currentParticipantIds.includes(id));
  
  if (newParticipantIds.length > 0) {
    try {
      // Добавляем новых участников в проект
      const updatedProject = await updateProject(project.value.id, {
        participants: [...currentParticipantIds, ...newParticipantIds],
      });
      
      // Обновляем список участников проекта
      project.value = updatedProject;
      projectParticipants.value = [
        updatedProject.creator,
        ...updatedProject.participants,
      ];
    } catch (error: any) {
      console.error('Ошибка добавления участников в проект:', error);
    }
  }
}

async function updateTask() {
  if (!selectedTask.value) return;

  try {
    const taskData = {
      ...editTask.value,
      deadline: editTask.value.deadline ? new Date(editTask.value.deadline).toISOString() : undefined,
    };

    const updatedTask = await updateTaskApi(projectId.value, selectedTask.value.id, taskData);
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
    
    // Добавляем участников задачи в участники проекта
    await addEditTaskParticipantsToProject();
    
    closeEditTaskModal();
  } catch (error: any) {
    console.error('Ошибка обновления задачи:', error);
    alert(error.message || 'Ошибка обновления задачи');
  }
}

async function completeTask() {
  if (!selectedTask.value) return;

  try {
    const updatedTask = await completeTaskApi(projectId.value, selectedTask.value.id, true);
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
    closeEditTaskModal();
  } catch (error: any) {
    console.error('Ошибка завершения задачи:', error);
    alert(error.message || 'Ошибка завершения задачи');
  }
}

async function toggleTaskComplete(task: Task) {
  if (!canCompleteTask(task)) return;

  try {
    const updatedTask = await completeTaskApi(projectId.value, task.id, !task.isCompleted);
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  } catch (error: any) {
    console.error('Ошибка изменения статуса задачи:', error);
  }
}

async function toggleTaskImportant(task: Task) {
  if (!canEditTask(task)) return;

  try {
    const updatedTask = await updateTaskApi(projectId.value, task.id, {
      isImportant: !task.isImportant,
    });
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  } catch (error: any) {
    console.error('Ошибка изменения важности задачи:', error);
  }
}

function openTimePicker(task: Task) {
  if (!canEditTask(task)) return;
  
  const timeInput = prompt('Введите время в формате ЧЧ:ММ (например, 3:24):');
  if (timeInput === null) return;
  
  const timeMatch = timeInput.match(/^(\d+):(\d+)$/);
  if (!timeMatch) {
    alert('Неверный формат времени. Используйте формат ЧЧ:ММ');
    return;
  }
  
  const hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    alert('Неверное время. Часы: 0-23, минуты: 0-59');
    return;
  }
  
  const totalMinutes = hours * 60 + minutes;
  updateTaskTime(task, totalMinutes);
}

async function updateTaskTime(task: Task, minutes: number) {
  try {
    const updatedTask = await updateTaskApi(projectId.value, task.id, {
      timeSpent: minutes,
    });
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  } catch (error: any) {
    console.error('Ошибка обновления времени задачи:', error);
    alert(error.message || 'Ошибка обновления времени задачи');
  }
}

function openDeadlinePicker(task: Task, event?: MouseEvent) {
  if (!canEditTask(task)) return;
  
  // Находим кнопку дедлайна в DOM
  const button = event?.target as HTMLElement;
  const buttonElement = button?.closest('.task-deadline-btn') as HTMLElement;
  
  if (!buttonElement) return;
  
  // Получаем позицию кнопки
  const rect = buttonElement.getBoundingClientRect();
  
  // Создаем временный input для выбора даты и времени
  const input = document.createElement('input');
  input.type = 'datetime-local';
  input.value = task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '';
  
  // Позиционируем input на месте кнопки
  input.style.position = 'fixed';
  input.style.left = `${rect.left}px`;
  input.style.top = `${rect.top}px`;
  input.style.width = `${rect.width}px`;
  input.style.height = `${rect.height}px`;
  input.style.opacity = '0';
  input.style.pointerEvents = 'auto';
  input.style.zIndex = '10000';
  input.style.cursor = 'pointer';
  
  document.body.appendChild(input);
  
  // Фокусируем и открываем picker
  input.focus();
  if (typeof input.showPicker === 'function') {
    input.showPicker();
  }
  
  input.addEventListener('change', () => {
    if (input.value) {
      const deadline = new Date(input.value);
      updateTaskDeadline(task, deadline.toISOString());
    } else {
      updateTaskDeadline(task, null);
    }
    if (document.body.contains(input)) {
      document.body.removeChild(input);
    }
  });
  
  input.addEventListener('blur', () => {
    setTimeout(() => {
      if (document.body.contains(input)) {
        document.body.removeChild(input);
      }
    }, 200);
  });
  
  // Если showPicker не поддерживается, используем prompt
  if (typeof input.showPicker !== 'function') {
    if (document.body.contains(input)) {
      document.body.removeChild(input);
    }
    const currentDate = task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '';
    const dateTimeInput = prompt('Введите дату и время в формате ГГГГ-ММ-ДДТЧЧ:ММ (например, 2024-11-03T19:00):', currentDate);
    if (dateTimeInput === null) return;
    
    if (dateTimeInput.trim() === '') {
      updateTaskDeadline(task, null);
      return;
    }
    
    const deadline = new Date(dateTimeInput);
    if (isNaN(deadline.getTime())) {
      alert('Неверная дата');
      return;
    }
    
    updateTaskDeadline(task, deadline.toISOString());
  }
}

async function updateTaskDeadline(task: Task, deadline: string | null) {
  try {
    const updatedTask = await updateTaskApi(projectId.value, task.id, {
      deadline: deadline || undefined,
    });
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  } catch (error: any) {
    console.error('Ошибка обновления дедлайна задачи:', error);
    alert(error.message || 'Ошибка обновления дедлайна задачи');
  }
}

async function deleteTask() {
  if (!selectedTask.value) return;

  if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
    return;
  }

  try {
    await deleteTaskApi(projectId.value, selectedTask.value.id);
    tasks.value = tasks.value.filter((t) => t.id !== selectedTask.value!.id);
    closeEditTaskModal();
  } catch (error: any) {
    console.error('Ошибка удаления задачи:', error);
    alert(error.message || 'Ошибка удаления задачи');
  }
}

async function createColumn() {
  try {
    if (!newColumn.value.name.trim()) {
      alert('Введите название колонки');
      return;
    }

    const createdColumn = await createColumnApi(projectId.value, newColumn.value);
    columns.value.push(createdColumn);
    closeCreateColumnModal();
  } catch (error: any) {
    console.error('Ошибка создания колонки:', error);
    alert(error.message || 'Ошибка создания колонки');
  }
}

// Drag and Drop handlers
function handleDragStart(task: Task, event: DragEvent) {
  draggedTask.value = task;
  isDragging.value = true;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', event.currentTarget as any);
  }
}

function handleDragEnd() {
  draggedTask.value = null;
  draggedOverColumn.value = null;
  isDragging.value = false;
}

function handleDragOver(columnId: string, event: DragEvent) {
  if (!draggedTask.value) return;
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  draggedOverColumn.value = columnId;
}

function handleDragLeave(columnId: string) {
  if (draggedOverColumn.value === columnId) {
    draggedOverColumn.value = null;
  }
}

async function handleDrop(columnId: string, event: DragEvent) {
  event.preventDefault();
  draggedOverColumn.value = null;
  
  if (!draggedTask.value || draggedTask.value.column.id === columnId) {
    draggedTask.value = null;
    isDragging.value = false;
    return;
  }
  
  const taskToMove = draggedTask.value;
  draggedTask.value = null;
  isDragging.value = false;
  
  try {
    // Обновляем колонку задачи
    const updatedTask = await updateTaskApi(projectId.value, taskToMove.id, {
      columnId: columnId,
    });
    
    // Обновляем задачу в локальном массиве
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  } catch (error: any) {
    console.error('Ошибка перемещения задачи:', error);
    alert(error.message || 'Ошибка перемещения задачи');
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  
  // Проверяем, был ли клик вне выпадающих меню
  if (!target.closest('.task-modal-participants-dropdown') && 
      !target.closest('.task-modal-participant-btn')) {
    showCreatorSelect.value = false;
    showAssigneeSelect.value = false;
    showWatchersSelect.value = false;
  }
}

onMounted(() => {
  loadData();
  // Добавляем обработчик клика вне меню только когда модальное окно открыто
  nextTick(() => {
    if (showCreateTaskModal.value) {
      document.addEventListener('click', handleClickOutside);
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  // Останавливаем таймер при размонтировании
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  activeTimerTaskId.value = null;
  timerStartTime.value = null;
  timerElapsedMinutes.value = 0;
});

watch(
  () => route.params.id,
  () => {
    loadData();
  }
);

watch(showCreateTaskModal, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      document.addEventListener('click', handleClickOutside);
    });
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});
</script>

<style scoped>
.tasks-view {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e12 0%, #1a1e24 50%, #0f1318 100%);
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  overflow: hidden;
}

.tasks-mobile-header {
  display: none;
}

.tasks-sidebar {
  width: 186px;
  min-width: 186px;
  padding: 24px 12px;
  padding-bottom: 24px;
  background: linear-gradient(180deg, rgba(145, 33, 56, 0.6) 0%, rgba(145, 33, 56, 0.3) 100%);
  border-top-right-radius: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(145, 33, 56, 0.15);
  border: 1px solid rgba(145, 33, 56, 0.3);
  color: #e1eaf8;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  padding: 8px 12px;
  height: auto;
  line-height: normal;
  white-space: nowrap;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-btn:hover {
  background: rgba(145, 33, 56, 0.25);
  border-color: rgba(145, 33, 56, 0.5);
  transform: translateX(-2px);
}

.back-btn svg {
  width: 18px;
  height: 18px;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-name {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: normal;
  letter-spacing: 0.32px;
  font-family: 'Involve', Arial, sans-serif;
  word-wrap: break-word;
  overflow-wrap: break-word;
  background: linear-gradient(135deg, #ffffff 0%, #e1eaf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-btn {
  background: linear-gradient(135deg, #912138 0%, #7a1a2d 100%);
  border: 1px solid rgba(145, 33, 56, 0.5);
  color: #e1eaf8;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  text-align: center;
  line-height: normal;
  width: 100%;
  min-height: 32px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.2);
}

.info-btn:hover {
  background: linear-gradient(135deg, #a02a43 0%, #8a1f34 100%);
  border-color: rgba(145, 33, 56, 0.7);
  box-shadow: 0 6px 16px rgba(145, 33, 56, 0.3);
  transform: translateY(-1px);
}

.info-btn:active {
  transform: translateY(0);
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.projects-list-title {
  font-size: 20px;
  font-weight: 400;
  color: #e1eaf8;
  margin: 0;
  letter-spacing: 0.2px;
  line-height: normal;
  font-family: 'Involve', Arial, sans-serif;
}

.projects-list-items {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.project-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  min-height: 40px;
  height: 40px;
  cursor: pointer;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  position: relative;
  line-height: normal;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  border: 1px solid transparent;
}

.project-item:hover {
  background: rgba(145, 33, 56, 0.2);
  border-color: rgba(145, 33, 56, 0.3);
  transform: translateX(4px);
}

.project-item:not(:last-child)::after {
  display: none;
}

.project-item-name {
  flex: 1;
}

.search-box {
  position: relative;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(145, 33, 56, 0.3) 0%, rgba(145, 33, 56, 0.15) 100%);
  border: 1px solid rgba(145, 33, 56, 0.4);
  border-radius: 8px;
  padding: 8px 12px;
  height: 36px;
  box-sizing: border-box;
  gap: 8px;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-box:focus-within {
  background: linear-gradient(135deg, rgba(145, 33, 56, 0.4) 0%, rgba(145, 33, 56, 0.25) 100%);
  border-color: rgba(145, 33, 56, 0.6);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.15);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e1eaf8;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  padding: 0;
  outline: none;
  line-height: normal;
  min-width: 0;
}

.search-input::placeholder {
  color: rgba(225, 234, 248, 0.6);
}

.search-icon {
  width: 18px;
  height: 18px;
  color: rgba(225, 234, 248, 0.6);
  flex-shrink: 0;
  pointer-events: none;
  transition: color 0.2s ease;
}

.search-box:focus-within .search-icon {
  color: #e1eaf8;
}

.tasks-main {
  flex: 1;
  padding: 30px 36px 0;
  overflow-x: auto;
  overflow-y: hidden;
  background: linear-gradient(180deg, rgba(10, 14, 18, 0.4) 0%, transparent 100%);
}

.kanban-board {
  display: flex;
  gap: 20px;
  min-width: fit-content;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 20px;
  padding-right: 36px;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: rgba(145, 33, 56, 0.5) transparent;
}

.kanban-board::-webkit-scrollbar {
  height: 6px;
}

.kanban-board::-webkit-scrollbar-track {
  background: transparent;
}

.kanban-board::-webkit-scrollbar-thumb {
  background: rgba(145, 33, 56, 0.5);
  border-radius: 3px;
}

.kanban-board::-webkit-scrollbar-thumb:hover {
  background: rgba(145, 33, 56, 0.7);
}

.kanban-column {
  min-width: 280px;
  width: 280px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(145, 33, 56, 0.3);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  transition: border-color 0.3s ease;
  max-height: calc(100vh - 120px);
}

.kanban-column:hover {
  border-color: rgba(145, 33, 56, 0.4);
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0 16px;
  gap: 8px;
  margin-bottom: 12px;
}

.column-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  text-transform: capitalize;
  margin: 0;
  flex: 1;
  letter-spacing: 0.3px;
}

.column-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.column-action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(145, 33, 56, 0.2);
  border: 1px solid rgba(145, 33, 56, 0.3);
  color: #e1eaf8;
  cursor: pointer;
  padding: 0;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.column-action-btn:hover {
  background: rgba(145, 33, 56, 0.4);
  border-color: rgba(145, 33, 56, 0.6);
  transform: scale(1.05);
}

.column-action-btn:active {
  transform: scale(0.95);
}

.column-tasks {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(145, 33, 56, 0.4) transparent;
}

.column-tasks::-webkit-scrollbar {
  width: 6px;
}

.column-tasks::-webkit-scrollbar-track {
  background: transparent;
}

.column-tasks::-webkit-scrollbar-thumb {
  background: rgba(145, 33, 56, 0.4);
  border-radius: 3px;
}

.column-tasks::-webkit-scrollbar-thumb:hover {
  background: rgba(145, 33, 56, 0.6);
}

.task-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%);
  border-radius: 16px;
  padding: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  user-select: none;
  position: relative;
  overflow: hidden;
}

.task-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(145, 33, 56, 0) 0%, rgba(145, 33, 56, 0.1) 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.task-card:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(145, 33, 56, 0.2);
  border-color: rgba(145, 33, 56, 0.4);
}

.task-card:hover::before {
  opacity: 1;
}

.task-card:active {
  transform: translateY(-2px);
}

.task-card[draggable="true"] {
  cursor: move;
  cursor: grab;
}

.task-card[draggable="true"]:active {
  cursor: grabbing;
}

.task-card.dragging {
  opacity: 0.4;
  transform: scale(0.95);
  cursor: grabbing;
}

.kanban-column.drag-over {
  background: linear-gradient(135deg, rgba(145, 33, 56, 0.15) 0%, rgba(145, 33, 56, 0.05) 100%);
  border-color: rgba(145, 33, 56, 0.6);
  box-shadow: 0 0 0 2px rgba(145, 33, 56, 0.3), 0 12px 40px rgba(145, 33, 56, 0.2);
}

.kanban-column.drag-over .column-title {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(145, 33, 56, 0.5);
}

.task-card-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
}

.task-checkbox-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  margin-top: 2px;
}

.task-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.task-checkbox-custom {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #912138;
  border-radius: 6px;
  background: rgba(145, 33, 56, 0.1);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.task-checkbox:checked + .task-checkbox-custom {
  background: linear-gradient(135deg, #912138 0%, #7a1a2d 100%);
  border-color: #912138;
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

.task-checkbox:checked + .task-checkbox-custom::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  animation: checkmark 0.3s ease;
}

@keyframes checkmark {
  from {
    opacity: 0;
    transform: rotate(0deg) scale(0.8);
  }
  to {
    opacity: 1;
    transform: rotate(45deg) scale(1);
  }
}

.task-checkbox:disabled + .task-checkbox-custom {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-name {
  font-size: 15px;
  font-weight: 600;
  color: #292d32;
  margin: 0;
  flex: 1;
  line-height: 1.3;
  cursor: pointer;
  word-wrap: break-word;
  overflow-wrap: break-word;
  transition: color 0.2s ease;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #912138;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #ffbe62;
  border-radius: 8px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #292d32;
  min-width: 24px;
  text-align: center;
  letter-spacing: -1.4px;
}

.task-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 4px 0;
}

.task-meta-row {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.task-files {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.task-file {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  height: 24px;
  background: rgba(41, 45, 50, 0.3);
  border-radius: 50px;
  font-size: 12px;
  color: #e1eaf8;
  white-space: nowrap;
  
  svg {
    width: 10.667px;
    height: 10.667px;
    flex-shrink: 0;
  }
  
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
}

.task-important-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(145, 33, 56, 0.1);
  border: 1px solid rgba(145, 33, 56, 0.2);
  border-radius: 6px;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  
  img {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: rgba(145, 33, 56, 0.2);
    border-color: rgba(145, 33, 56, 0.4);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &.active {
    background: linear-gradient(135deg, #912138 0%, #7a1a2d 100%);
    border-color: #912138;
    box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
    
    img {
      width: 16px;
      height: 16px;
      filter: brightness(1.2);
    }
  }
}

.task-time,
.task-deadline {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  height: 24px;
  background: rgba(41, 45, 50, 0.3);
  border: none;
  border-radius: 50px;
  font-size: 12px;
  color: #e1eaf8;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Involve', Arial, sans-serif;
  
  svg {
    width: 10.667px;
    height: 10.667px;
    flex-shrink: 0;
  }
  
  &:hover {
    background: rgba(41, 45, 50, 0.5);
  }
  
  &.empty {
    opacity: 0.6;
    font-style: italic;
  }
}

.task-time {
  &.filled {
    background: #85afe4;
    color: #213491;
    
    svg {
      color: #213491;
    }
    
    &:hover {
      background: #6b9dd4;
    }
  }
}

.task-deadline {
  color: #ce9eff;
  
  &.empty {
    color: #ce9eff;
  }
  
  &.filled {
    background: rgba(41, 45, 50, 0.3);
    color: #ce9eff;
    
    svg {
      color: #ce9eff;
    }
    
    &:hover {
      background: rgba(41, 45, 50, 0.5);
    }
  }
  
  &.overdue {
    background: #912138;
    color: #ffffff;
    
    svg {
      color: #ffffff;
    }
    
    &:hover {
      background: #7a1a2d;
    }
  }
}

.task-timer-section,
.task-deadline-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.task-timer-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  height: 28px;
  background: rgba(133, 175, 228, 0.15);
  border: 1px solid rgba(133, 175, 228, 0.3);
  border-radius: 8px;
  font-size: 12px;
  color: #5b8bc1;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Involve', Arial, sans-serif;
  width: 100%;
  font-weight: 500;
  
  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: #5b8bc1;
  }
  
  &:hover:not(:disabled) {
    background: rgba(133, 175, 228, 0.25);
    border-color: rgba(133, 175, 228, 0.5);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.running {
    background: linear-gradient(135deg, #85afe4 0%, #6b9dd4 100%);
    color: #ffffff;
    animation: pulse 1.5s ease-in-out infinite;
    border-color: #6b9dd4;
    box-shadow: 0 4px 12px rgba(133, 175, 228, 0.3);
    
    svg {
      color: #ffffff;
    }
  }
  
  &.has-time:not(.running) {
    background: linear-gradient(135deg, rgba(133, 175, 228, 0.3) 0%, rgba(133, 175, 228, 0.15) 100%);
    color: #5b8bc1;
    border-color: rgba(133, 175, 228, 0.4);
    
    svg {
      color: #5b8bc1;
    }
    
    &:hover {
      background: linear-gradient(135deg, rgba(133, 175, 228, 0.4) 0%, rgba(133, 175, 228, 0.2) 100%);
    }
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(133, 175, 228, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(133, 175, 228, 0.5);
  }
}

.task-deadline-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  height: 28px;
  background: rgba(206, 158, 255, 0.15);
  border: 1px solid rgba(206, 158, 255, 0.3);
  border-radius: 8px;
  font-size: 12px;
  color: #9e6fbf;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'Involve', Arial, sans-serif;
  width: 100%;
  font-weight: 500;
  
  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    color: #9e6fbf;
  }
  
  &:hover {
    background: rgba(206, 158, 255, 0.25);
    border-color: rgba(206, 158, 255, 0.5);
  }
  
  &.empty {
    opacity: 0.6;
    font-style: italic;
    color: #9e6fbf;
    
    svg {
      color: #9e6fbf;
    }
  }
  
  &.filled {
    background: linear-gradient(135deg, rgba(206, 158, 255, 0.2) 0%, rgba(206, 158, 255, 0.1) 100%);
    color: #9e6fbf;
    font-weight: 600;
    border-color: rgba(206, 158, 255, 0.4);
    
    svg {
      color: #9e6fbf;
    }
  }
  
  &.overdue {
    background: linear-gradient(135deg, #912138 0%, #7a1a2d 100%);
    color: #ffffff;
    font-weight: 600;
    border-color: #912138;
    box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
    
    svg {
      color: #ffffff;
    }
    
    &:hover {
      background: linear-gradient(135deg, #7a1a2d 0%, #661728 100%);
      box-shadow: 0 6px 16px rgba(145, 33, 56, 0.4);
    }
  }
}

.task-files-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.task-file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(145, 33, 56, 0.08);
  border: 1px solid rgba(145, 33, 56, 0.15);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(145, 33, 56, 0.15);
    border-color: rgba(145, 33, 56, 0.3);
    transform: translateX(2px);
  }
  
  svg {
    width: 14px;
    height: 14px;
    color: #912138;
    flex-shrink: 0;
  }
}

.task-file-name {
  font-size: 12px;
  color: #292d32;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  font-weight: 500;
}

.task-participants {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 100%;
  position: relative;
  margin-top: auto;
}

.participant-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, rgba(145, 33, 56, 0.1) 0%, rgba(145, 33, 56, 0.05) 100%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover {
    transform: scale(1.1);
    border-color: rgba(145, 33, 56, 0.5);
    box-shadow: 0 4px 12px rgba(145, 33, 56, 0.2);
  }
}

.participant-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(145, 33, 56, 0.2) 0%, rgba(145, 33, 56, 0.1) 100%);
  color: #912138;
  font-size: 13px;
  font-weight: 600;
}

.participant-more {
  background: rgba(42, 39, 22, 0);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e1eaf8;
  font-size: 13px;
  font-weight: 500;
}

.create-first-task {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%);
  border: 2px dashed rgba(145, 33, 56, 0.3);
  border-radius: 16px;
  color: #912138;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.create-first-task:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%);
  border-color: rgba(145, 33, 56, 0.6);
  box-shadow: 0 8px 24px rgba(145, 33, 56, 0.15);
}

.add-column-btn {
  min-width: 280px;
  height: 48px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(145, 33, 56, 0.3);
  border-radius: 20px;
  color: #d0cbca;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.add-column-btn:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%);
  border-color: rgba(145, 33, 56, 0.5);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.add-column-btn:active {
  transform: translateY(0);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.task-modal {
  background: linear-gradient(135deg, rgba(41, 45, 50, 0.98) 0%, rgba(30, 33, 38, 0.98) 100%);
  border-radius: 20px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  padding-bottom: clamp(1rem, 2vw, 1.5rem);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(2rem, 4vw, 2.5rem);
  height: clamp(2rem, 4vw, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.5rem, 1vw, 0.75rem);
  color: #e1eaf8;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.modal-close-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-title {
  color: #ffffff;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  font-family: 'Involve', Arial, sans-serif;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.modal-subtitle {
  color: rgba(225, 234, 248, 0.7);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  line-height: 1.5;
  margin: 0;
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.modal-field-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1rem, 2vw, 1.5rem);
}

.modal-field-label {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  color: #e1eaf8;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  line-height: 1.5;
}

.modal-field-required {
  color: #912138;
  font-weight: 600;
}

.modal-input-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.25rem);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-input-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(145, 33, 56, 0.5);
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.1);
}

.modal-field-input {
  width: 100%;
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  color: #ffffff;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  line-height: 1.5;
}

.modal-field-input::placeholder {
  color: rgba(225, 234, 248, 0.5);
}

.modal-textarea-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.25rem);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: clamp(8rem, 16vw, 10rem);
}

.modal-textarea-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(145, 33, 56, 0.5);
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.1);
}

.modal-description-textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  resize: vertical;
  min-height: clamp(6rem, 12vw, 8rem);
  max-height: clamp(12rem, 24vw, 16rem);
  overflow-y: auto;
  line-height: 1.6;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(225, 234, 248, 0.3) transparent;
}

.modal-description-textarea::-webkit-scrollbar {
  width: 6px;
}

.modal-description-textarea::-webkit-scrollbar-track {
  background: transparent;
}

.modal-description-textarea::-webkit-scrollbar-thumb {
  background: rgba(225, 234, 248, 0.3);
  border-radius: 3px;
}

.modal-file-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-file-input {
  display: none;
}

.modal-file-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #e1eaf8;
  font-size: 14px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(145, 33, 56, 0.5);
  }
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
}

.modal-file-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  
  svg {
    width: 14px;
    height: 14px;
    color: #e1eaf8;
    flex-shrink: 0;
  }
}

.modal-file-name {
  flex: 1;
  font-size: 13px;
  color: #e1eaf8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-file-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #e1eaf8;
  opacity: 0.6;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
    background: rgba(145, 33, 56, 0.3);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}

.modal-description-textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(225, 234, 248, 0.5);
}

.modal-description-textarea::placeholder {
  color: rgba(225, 234, 248, 0.5);
}

.modal-textarea-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: clamp(0.5rem, 1vw, 0.75rem);
  padding-top: clamp(0.5rem, 1vw, 0.75rem);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-char-count {
  font-size: clamp(0.75rem, 1.25vw, 0.875rem);
  color: rgba(225, 234, 248, 0.6);
  font-family: 'Involve', Arial, sans-serif;
}

.modal-generate-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-generate-btn {
  background: rgba(145, 33, 56, 0.8);
  border: 1px solid rgba(145, 33, 56, 0.5);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.625rem, 1.25vw, 0.875rem) clamp(1rem, 2vw, 1.5rem);
  height: auto;
  min-height: clamp(2.5rem, 5vw, 3rem);
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  justify-content: center;
}

.modal-generate-btn:hover {
  background: rgba(145, 33, 56, 1);
  border-color: rgba(145, 33, 56, 0.7);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

.modal-generate-btn-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-generate-btn-icon svg {
  width: 100%;
  height: 100%;
}

.modal-generate-btn-text {
  color: #e1eaf8;
  font-size: 0.9375rem;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  flex: 1;
}

.modal-generated-description {
  background: rgba(145, 33, 56, 0.1);
  border: 2px solid rgba(145, 33, 56, 0.3);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(1rem, 2vw, 1.5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-generated-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-generated-text {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  line-height: 1.5;
  white-space: pre-wrap;
}

.modal-generated-actions {
  display: flex;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  flex-wrap: wrap;
}

.modal-action-btn {
  border-radius: clamp(0.5rem, 1vw, 0.75rem);
  padding: clamp(0.5rem, 1vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem);
  height: auto;
  min-height: clamp(2.25rem, 4.5vw, 2.75rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  flex: 1;
  border: 1px solid transparent;
}

.modal-action-accept {
  background: rgba(145, 33, 56, 0.8);
  color: #ffffff;
  border-color: rgba(145, 33, 56, 0.5);
}

.modal-action-accept:hover {
  background: rgba(145, 33, 56, 1);
  border-color: rgba(145, 33, 56, 0.7);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

.modal-action-refine {
  background: rgba(255, 255, 255, 0.1);
  color: #e1eaf8;
  border-color: rgba(255, 255, 255, 0.2);
}

.modal-action-refine:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.modal-action-delete {
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
  border-color: rgba(255, 107, 107, 0.3);
}

.modal-action-delete:hover {
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.4);
  transform: translateY(-1px);
}

.modal-action-btn-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.modal-action-btn-icon svg {
  width: 100%;
  height: 100%;
}

.modal-actions {
  display: flex;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  padding-top: clamp(1rem, 2vw, 1.5rem);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.modal-btn {
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  height: auto;
  min-height: clamp(2.75rem, 5.5vw, 3.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  border: 1px solid transparent;
  flex: 1;
}

.modal-btn-create {
  background: #912138;
  color: #ffffff;
  border-color: rgba(145, 33, 56, 0.5);
}

.modal-btn-create:hover {
  background: #a02a43;
  border-color: rgba(145, 33, 56, 0.7);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

.modal-btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: #e1eaf8;
  border-color: rgba(255, 255, 255, 0.1);
}

.modal-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.modal-btn-icon {
  width: clamp(1.25rem, 2.5vw, 1.5rem);
  height: clamp(1.25rem, 2.5vw, 1.5rem);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.modal-btn-icon svg {
  width: 100%;
  height: 100%;
}

.task-important-btn {
  background: transparent;
  border: none;
  padding: 0;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.task-important-btn:hover {
  opacity: 0.8;
}

.task-important-btn.active {
  opacity: 1;
}

.task-important-btn img {
  width: 24px;
  height: 24px;
}

.modal-close {
  background: none;
  border: none;
  color: #e1eaf8;
  font-size: 32px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px;
  background: #292d32;
  border: 1px solid rgba(225, 234, 248, 0.1);
  border-radius: 8px;
  color: #e1eaf8;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.watchers-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.watcher-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtask-input {
  flex: 1;
  padding: 8px;
  background: #292d32;
  border: 1px solid rgba(225, 234, 248, 0.1);
  border-radius: 8px;
  color: #e1eaf8;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-create,
.btn-save,
.btn-complete,
.btn-delete,
.btn-cancel {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.btn-create,
.btn-save {
  background: #dbf3c2;
  color: #292d32;
}

.btn-complete {
  background: #dbf3c2;
  color: #292d32;
}

.btn-delete {
  background: #f3c2c3;
  color: #292d32;
}

.btn-cancel {
  background: #f3c2c3;
  color: #292d32;
}

.user-select {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

/* Стили для модальных окон создания и редактирования задач */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  z-index: 10000;
  overflow: hidden;
}

.create-task-modal,
.edit-task-modal {
  background: rgba(4, 9, 16, 0.95);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  width: 100%;
  max-width: 720px;
  max-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2rem);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.modal-back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e1eaf8;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  width: fit-content;
}

.modal-back-btn svg {
  width: 24px;
  height: 24px;
}

.modal-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.task-modal-title-row {
  display: flex;
  align-items: center;
  gap: 24px;
}

.task-modal-label {
  font-size: 20px;
  font-weight: 400;
  color: #e1eaf8;
  min-width: 168px;
}

.task-modal-title-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 500;
  padding: 0;
  outline: none;
}

.task-modal-ai-btn {
  background: #912138;
  border: none;
  border-radius: 16px;
  padding: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.task-modal-ai-btn img {
  width: 24px;
  height: 24px;
}

.task-modal-description-wrapper {
  background: #292d32;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  gap: 6px;
  min-height: 327px;
}

.task-modal-description {
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 20px;
  font-weight: 400;
  resize: none;
  outline: none;
  min-height: 327px;
  font-family: 'Involve', Arial, sans-serif;
}

.task-modal-description:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.task-modal-scrollbar {
  width: 8px;
  background: rgba(225, 234, 248, 0.25);
  border-radius: 100px;
  position: relative;
  flex-shrink: 0;
}

.task-modal-scrollbar-thumb {
  width: 8px;
  height: 48px;
  background: #e1eaf8;
  border-radius: 100px;
}

.task-modal-generate-btn {
  background: #912138;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  transition: background 0.2s ease;
}

.task-modal-generate-btn:hover {
  background: rgba(145, 33, 56, 0.8);
}


.task-modal-generate-btn img {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-participants-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  position: relative;
}

.task-modal-participant-field {
  position: relative;
}

.task-modal-participant-btn {
  background: #292d32;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  min-height: 36px;
  height: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  width: 100%;
}

.task-modal-participant-btn.selected {
  background: rgba(145, 33, 56, 0.3);
}

.task-modal-participant-btn img {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-participant-avatar-btn {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
}

.task-modal-participant-btn span {
  flex: 1;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  line-height: 1.4;
}

.task-modal-participant-clear {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: rgba(225, 234, 248, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-left: auto;
}

.task-modal-participant-clear:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e1eaf8;
}

.task-modal-participant-clear svg {
  width: 16px;
  height: 16px;
}

.task-modal-participants-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #292d32;
  border-radius: 16px;
  padding: 8px;
  margin-top: 4px;
  z-index: 10001;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-height: fit-content;
}

.task-modal-participants-search {
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 4px;
}

.task-modal-participants-search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 6px 12px;
  color: #e1eaf8;
  font-size: 14px;
  font-family: 'Involve', Arial, sans-serif;
  outline: none;
}

.task-modal-participants-search-input::placeholder {
  color: rgba(225, 234, 248, 0.5);
}

.task-modal-participants-search-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(145, 33, 56, 0.5);
}

.task-modal-participants-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 4px 0;
  min-height: fit-content;
}

.task-modal-participant-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  color: #e1eaf8;
  font-size: 15px;
}

.task-modal-participant-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.task-modal-participant-option.selected {
  background: rgba(145, 33, 56, 0.3);
}

.task-modal-participant-option img,
.task-modal-participant-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.task-modal-participant-avatar-placeholder {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(225, 234, 248, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e1eaf8;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.task-modal-participant-display {
  background: #292d32;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 400;
  min-width: 212px;
}

.task-modal-action-btn {
  background: #292d32;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  width: 100%;
}

.task-modal-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-modal-action-btn img {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-deadline-btn {
  background: #292d32;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  width: 212px;
}

.task-modal-deadline-btn img {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-deadline-picker {
  margin-top: -20px;
}

.task-modal-deadline-input {
  background: #292d32;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  color: #e1eaf8;
  font-size: 15px;
  outline: none;
}

.task-modal-actions {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.task-modal-btn-create,
.task-modal-btn-accept,
.task-modal-btn-complete {
  background: #dbf3c2;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #292d32;
  font-size: 15px;
  font-weight: 400;
  min-width: 212px;
}

.task-modal-btn-create svg,
.task-modal-btn-accept svg,
.task-modal-btn-complete svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-btn-rework {
  background: #f3dbc2;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #292d32;
  font-size: 15px;
  font-weight: 400;
  min-width: 212px;
}

.task-modal-btn-rework svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-btn-delete,
.task-modal-btn-cancel {
  background: #f3c2c3;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #292d32;
  font-size: 15px;
  font-weight: 400;
  min-width: 212px;
}

.task-modal-btn-delete svg,
.task-modal-btn-cancel svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-meta-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.task-modal-meta-item {
  background: #292d32;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  min-width: 153px;
}

.task-modal-meta-item img,
.task-modal-meta-item svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-comments {
  min-height: 36px;
  background: #292d32;
  border-radius: 16px;
  flex: 1;
}

@media (max-width: 768px) {
  .modal-overlay {
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .create-task-modal,
  .edit-task-modal {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 100vh;
    max-height: none;
    border-left: none;
    border-radius: 0;
    padding: 12px 16px;
    gap: 20px;
    box-shadow: none;
  }

  .task-modal-participants-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .task-modal-participants-dropdown {
    position: fixed;
    left: 16px;
    right: 16px;
    max-width: calc(100vw - 32px);
  }
}

/* Мобильная версия */
@media (max-width: 768px) {
  .tasks-view {
    flex-direction: column;
  }

  .tasks-mobile-header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: rgba(145, 33, 56, 0.5);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .tasks-mobile-header .back-btn {
    font-size: 16px;
    height: auto;
  }

  .mobile-project-name {
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    margin: 0;
    line-height: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .mobile-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .mobile-actions .info-btn {
    width: auto;
    padding: 6px 16px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .search-box-mobile {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #912138;
    border-radius: 16px;
    padding: 4px 8px;
    height: 32px;
    box-sizing: border-box;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  .search-box-mobile .search-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #e1eaf8;
    font-size: 14px;
    font-weight: 400;
    font-family: 'Involve', Arial, sans-serif;
    padding: 0;
    outline: none;
    line-height: normal;
    min-width: 0;
  }

  .search-box-mobile .search-icon {
    width: 18px;
    height: 18px;
    color: #e1eaf8;
    flex-shrink: 0;
    pointer-events: none;
  }

  .tasks-sidebar {
    display: none;
  }

  .tasks-main {
    padding: 16px 0 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .kanban-board {
    display: flex;
    gap: 12px;
    padding: 0 16px 20px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
  }

  .kanban-column {
    min-width: 95vw;
    width: 95vw;
    scroll-snap-align: start;
    flex-shrink: 0;
  }
}
</style>
