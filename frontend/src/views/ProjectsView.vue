<template>
  <div class="projects-view">
    <!-- Модальное окно фильтров для мобильной версии -->
    <div
      v-if="isFiltersMenuOpen && isMobile"
      class="modal-overlay"
      @click="closeAllMenus"
    >
      <div class="mobile-filter-modal" @click.stop>
        <div class="mobile-menu-header">
          <h3 class="mobile-menu-title">Фильтры</h3>
          <button class="mobile-menu-close" @click.stop="closeAllMenus" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="mobile-filter-content">
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
    </div>

    <!-- Модальное окно сортировки для мобильной версии -->
    <div
      v-if="isSortMenuOpen && isMobile"
      class="modal-overlay"
      @click="closeAllMenus"
    >
      <div class="mobile-filter-modal" @click.stop>
        <div class="mobile-menu-header">
          <h3 class="mobile-menu-title">Сортировка</h3>
          <button class="mobile-menu-close" @click.stop="closeAllMenus" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div class="mobile-filter-content">
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
          <div v-if="isFiltersMenuOpen && !isMobile" class="dropdown-menu active" @click.stop>
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
          <div v-if="isSortMenuOpen && !isMobile" class="dropdown-menu active" @click.stop>
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

      <!-- Кнопка создания проекта -->
      <div class="create-project-btn" @click="openCreateProjectModal">
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
      <div class="empty-projects__cta" @click="openCreateProjectModal">
        <span class="empty-projects__cta-text">создать проект</span>
        <div class="empty-projects__cta-icon">
          <svg viewBox="0 0 18 18" fill="none">
            <path d="M9 0V18M0 9H18" stroke="white" stroke-width="2" stroke-linecap="round" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Секция проектов -->
    <div v-else class="projects-section">
      <div class="projects-grid">
        <div
          v-for="project in filteredAndSortedProjects"
          :key="project.id"
          class="project-card"
        >
          <div class="project-card-header">
            <div
              class="project-card-icon"
              :style="{ backgroundColor: project.color }"
              v-html="getProjectIconHtml(project)"
            />
            <div class="project-card-title-wrapper">
              <div class="project-card-title">{{ project.name }}</div>
              <div
                class="project-card-menu"
                @click.stop="toggleProjectMenu(project.id, $event)"
              >
                <svg viewBox="0 0 3 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="1.5" cy="2.5" r="1.5" fill="#292D32" />
                  <circle cx="1.5" cy="7.5" r="1.5" fill="#292D32" />
                  <circle cx="1.5" cy="12.5" r="1.5" fill="#292D32" />
                </svg>
              </div>
            </div>
          </div>
          <div class="project-card-description">{{ project.description }}</div>
          <div class="project-card-footer">
            <span class="project-card-manager-label">руководит:</span>
            <span class="project-card-manager-name">{{ project.manager }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div
      v-if="isDeleteConfirmModalOpen"
      class="modal-overlay"
      @click="closeDeleteConfirmModal"
    >
      <div class="delete-confirm-modal" @click.stop>
        <div class="delete-confirm-content">
          <div class="delete-confirm-title">удалить проект?</div>
          <div class="delete-confirm-text">
            Вы уверены, что хотите удалить проект "{{ projectToDelete?.name }}"? Это действие нельзя отменить.
          </div>
          <div class="delete-confirm-actions">
            <div class="modal-btn modal-btn-delete" @click="confirmDelete">
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6C21 6.26522 20.8946 6.51957 20.7071 6.70711C20.5196 6.89464 20.2652 7 20 7H19L18.997 7.071L18.064 20.142C18.0281 20.6466 17.8023 21.1188 17.4321 21.4636C17.0619 21.8083 16.5749 22 16.069 22H7.93C7.42414 22 6.93707 21.8083 6.56688 21.4636C6.1967 21.1188 5.97092 20.6466 5.935 20.142L5.002 7.072L5 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H20ZM16.997 7H7.003L7.931 20H16.069L16.997 7ZM14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3C15 3.26522 14.8946 3.51957 14.7071 3.70711C14.5196 3.89464 14.2652 4 14 4H10C9.73478 4 9.48043 3.89464 9.29289 3.70711C9.10536 3.51957 9 3.26522 9 3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2H14Z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
              <span>удалить</span>
            </div>
            <div class="modal-btn modal-btn-cancel" @click="closeDeleteConfirmModal">
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#912138"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>отмена</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания проекта -->
    <div
      v-if="isCreateProjectModalOpen"
      class="modal-overlay"
      @click="closeModalOnOverlay"
    >
      <div class="create-project-modal" @click.stop>
        <div class="modal-header">
          <button class="modal-close-btn" @click="closeCreateProjectModal" aria-label="Закрыть">
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
          <h2 class="modal-title">{{ editingProjectId === null ? 'Создать проект' : 'Редактировать проект' }}</h2>
          <div class="modal-subtitle">Заполните информацию о проекте</div>
        </div>
        <div class="modal-field">
          <label class="modal-field-label" for="project-name">
            Название проекта
            <span class="modal-field-required">*</span>
          </label>
          <div class="modal-input-wrapper">
            <input
              id="project-name"
              v-model="projectName"
              type="text"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': projectFormErrors.name }"
              placeholder="Введите название проекта"
              required
              @input="projectFormErrors.name = ''"
            />
          </div>
          <span v-if="projectFormErrors.name" class="modal-field-error">{{ projectFormErrors.name }}</span>
        </div>
        <div class="modal-field-group">
          <div class="modal-field">
            <label class="modal-field-label">Иконка</label>
            <div class="modal-icons-list-container">
              <div class="modal-icons-list">
                <button
                  v-for="icon in iconsWithSvg"
                  :key="`${icon.id}-${iconColor}`"
                  type="button"
                  class="modal-icon-option"
                  :class="{ selected: selectedIcon === icon.id }"
                  @click="selectIcon(icon.id)"
                  :aria-label="`Выбрать иконку ${icon.name}`"
                  v-html="icon.svgHtml"
                />
              </div>
            </div>
          </div>
          <div class="modal-field">
            <label class="modal-field-label">Цвет</label>
            <div class="modal-colors-list-container">
              <div class="modal-colors-list">
                <button
                  v-for="color in projectColors"
                  :key="color.id"
                  type="button"
                  class="modal-color-option"
                  :class="{ selected: selectedColor === color.hex }"
                  :style="{ backgroundColor: color.hex }"
                  @click="selectColor(color.hex)"
                  :aria-label="`Выбрать цвет ${color.name}`"
                >
                  <svg v-if="selectedColor === color.hex" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.667 5L7.5 14.167 3.333 10" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-field">
          <label class="modal-field-label" for="project-description">
            Описание проекта
          </label>
          <div class="modal-textarea-wrapper">
            <textarea
              id="project-description"
              v-model="projectDescription"
              class="modal-description-textarea"
              :class="{ 'modal-description-textarea--error': projectFormErrors.description }"
              placeholder="Опишите цели, задачи и особенности проекта..."
              rows="6"
              @input="projectFormErrors.description = ''"
            />
            <div class="modal-textarea-footer">
              <span class="modal-char-count">{{ projectDescription.length }} символов</span>
            </div>
          </div>
          <span v-if="projectFormErrors.description" class="modal-field-error">{{ projectFormErrors.description }}</span>
        </div>
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
        <div class="modal-actions">
                <div class="modal-btn modal-btn-create" @click="submitCreateProject">
            <div class="modal-btn-icon">
              <svg
                v-if="editingProjectId === null"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5v14m7-7H5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
                v-else
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span>{{ editingProjectId === null ? 'создать проект' : 'сохранить' }}</span>
          </div>
          <div class="modal-btn modal-btn-cancel" @click="closeCreateProjectModal">
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

    <!-- Контекстное меню проекта (вне карточки для правильного позиционирования) -->
    <div
      v-if="activeProjectMenuId && menuPosition"
      class="project-card-context-menu"
      :style="{
        top: `${menuPosition.top}px`,
        right: `${menuPosition.right}px`,
      }"
      @click.stop
    >
      <div
        class="project-card-context-item"
        @click="activeProjectMenuId ? goToProject(activeProjectMenuId) : null"
      >
        <span>перейти</span>
      </div>
      <div
        class="project-card-context-item"
        @click="activeProjectMenuId ? editProject(activeProjectMenuId) : null"
      >
        <span>изменить</span>
      </div>
      <div
        class="project-card-context-item delete"
        @click="activeProjectMenuId ? deleteProjectHandler(activeProjectMenuId) : null"
      >
        <span>удалить</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { getProjects, createProject, updateProject, deleteProject, type Project as ApiProject, type ProjectCreateRequest, type ProjectUpdateRequest } from '@/api/projects';
import { useRouter } from 'vue-router';

// Определение мобильного устройства
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);
const isMobile = computed(() => windowWidth.value <= 768);

// Отслеживание изменения размера окна
if (typeof window !== 'undefined') {
  const handleResizeWindow = () => {
    windowWidth.value = window.innerWidth;
  };
  window.addEventListener('resize', handleResizeWindow);
  onUnmounted(() => {
    window.removeEventListener('resize', handleResizeWindow);
  });
}

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

interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  executor?: string[];
  managerId?: string;
  status?: string;
  icon: string;
  color: string;
  createdAt: string;
  updatedAt?: string;
  requiresAction?: boolean;
}

interface ProjectIcon {
  id: string;
  name: string;
  svg: string;
}

interface ProjectColor {
  id: string;
  hex: string;
  name: string;
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

// Проекты (заглушки для примера)
const router = useRouter();
const projects = ref<Project[]>([]);
const isLoading = ref(true);

// Состояние модального окна создания проекта
const isCreateProjectModalOpen = ref(false);
const projectName = ref('');
const projectDescription = ref('');
const generatedDescription = ref('');
const selectedIcon = ref('building');
const selectedColor = ref('#c2c7f3');
const scrollbarThumb = ref<HTMLElement | null>(null);
const editingProjectId = ref<string | null>(null);
const activeProjectMenuId = ref<string | null>(null);
const menuPosition = ref<{ top: number; right: number } | null>(null);
const isDeleteConfirmModalOpen = ref(false);
const projectToDelete = ref<Project | null>(null);

// Ошибки валидации формы проекта
const projectFormErrors = reactive<Record<string, string>>({});

// Массив иконок для проектов (хранятся на фронте)
const projectIcons: ProjectIcon[] = [
  {
    id: 'building',
    name: 'Здание',
    svg: '<path d="M3 11L12 5L21 11V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V11Z"/><path d="M9 22V13H15V22"/>',
  },
  {
    id: 'folder',
    name: 'Папка',
    svg: '<path d="M4 8.5C4 7.94772 4.21071 7.4179 4.58579 7.04289C4.96086 6.66781 5.46957 6.5 6 6.5H10.5L13 9H18C18.5304 9 19.0391 9.21071 19.4142 9.58579C19.7893 9.96086 20 10.4696 20 11V19.5C20 20.0523 19.7893 20.5821 19.4142 20.9571C19.0391 21.3322 18.5304 21.5 18 21.5H6C5.46957 21.5 4.96086 21.3322 4.58579 20.9571C4.21071 20.5821 4 20.0523 4 19.5V8.5Z"/>',
  },
  {
    id: 'calendar',
    name: 'Календарь',
    svg: '<path d="M6 11.5H18M9 6V7.5M15 6V7.5M8 15H9.5M12.5 15H14M15.5 15H17M8 18H9.5M12.5 18H14M15.5 18H17M8 11.5H18C19.1046 11.5 20 12.3954 20 13.5V19.5C20 20.6046 19.1046 21.5 18 21.5H8C6.89543 21.5 6 20.6046 6 19.5V13.5C6 12.3954 6.89543 11.5 8 11.5Z"/>',
  },
  {
    id: 'chart',
    name: 'График',
    svg: '<path d="M5.5 6V19.5H20.5M10 18L13 15L15.5 17.5L20.5 12.5M20.5 12.5H17.5M20.5 12.5V15.5"/>',
  },
  {
    id: 'star',
    name: 'Звезда',
    svg: '<path d="M12 4.5L14.295 10.13L20.25 11.135L16.125 15.32L17.09 21.27L12 18.635L6.91 21.27L7.875 15.32L3.75 11.135L9.705 10.13L12 4.5Z"/>',
  },
  {
    id: 'target',
    name: 'Цель',
    svg: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/>',
  },
];

// Массив цветов для проектов
const projectColors: ProjectColor[] = [
  { id: 'c2c7f3', hex: '#c2c7f3', name: 'Голубой' },
  { id: 'c2f3d5', hex: '#c2f3d5', name: 'Зеленый' },
  { id: 'f3c2c3', hex: '#f3c2c3', name: 'Розовый' },
  { id: 'efc2f3', hex: '#efc2f3', name: 'Фиолетовый' },
  { id: 'f3dbc2', hex: '#f3dbc2', name: 'Персиковый' },
  { id: 'f0f3c2', hex: '#f0f3c2', name: 'Лимонный' },
];

// Вычисляемый цвет для иконок (затемненный выбранный цвет)
const iconColor = computed(() => {
  return darkenColor(selectedColor.value);
});

// Вычисляемый массив иконок с SVG
const iconsWithSvg = computed(() => {
  const color = iconColor.value;
  return projectIcons.map(icon => ({
    ...icon,
    svgHtml: `<svg width="28" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="stroke: ${color}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;">${icon.svg}</svg>`,
  }));
});

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

// Фильтрация и сортировка проектов
const filteredAndSortedProjects = computed(() => {
  let filtered = [...projects.value];

  // Применяем фильтры
  if (selectedFilters.value.executor.length > 0) {
    filtered = filtered.filter((project) => {
      if (!project.executor) return false;
      return selectedFilters.value.executor.some((executorId) =>
        project.executor?.includes(executorId)
      );
    });
  }

  if (selectedFilters.value.manager.length > 0) {
    filtered = filtered.filter((project) => {
      if (!project.managerId) return false;
      return selectedFilters.value.manager.includes(project.managerId);
    });
  }

  if (selectedFilters.value.status.length > 0) {
    filtered = filtered.filter((project) => {
      if (!project.status) return false;
      return selectedFilters.value.status.includes(project.status);
    });
  }

  // Применяем сортировку
  if (selectedSort.value === 'activity') {
    // Сортировка по активности (пока по дате обновления или создания)
    filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  } else if (selectedSort.value === 'created') {
    // Сортировка по дате создания
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
  } else if (selectedSort.value === 'alphabet') {
    // Сортировка по алфавиту
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }

  return filtered;
});

// Получение HTML для иконки проекта
function getProjectIconHtml(project: Project): string {
  const icon = projectIcons.find((i) => i.id === project.icon);
  const iconSvg = icon?.svg || projectIcons[0].svg;
  const iconColor = darkenColor(project.color);
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="stroke: ${iconColor}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; width: 100%; height: 100%; max-width: 40px; max-height: 40px; object-fit: contain;">${iconSvg}</svg>`;
}

// Методы
function closeAllMenus() {
  isFiltersMenuOpen.value = false;
  isSortMenuOpen.value = false;
  isExecutorSubmenuOpen.value = false;
  isManagerSubmenuOpen.value = false;
  isStatusSubmenuOpen.value = false;
  // Восстанавливаем скролл
  if (window.innerWidth <= 768) {
    document.body.style.overflow = '';
  }
}

function toggleFiltersMenu() {
  isFiltersMenuOpen.value = !isFiltersMenuOpen.value;
  if (isFiltersMenuOpen.value) {
    isSortMenuOpen.value = false;
    // Блокируем скролл body в мобильной версии
    if (window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    }
  } else {
    // Восстанавливаем скролл
    if (window.innerWidth <= 768) {
      document.body.style.overflow = '';
    }
  }
}

function toggleSortMenu() {
  isSortMenuOpen.value = !isSortMenuOpen.value;
  if (isSortMenuOpen.value) {
    isFiltersMenuOpen.value = false;
    // Блокируем скролл body в мобильной версии
    if (window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    }
  } else {
    // Восстанавливаем скролл
    if (window.innerWidth <= 768) {
      document.body.style.overflow = '';
    }
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
  // Сортировка происходит автоматически через computed filteredAndSortedProjects
}

function applyFilters() {
  isFiltersMenuOpen.value = false;
  isExecutorSubmenuOpen.value = false;
  isManagerSubmenuOpen.value = false;
  isStatusSubmenuOpen.value = false;
  // Фильтрация происходит автоматически через computed filteredAndSortedProjects
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

// Функции для работы с модальным окном создания проекта
function openCreateProjectModal() {
  editingProjectId.value = null;
  isCreateProjectModalOpen.value = true;
  projectName.value = '';
  projectDescription.value = '';
  generatedDescription.value = '';
  selectedIcon.value = 'building';
  selectedColor.value = '#c2c7f3';
  // Блокируем скролл body при открытии модального окна
  document.body.style.overflow = 'hidden';
  nextTick(() => {
    updateScrollbar();
  });
}

function openEditProjectModal(project: Project) {
  editingProjectId.value = project.id;
  isCreateProjectModalOpen.value = true;
  projectName.value = project.name;
  projectDescription.value = project.description;
  generatedDescription.value = '';
  selectedIcon.value = project.icon;
  selectedColor.value = project.color;
  // Блокируем скролл body при открытии модального окна
  document.body.style.overflow = 'hidden';
  nextTick(() => {
    updateScrollbar();
  });
}

function closeCreateProjectModal() {
  isCreateProjectModalOpen.value = false;
  editingProjectId.value = null;
  projectName.value = '';
  projectDescription.value = '';
  generatedDescription.value = '';
  // Очищаем ошибки
  Object.keys(projectFormErrors).forEach(key => delete projectFormErrors[key]);
  // Восстанавливаем скролл body при закрытии модального окна
  document.body.style.overflow = '';
}

function closeModalOnOverlay(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.classList.contains('modal-overlay')) {
    // Проверяем, какое модальное окно открыто
    if (isDeleteConfirmModalOpen.value) {
      closeDeleteConfirmModal();
    } else if (isCreateProjectModalOpen.value) {
      closeCreateProjectModal();
    }
  }
}

// Функция для затемнения цвета на 50%
function darkenColor(hex: string, percent = 50): string {
  // Убираем #
  hex = hex.replace('#', '');
  
  // Конвертируем в RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Затемняем
  const newR = Math.floor(r * (1 - percent / 100));
  const newG = Math.floor(g * (1 - percent / 100));
  const newB = Math.floor(b * (1 - percent / 100));
  
  // Конвертируем обратно в hex
  return '#' + [newR, newG, newB].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Выбор иконки
function selectIcon(iconId: string) {
  selectedIcon.value = iconId;
}

// Выбор цвета
function selectColor(colorHex: string) {
  selectedColor.value = colorHex;
}

// Генерация описания (заглушка)
function generateDescription() {
  const name = projectName.value.trim() || 'проект';
  
  const mockDescriptions = [
    `Описание проекта "${name}":\n\nЭтот проект направлен на решение ключевых задач и достижение поставленных целей. Проект включает в себя разработку функциональности, тестирование и внедрение решений.`,
    `Проект "${name}" представляет собой комплексное решение для оптимизации бизнес-процессов. В рамках проекта планируется реализовать современные подходы и технологии.`,
    `Цель проекта "${name}" - создание эффективного инструмента для управления задачами. Проект включает несколько этапов: планирование, разработка, тестирование и запуск.`,
  ];
  
  const randomDescription = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
  generatedDescription.value = randomDescription;
}

// Доработка описания
function refineGeneratedDescription() {
  const name = projectName.value.trim() || 'проект';
  
  const mockDescriptions = [
    `Описание проекта "${name}":\n\nЭтот проект направлен на решение ключевых задач и достижение поставленных целей. Проект включает в себя разработку функциональности, тестирование и внедрение решений.`,
    `Проект "${name}" представляет собой комплексное решение для оптимизации бизнес-процессов. В рамках проекта планируется реализовать современные подходы и технологии.`,
    `Цель проекта "${name}" - создание эффективного инструмента для управления задачами. Проект включает несколько этапов: планирование, разработка, тестирование и запуск.`,
    `Проект "${name}" - это инновационное решение, которое объединяет передовые технологии и проверенные практики. Основная цель - повышение эффективности и оптимизация рабочих процессов.`,
    `В рамках проекта "${name}" планируется создание масштабируемой системы, способной адаптироваться к изменяющимся требованиям. Проект включает анализ требований, проектирование архитектуры и поэтапную реализацию.`,
  ];
  
  const currentText = generatedDescription.value;
  let newDescription;
  do {
    newDescription = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
  } while (newDescription === currentText && mockDescriptions.length > 1);
  
  generatedDescription.value = newDescription;
}

// Принятие сгенерированного описания
function acceptGeneratedDescription() {
  projectDescription.value = generatedDescription.value;
  generatedDescription.value = '';
  nextTick(() => {
    updateScrollbar();
  });
}

// Удаление сгенерированного описания
function deleteGeneratedDescription() {
  generatedDescription.value = '';
}

// Обновление скроллбара
function updateScrollbar() {
  nextTick(() => {
    const textarea = document.querySelector('.modal-description-textarea') as HTMLTextAreaElement;
    const scrollbar = document.querySelector('.modal-description-scrollbar') as HTMLElement;
    const thumb = scrollbarThumb.value;
    
    if (!textarea || !scrollbar || !thumb) return;

    const scrollHeight = textarea.scrollHeight;
    const clientHeight = textarea.clientHeight;
    const scrollTop = textarea.scrollTop;
    const scrollbarHeight = scrollbar.clientHeight;

    // Проверяем, нужен ли скроллбар
    if (scrollHeight <= clientHeight) {
      thumb.style.display = 'none';
      return;
    } else {
      thumb.style.display = 'block';
    }

    // Вычисляем размер и позицию бегунка
    const thumbHeight = Math.max(48, (clientHeight / scrollHeight) * scrollbarHeight);
    const maxThumbTop = scrollbarHeight - thumbHeight;
    const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * maxThumbTop;

    thumb.style.height = thumbHeight + 'px';
    thumb.style.top = thumbTop + 'px';
  });
}

// Преобразование API проекта в формат компонента
function transformApiProject(apiProject: ApiProject): Project {
  return {
    id: apiProject.id,
    name: apiProject.name,
    description: apiProject.description || 'Описание не указано',
    manager: apiProject.creator.displayName || apiProject.creator.firstName || apiProject.creator.login || 'Неизвестно',
    managerId: apiProject.creator.id,
    executor: apiProject.participants.map(p => p.id),
    status: apiProject.status,
    icon: apiProject.icon,
    color: apiProject.color,
    createdAt: apiProject.createdAt,
    updatedAt: apiProject.updatedAt,
    requiresAction: apiProject.requiresAction,
  };
}

// Загрузка проектов
async function loadProjects(): Promise<void> {
  try {
    isLoading.value = true;
    const apiProjects = await getProjects();
    projects.value = apiProjects.map(transformApiProject);
  } catch (error: any) {
    console.error('Ошибка загрузки проектов:', error);
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('auth_tokens');
      router.push('/auth');
    } else {
      alert('Не удалось загрузить проекты. Проверьте консоль для деталей.');
    }
  } finally {
    isLoading.value = false;
  }
}

// Создание проекта
async function submitCreateProject() {
  // Очищаем предыдущие ошибки
  Object.keys(projectFormErrors).forEach(key => delete projectFormErrors[key]);

  const name = projectName.value.trim();
  const description = projectDescription.value.trim();

  // Валидация на клиенте
  if (!name) {
    projectFormErrors.name = 'Название проекта обязательно';
    return;
  }

  try {
  // Если редактируем проект
  if (editingProjectId.value !== null) {
      const updateData: ProjectUpdateRequest = {
        name,
        description: description || undefined,
        icon: selectedIcon.value,
        color: selectedColor.value,
      };

      const updatedProject = await updateProject(editingProjectId.value, updateData);
      const projectIndex = projects.value.findIndex((p) => p.id === editingProjectId.value);
      if (projectIndex !== -1) {
        projects.value[projectIndex] = transformApiProject(updatedProject);
    }
    closeCreateProjectModal();
    return;
  }

  // Создаем новый проект
    const createData: ProjectCreateRequest = {
      name,
      description: description || undefined,
      participants: [],
      status: 'new',
      requiresAction: false,
      icon: selectedIcon.value,
      color: selectedColor.value,
    };

    const newProject = await createProject(createData);
    projects.value.push(transformApiProject(newProject));
    
    closeCreateProjectModal();
  } catch (error: any) {
    console.error('Ошибка при создании/обновлении проекта:', error);
    
    // Обработка ошибок валидации с сервера
    if (error.status === 422 && error.data?.errors) {
      const errors = error.data.errors;
      Object.keys(errors).forEach(field => {
        if (Array.isArray(errors[field])) {
          projectFormErrors[field] = errors[field][0];
        } else {
          projectFormErrors[field] = errors[field];
        }
      });
    } else {
      // Общая ошибка
      const errorMessage = error.data?.detail || error.message || 'Не удалось сохранить проект. Попробуйте еще раз.';
      projectFormErrors.name = errorMessage;
    }
  }
}

// Функции для работы с контекстным меню проектов
function toggleProjectMenu(projectId: string, event: MouseEvent) {
  if (activeProjectMenuId.value === projectId) {
    activeProjectMenuId.value = null;
    menuPosition.value = null;
  } else {
    activeProjectMenuId.value = projectId;
    // Вычисляем позицию меню относительно кнопки
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    menuPosition.value = {
      top: rect.bottom + 8, // 8px отступ от кнопки
      right: window.innerWidth - rect.right, // Правый край относительно viewport
    };
  }
}

// Закрытие контекстного меню при клике вне его
function handleClickOutsideProjectMenu(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (
    !target.closest('.project-card-menu') &&
    !target.closest('.project-card-context-menu')
  ) {
    activeProjectMenuId.value = null;
    menuPosition.value = null;
  }
}

// Переход к проекту
function goToProject(projectId: string) {
  activeProjectMenuId.value = null;
  menuPosition.value = null;
  // TODO: Реализовать переход к проекту
  console.log('Переход к проекту:', projectId);
  // window.location.href = `#project-${projectId}`;
}

// Редактирование проекта
function editProject(projectId: string) {
  activeProjectMenuId.value = null;
  menuPosition.value = null;
  const project = projects.value.find((p) => p.id === projectId);
  if (project) {
    openEditProjectModal(project);
  }
}

// Удаление проекта
function deleteProjectHandler(projectId: string) {
  activeProjectMenuId.value = null;
  menuPosition.value = null;
  const project = projects.value.find((p) => p.id === projectId);
  if (!project) return;

  projectToDelete.value = project;
  isDeleteConfirmModalOpen.value = true;
  document.body.style.overflow = 'hidden';
}

// Подтверждение удаления
async function confirmDelete() {
  if (!projectToDelete.value) return;

  try {
    await deleteProject(projectToDelete.value.id);
  const index = projects.value.findIndex((p) => p.id === projectToDelete.value!.id);
  if (index > -1) {
    projects.value.splice(index, 1);
  }
  closeDeleteConfirmModal();
  } catch (error: any) {
    console.error('Ошибка при удалении проекта:', error);
    const errorMessage = error.data?.detail || error.message || 'Не удалось удалить проект. Попробуйте еще раз.';
    alert(errorMessage);
  }
}

// Закрытие модального окна подтверждения удаления
function closeDeleteConfirmModal() {
  isDeleteConfirmModalOpen.value = false;
  projectToDelete.value = null;
  // Восстанавливаем скролл body при закрытии модального окна
  document.body.style.overflow = '';
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

// Функция для закрытия меню при изменении размера окна
function handleResize() {
  if (window.innerWidth > 768) {
    // Восстанавливаем скролл при переходе на десктоп
    document.body.style.overflow = '';
  }
  // Закрываем контекстное меню при изменении размера окна
  activeProjectMenuId.value = null;
  menuPosition.value = null;
}

// Функция для закрытия меню при прокрутке
function handleScroll() {
  activeProjectMenuId.value = null;
  menuPosition.value = null;
}

onMounted(() => {
  loadProjects();
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('click', handleClickOutsideProjectMenu);
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('click', handleClickOutsideProjectMenu);
  window.removeEventListener('resize', handleResize);
  // Восстанавливаем скролл при размонтировании
  document.body.style.overflow = '';
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
  width: 95vw;
  max-width: 95vw;
  margin: 0 auto;
  padding: clamp(1.5rem, 3vw, 2rem) clamp(1rem, 2vw, 1.5rem);
  font-family: 'Involve', Arial, sans-serif;
  min-height: calc(100vh - 100px);
  box-sizing: border-box;
}

/* Секция фильтров и сортировки */
.filters-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto clamp(1rem, 2vw, 1.5rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  position: relative;
  z-index: 100;
  flex-wrap: wrap;
}

.filters-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.filter-btn,
.sort-btn {
  background: rgba(145, 33, 56, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(1.5rem, 3vw, 2.5rem);
  height: clamp(2.25rem, 4vw, 2.75rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  overflow: visible;
  padding: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-btn:hover,
.sort-btn:hover {
  background: rgba(145, 33, 56, 0.75);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  border-radius: clamp(1.5rem, 3vw, 2.5rem);
  height: 100%;
  display: flex;
  align-items: center;
  padding: clamp(0.5rem, 1.25vw, 0.75rem) clamp(1rem, 2vw, 1.5rem);
  gap: clamp(0.5rem, 1vw, 0.75rem);
  flex-shrink: 0;
  transition: background 0.3s ease;
}

.filter-btn:hover .filter-btn-inner,
.sort-btn:hover .sort-btn-inner {
  background: #a02a43;
}

.filter-text,
.sort-text,
.create-project-text {
  color: #ffffff;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
  line-height: 1.4;
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
  border-radius: clamp(1.5rem, 3vw, 2.5rem);
  height: clamp(2.25rem, 4vw, 2.75rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(0.5rem, 1.25vw, 0.75rem) clamp(1rem, 2vw, 1.5rem);
  gap: clamp(0.75rem, 1.5vw, 1rem);
  cursor: pointer;
  min-width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.create-project-btn:hover {
  background: #a02a43;
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
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
  top: calc(100% + clamp(0.5rem, 1vw, 0.75rem));
  left: 0;
  background: rgba(145, 33, 56, 0.98);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: clamp(0.875rem, 1.5vw, 1.25rem);
  padding: clamp(0.75rem, 1.5vw, 1rem) 0;
  min-width: clamp(12.5rem, 20vw, 18.75rem);
  z-index: 10001;
  display: none;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  animation: fadeInDown 0.2s ease-out;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  overflow-x: hidden;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-menu.active {
  display: block;
}

/* Улучшенный скролл для выпадающих меню */
.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.dropdown-item {
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1.25rem, 2.5vw, 1.75rem);
  color: #e1eaf8;
  font-size: clamp(0.875rem, 1.25vw, 0.9375rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  border-radius: clamp(0.5rem, 1vw, 0.625rem);
  margin: 0 clamp(0.5rem, 1vw, 0.75rem) clamp(0.25rem, 0.5vw, 0.375rem);
  min-height: clamp(2.5rem, 5vw, 3rem);
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.dropdown-item.active {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.dropdown-item .checkbox {
  width: clamp(1rem, 1.5vw, 1.125rem);
  height: clamp(1rem, 1.5vw, 1.125rem);
  border: 2px solid rgba(225, 234, 248, 0.6);
  border-radius: clamp(0.25rem, 0.5vw, 0.375rem);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
}

.dropdown-item:hover .checkbox {
  border-color: rgba(255, 255, 255, 0.8);
}

.dropdown-item.active .checkbox {
  border-color: #ffffff;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(145, 33, 56, 0.3);
}

.dropdown-item .checkbox svg {
  width: clamp(0.625rem, 1vw, 0.75rem);
  height: clamp(0.625rem, 1vw, 0.75rem);
  stroke: #912138;
  stroke-width: 2.5;
  fill: none;
  display: none;
  transition: opacity 0.2s ease;
}

.dropdown-item.active .checkbox svg {
  display: block;
  stroke: #912138;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  margin: clamp(0.75rem, 1.5vw, 1rem) clamp(0.75rem, 1.5vw, 1rem) 0;
  padding-top: clamp(0.5rem, 1vw, 0.75rem);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.apply-btn {
  flex: 1;
  padding: clamp(0.625rem, 1.25vw, 0.875rem) clamp(1rem, 2vw, 1.5rem);
  background: #912138;
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  color: #ffffff;
  font-size: clamp(0.875rem, 1.25vw, 0.9375rem);
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: clamp(2.25rem, 4vw, 2.75rem);
}

.apply-btn:hover {
  background: #a02a43;
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.reset-filters-btn {
  padding: clamp(0.625rem, 1.25vw, 0.875rem) clamp(1rem, 2vw, 1.5rem);
  background: rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  color: #ffffff;
  font-size: clamp(0.875rem, 1.25vw, 0.9375rem);
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: clamp(2.25rem, 4vw, 2.75rem);
  min-width: clamp(2.25rem, 4vw, 2.75rem);
}

.reset-filters-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
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
  padding-bottom: clamp(0.5rem, 1vw, 0.75rem);
}

.sort-btn .dropdown-menu {
  min-width: clamp(13.75rem, 25vw, 18.75rem);
  z-index: 10001;
}

.filter-btn .dropdown-menu {
  min-width: clamp(17.5rem, 30vw, 25rem);
  max-width: clamp(20rem, 35vw, 28rem);
  z-index: 10001;
}

/* Подменю фильтров */
.filter-submenu {
  display: none;
  padding: clamp(0.5rem, 1vw, 0.75rem) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: clamp(0.5rem, 1vw, 0.75rem);
  position: relative;
  z-index: 10002;
}

.filter-submenu.active {
  display: block;
}

.filter-search {
  padding: 0 clamp(1.25rem, 2.5vw, 1.75rem) clamp(0.75rem, 1.5vw, 1rem);
  margin-bottom: clamp(0.5rem, 1vw, 0.75rem);
}

.filter-search-input {
  width: 100%;
  padding: clamp(0.625rem, 1.25vw, 0.875rem) clamp(0.75rem, 1.5vw, 1rem);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: clamp(0.5rem, 1vw, 0.625rem);
  color: #ffffff;
  font-size: clamp(0.875rem, 1.25vw, 0.9375rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-search-input::placeholder {
  color: rgba(225, 234, 248, 0.6);
}

.filter-search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.filter-results {
  max-height: clamp(12rem, 30vw, 16rem);
  overflow-y: auto;
  padding: 0 clamp(0.75rem, 1.5vw, 1rem);
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.filter-results::-webkit-scrollbar {
  width: 6px;
}

.filter-results::-webkit-scrollbar-track {
  background: transparent;
}

.filter-results::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.filter-results::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.filter-result-item {
  padding: clamp(0.625rem, 1.25vw, 0.875rem) clamp(0.75rem, 1.5vw, 1rem);
  color: #e1eaf8;
  font-size: clamp(0.875rem, 1.25vw, 0.9375rem);
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  border-radius: clamp(0.5rem, 1vw, 0.625rem);
  margin-bottom: clamp(0.25rem, 0.5vw, 0.375rem);
  min-height: clamp(2.25rem, 4vw, 2.75rem);
}

.filter-result-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-result-item.selected {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.filter-result-item .checkbox {
  width: clamp(1rem, 1.5vw, 1.125rem);
  height: clamp(1rem, 1.5vw, 1.125rem);
  border: 2px solid rgba(225, 234, 248, 0.6);
  border-radius: clamp(0.25rem, 0.5vw, 0.375rem);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
}

.filter-result-item:hover .checkbox {
  border-color: rgba(255, 255, 255, 0.8);
}

.filter-result-item.selected .checkbox {
  border-color: #ffffff;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(145, 33, 56, 0.3);
}

.filter-result-item .checkbox svg {
  width: clamp(0.625rem, 1vw, 0.75rem);
  height: clamp(0.625rem, 1vw, 0.75rem);
  stroke: #912138;
  stroke-width: 2.5;
  fill: none;
  display: none;
}

.filter-result-item.selected .checkbox svg {
  display: block;
}

.filter-status-list {
  padding: clamp(0.5rem, 1vw, 0.75rem) 0;
}

.filter-status-item {
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1.25rem, 2.5vw, 1.75rem);
  color: #e1eaf8;
  font-size: clamp(0.875rem, 1.25vw, 0.9375rem);
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  border-radius: clamp(0.5rem, 1vw, 0.625rem);
  margin: 0 clamp(0.5rem, 1vw, 0.75rem) clamp(0.25rem, 0.5vw, 0.375rem);
  min-height: clamp(2.25rem, 4vw, 2.75rem);
}

.filter-status-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-status-item.selected {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.filter-status-item .checkbox {
  width: clamp(1rem, 1.5vw, 1.125rem);
  height: clamp(1rem, 1.5vw, 1.125rem);
  border: 2px solid rgba(225, 234, 248, 0.6);
  border-radius: clamp(0.25rem, 0.5vw, 0.375rem);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
}

.filter-status-item:hover .checkbox {
  border-color: rgba(255, 255, 255, 0.8);
}

.filter-status-item.selected .checkbox {
  border-color: #ffffff;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(145, 33, 56, 0.3);
}

.filter-status-item .checkbox svg {
  width: clamp(0.625rem, 1vw, 0.75rem);
  height: clamp(0.625rem, 1vw, 0.75rem);
  stroke: #912138;
  stroke-width: 2.5;
  fill: none;
  display: none;
}

.filter-status-item.selected .checkbox svg {
  display: block;
}

.dropdown-item.expandable {
  position: relative;
  z-index: 10003;
}

.dropdown-item.expandable::after {
  content: '';
  width: 0;
  height: 0;
  border-left: 6px solid #e1eaf8;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  margin-left: auto;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.dropdown-item.expandable.expanded::after {
  transform: rotate(90deg);
}

.dropdown-item.expandable.expanded {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

/* Сообщение, если проектов нет */
.empty-projects {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1rem, 2vw, 1.5rem);
  min-height: clamp(20rem, 40vw, 30rem);
  padding: clamp(2rem, 4vw, 3rem) clamp(1rem, 2vw, 1.5rem);
  width: 100%;
}

.empty-projects__text {
  color: rgba(225, 234, 248, 0.9);
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: 500;
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.empty-projects__cta {
  background: #912138;
  border-radius: clamp(1.5rem, 3vw, 2.5rem);
  height: clamp(2.25rem, 4vw, 2.75rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(0.5rem, 1.25vw, 0.75rem) clamp(1rem, 2vw, 1.5rem);
  gap: clamp(0.75rem, 1.5vw, 1rem);
  cursor: pointer;
  min-width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.empty-projects__cta:hover {
  background: #a02a43;
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.empty-projects__cta-text {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
}

.empty-projects__cta-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-projects__cta-icon svg {
  width: 100%;
  height: 100%;
  stroke: #ffffff;
  fill: none;
}

/* Адаптивность для секции фильтров */
@media (max-width: 1280px) {
  .projects-view {
    padding: clamp(1.25rem, 2.5vw, 1.75rem) clamp(0.875rem, 1.75vw, 1.25rem);
  }
}

@media (max-width: 900px) {
  .filters-container {
    flex-wrap: wrap;
  }

  .create-project-btn {
    width: 100%;
    max-width: 100%;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .projects-view {
    padding: clamp(1rem, 2vw, 1.5rem) clamp(0.75rem, 1.5vw, 1rem);
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
    gap: clamp(0.5rem, 1vw, 0.75rem);
  }

  .filters-left {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: clamp(0.5rem, 1vw, 0.75rem);
  }

  .filter-btn,
  .sort-btn {
    flex: 1;
    max-width: calc(50% - clamp(0.25rem, 0.5vw, 0.375rem));
  }

  .create-project-btn {
    width: 100%;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: clamp(0.875rem, 1.75vw, 1.25rem);
  }

  /* Мобильная версия: полноэкранные модальные окна */
  .modal-overlay {
    z-index: 10010;
  }

  .mobile-filter-modal {
    background: rgba(4, 9, 16, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-left: 1px solid #000000;
    border-radius: 0;
    width: 100%;
    max-width: 100%;
    max-height: 100vh;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    display: flex;
    flex-direction: column;
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    z-index: 10011;
  }

  .mobile-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: clamp(1rem, 2vw, 1.5rem);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
    background: rgba(145, 33, 56, 0.98);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .mobile-menu-title {
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    font-family: 'Involve', Arial, sans-serif;
  }

  .mobile-menu-close {
    width: clamp(2.5rem, 5vw, 3rem);
    height: clamp(2.5rem, 5vw, 3rem);
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }

  .mobile-menu-close:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  .mobile-menu-close svg {
    width: 1.5rem;
    height: 1.5rem;
  }

  .mobile-filter-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: clamp(1rem, 2vw, 1.5rem) clamp(1rem, 2vw, 1.5rem);
    display: flex;
    flex-direction: column;
    gap: 0;
    padding-bottom: clamp(11rem, 22vw, 13rem);
  }

  .mobile-filter-content .dropdown-item {
    margin: 0 0 clamp(0.25rem, 0.5vw, 0.375rem);
    padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.5rem);
  }

  .mobile-filter-content .filter-submenu {
    margin: 0;
    padding: 0;
    margin-top: clamp(0.75rem, 1.5vw, 1rem);
    padding-top: clamp(0.75rem, 1.5vw, 1rem);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .mobile-filter-content .filter-submenu.active {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .mobile-filter-content .filter-search {
    padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.5rem) clamp(0.75rem, 1.5vw, 1rem);
    margin-bottom: clamp(0.5rem, 1vw, 0.75rem);
    margin-top: 0;
  }

  .mobile-filter-content .filter-results {
    padding: 0 clamp(1rem, 2vw, 1.5rem);
    margin-bottom: clamp(0.5rem, 1vw, 0.75rem);
  }

  .mobile-filter-content .filter-status-list {
    padding: 0 clamp(1rem, 2vw, 1.5rem);
    margin-bottom: clamp(0.5rem, 1vw, 0.75rem);
  }

  .mobile-filter-content .filter-result-item {
    margin-bottom: clamp(0.25rem, 0.5vw, 0.375rem);
  }

  .mobile-filter-content .filter-actions {
    position: fixed;
    bottom: max(env(safe-area-inset-bottom, 0px), clamp(4rem, 8vw, 5rem));
    left: 0;
    right: 0;
    margin: 0;
    padding: clamp(1rem, 2vw, 1.5rem);
    padding-bottom: max(env(safe-area-inset-bottom, 0px), clamp(4rem, 8vw, 5rem));
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: clamp(0.5rem, 1vw, 0.75rem);
  }

  .filter-submenu {
    z-index: 10006;
    position: relative;
  }

  .dropdown-item.expandable {
    z-index: 10007;
  }
}

@media (max-width: 640px) {
  .projects-view {
    padding: clamp(0.875rem, 1.75vw, 1.25rem) clamp(0.625rem, 1.25vw, 0.875rem);
  }

  .filters-left {
    flex-direction: column;
    gap: clamp(0.5rem, 1vw, 0.75rem);
  }

  .filter-btn,
  .sort-btn {
    max-width: 100%;
  }
}

/* Модальное окно создания проекта */
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
  z-index: 1000;
  overflow: hidden;
}

.create-project-modal {
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

.modal-field-input--error {
  color: #ff6b6b;
}

.modal-input-wrapper:has(.modal-field-input--error) {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.modal-description-textarea--error {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.modal-field-error {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 13px;
  color: #ff6b6b;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.4;
}

.modal-field-error::before {
  content: '⚠';
  font-size: 14px;
}

.modal-field-input::placeholder {
  color: rgba(225, 234, 248, 0.5);
}

.modal-icons-list-container,
.modal-colors-list-container {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(225, 234, 248, 0.3) transparent;
}

.modal-icons-list-container::-webkit-scrollbar,
.modal-colors-list-container::-webkit-scrollbar {
  height: 6px;
}

.modal-icons-list-container::-webkit-scrollbar-track,
.modal-colors-list-container::-webkit-scrollbar-track {
  background: transparent;
}

.modal-icons-list-container::-webkit-scrollbar-thumb,
.modal-colors-list-container::-webkit-scrollbar-thumb {
  background: rgba(225, 234, 248, 0.3);
  border-radius: 3px;
}

.modal-icons-list-container::-webkit-scrollbar-thumb:hover,
.modal-colors-list-container::-webkit-scrollbar-thumb:hover {
  background: rgba(225, 234, 248, 0.5);
}

.modal-icons-list,
.modal-colors-list {
  display: flex;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  align-items: center;
  padding: clamp(0.5rem, 1vw, 0.75rem) 0;
  flex-wrap: wrap;
}

.modal-icon-option {
  width: clamp(3rem, 6vw, 3.5rem);
  height: clamp(3rem, 6vw, 3.5rem);
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  padding: 0;
  margin: 0;
}

.modal-icon-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.modal-icon-option.selected {
  border-color: #912138;
  background: rgba(145, 33, 56, 0.2);
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.2);
}

.modal-icon-option svg {
  width: 28px;
  height: 26px;
}

.modal-color-option {
  width: clamp(3rem, 6vw, 3.5rem);
  height: clamp(3rem, 6vw, 3.5rem);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid transparent;
  position: relative;
  flex-shrink: 0;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.modal-color-option:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.modal-color-option.selected {
  border-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3);
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
}

.modal-generate-btn-icon {
  color: #ffffff;
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

.modal-generate-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
}

.modal-action-btn-icon {
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

/* Модальное окно подтверждения удаления */
.delete-confirm-modal {
  background: rgba(4, 9, 16, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  margin: auto;
}

.delete-confirm-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.delete-confirm-title {
  color: #e1eaf8;
  font-size: 1.5rem;
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  text-align: center;
}

.delete-confirm-text {
  color: #e1eaf8;
  font-size: 1rem;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  text-align: center;
  line-height: 1.5;
  opacity: 0.9;
}

.delete-confirm-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.modal-btn-delete {
  background: #d32f2f;
  color: #ffffff;
}

.modal-btn-delete:hover {
  background: #b71c1c;
}

.modal-btn-delete .modal-btn-icon svg {
  fill: #ffffff;
}

/* Секция проектов */
.projects-section {
  width: 100%;
  margin-top: clamp(1rem, 2vw, 1.5rem);
  padding: 0;
  position: relative;
  z-index: 1;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(280px, 30vw, 360px), 1fr));
  gap: clamp(1rem, 2vw, 1.5rem);
  width: 100%;
}

.project-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(1.5rem, 3vw, 2.5rem);
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  overflow: hidden;
}

/* Разрешаем overflow для области с меню */
.project-card-header {
  overflow: visible;
  position: relative;
  z-index: 1;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.project-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.project-card:hover::before {
  opacity: 1;
}

.project-card-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.project-card-icon {
  width: clamp(3.5rem, 5vw, 4.5rem);
  height: clamp(3.5rem, 5vw, 4.5rem);
  background: #c2c7f3;
  border-radius: clamp(0.875rem, 1.5vw, 1.25rem);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: clamp(0.75rem, 1.5vw, 1rem);
  box-sizing: border-box;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.project-card:hover .project-card-icon {
  transform: scale(1.05);
}

.project-card-icon svg {
  width: 100%;
  height: 100%;
  max-width: 40px;
  max-height: 40px;
  object-fit: contain;
}

.project-card-title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: visible; /* Позволяем меню выходить за границы */
  z-index: 1;
}

.project-card-menu {
  width: clamp(1.25rem, 2vw, 1.5rem);
  height: clamp(1.25rem, 2vw, 1.5rem);
  display: flex;
  align-items: center;
  position: relative;
  z-index: 2; /* Выше обертки */
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  border-radius: clamp(0.25rem, 0.5vw, 0.375rem);
}

.project-card-menu:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.project-card-menu svg {
  width: 3px;
  height: 15px;
}

.project-card-menu svg circle {
  fill: rgba(225, 234, 248, 0.9);
  transition: fill 0.2s ease;
}

.project-card-menu:hover svg circle {
  fill: #ffffff;
}

.project-card-context-menu {
  position: fixed; /* Фиксированное позиционирование относительно viewport */
  background: rgba(145, 33, 56, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.875rem, 1.5vw, 1.25rem);
  padding: clamp(0.5rem, 1vw, 0.75rem);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: clamp(0.25rem, 0.5vw, 0.375rem);
  min-width: clamp(10rem, 20vw, 12.5rem);
  z-index: 10000; /* Очень высокий z-index, чтобы быть поверх всех карточек */
  animation: fadeInDown 0.2s ease-out;
}

.project-card-context-item {
  padding: clamp(0.5rem, 1vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem);
  color: #e1eaf8;
  font-size: clamp(0.8125rem, 1.25vw, 0.9375rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  cursor: pointer;
  border-radius: clamp(0.5rem, 1vw, 0.625rem);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.project-card-context-item:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.project-card-context-item.delete {
  color: rgba(255, 107, 107, 0.9);
}

.project-card-context-item.delete:hover {
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
}

.project-card-title {
  color: #e1eaf8;
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  font-weight: 600;
  font-family: 'Involve', Arial, sans-serif;
  letter-spacing: -0.01em;
  line-height: 1.4;
  flex: 1;
  min-width: 0;
  transition: color 0.3s ease;
}

.project-card:hover .project-card-title {
  color: #ffffff;
}

.project-card-description {
  color: rgba(225, 234, 248, 0.8);
  font-size: clamp(0.8125rem, 1.25vw, 0.9375rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  width: 100%;
  transition: color 0.3s ease;
}

.project-card:hover .project-card-description {
  color: rgba(225, 234, 248, 0.95);
}

.project-card-footer {
  display: flex;
  align-items: center;
  gap: 4px;
}

.project-card-manager-label {
  color: rgba(225, 234, 248, 0.7);
  font-size: clamp(0.6875rem, 1vw, 0.8125rem);
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  line-height: 1.5;
}

.project-card-manager-name {
  color: rgba(225, 234, 248, 0.9);
  font-size: clamp(0.6875rem, 1vw, 0.8125rem);
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  line-height: 1.5;
}

/* Мобильная версия модального окна */
@media (max-width: 768px) {
  .modal-overlay {
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .create-project-modal {
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

  .mobile-filter-modal {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 100vh;
    max-height: none;
    border-left: none;
    border-radius: 0;
    box-shadow: none;
  }

  .modal-field {
    gap: clamp(0.5rem, 1vw, 0.75rem);
  }

  .modal-field-group {
    grid-template-columns: 1fr;
    gap: clamp(1rem, 2vw, 1.5rem);
  }

  .modal-field-label {
    font-size: clamp(0.875rem, 1.5vw, 1rem);
  }

  .modal-textarea-wrapper {
    min-height: clamp(8rem, 16vw, 10rem);
  }

  .modal-description-textarea {
    min-height: clamp(6rem, 12vw, 8rem);
  }

  .modal-actions {
    flex-direction: column;
    gap: clamp(0.75rem, 1.5vw, 1rem);
    gap: 12px;
  }

  .modal-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .create-project-modal {
    padding: clamp(1rem, 2vw, 1.5rem);
    gap: clamp(1.25rem, 2.5vw, 1.75rem);
  }

  .modal-header {
    gap: clamp(0.5rem, 1vw, 0.75rem);
    padding-bottom: clamp(0.75rem, 1.5vw, 1rem);
  }

  .modal-title {
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  }

  .modal-subtitle {
    font-size: clamp(0.8125rem, 1.5vw, 0.9375rem);
  }

  .modal-generate-btn,
  .modal-action-btn,
  .modal-btn {
    font-size: 0.875rem;
    padding: 8px 12px;
    height: 40px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus states for accessibility */
.filter-btn:focus-visible,
.sort-btn:focus-visible,
.create-project-btn:focus-visible,
.empty-projects__cta:focus-visible,
.project-card:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.project-card-menu:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
  opacity: 1;
}
</style>
