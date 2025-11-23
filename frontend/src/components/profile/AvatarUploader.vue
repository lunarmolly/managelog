<template>
  <div class="avatar-uploader">
    <!-- Модальное окно для обрезки -->
    <div v-if="showCropModal" class="crop-modal" @click.self="cancelCrop">
      <div class="crop-modal-content">
        <div class="crop-modal-header">
          <h3>Обрезка фото</h3>
          <button class="crop-modal-close" @click="cancelCrop">×</button>
        </div>
        <div class="crop-modal-body">
          <div class="crop-preview-container">
            <img ref="cropImageRef" class="crop-image" />
            <div class="crop-preview-circle">
              <div ref="previewRef" class="crop-preview"></div>
            </div>
          </div>
        </div>
        <div class="crop-modal-footer">
          <button class="crop-btn crop-btn-cancel" @click="cancelCrop">Отмена</button>
          <button class="crop-btn crop-btn-confirm" @click="confirmCrop">Применить</button>
        </div>
      </div>
    </div>

    <!-- Основной контейнер аватара -->
    <div class="avatar-container">
      <div class="avatar-wrapper" :class="{ 'avatar-wrapper--has-image': currentAvatar }">
        <img v-if="currentAvatar" :src="currentAvatar" alt="Avatar" class="avatar-image" />
        <div v-else class="avatar-placeholder">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#912138"/>
            <path d="M12.0002 14.5C6.99016 14.5 2.95016 17.86 2.95016 22C2.95016 22.28 3.17016 22.5 3.45016 22.5H20.5502C20.8302 22.5 21.0502 22.28 21.0502 22C21.0502 17.86 17.0102 14.5 12.0002 14.5Z" fill="#912138"/>
          </svg>
        </div>
      </div>
      <div class="avatar-actions">
        <label class="avatar-action-btn avatar-action-btn--upload">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="handleFileSelect"
            class="avatar-file-input"
          />
          {{ currentAvatar ? 'Изменить' : 'Загрузить' }}
        </label>
        <button
          v-if="currentAvatar"
          class="avatar-action-btn avatar-action-btn--delete"
          @click="handleDelete"
        >
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Cropper from 'cropperjs';

interface Props {
  avatarUrl?: string | null;
  apiBaseUrl?: string;
}

interface Emits {
  (e: 'upload', file: File): void;
  (e: 'delete'): void;
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: null,
  apiBaseUrl: 'http://localhost:3000',
});

const emit = defineEmits<Emits>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const cropImageRef = ref<HTMLImageElement | null>(null);
const previewRef = ref<HTMLDivElement | null>(null);
const showCropModal = ref(false);
const currentAvatar = ref<string | null>(props.avatarUrl || null);
const selectedFile = ref<File | null>(null);
let cropper: Cropper | null = null;

watch(() => props.avatarUrl, (newUrl) => {
  currentAvatar.value = newUrl || null;
});

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  // Валидация типа файла
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    alert('Неподдерживаемый формат файла. Разрешены только JPEG, PNG и WebP');
    return;
  }

  // Валидация размера (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    alert('Файл слишком большой. Максимальный размер: 10MB');
    return;
  }

  selectedFile.value = file;
  showCropModal.value = true;
  
  // Сброс input для возможности повторной загрузки того же файла
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
}

function initCropper() {
  if (!cropImageRef.value || !selectedFile.value) return;

  const imageUrl = URL.createObjectURL(selectedFile.value);
  cropImageRef.value.src = imageUrl;

  cropper = new Cropper(cropImageRef.value, {
    aspectRatio: 1, // Квадрат 1:1
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 0.8,
    restore: false,
    guides: true,
    center: true,
    highlight: false,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
    ready() {
      // Обновляем превью
      if (previewRef.value && cropper) {
        const canvas = cropper.getCroppedCanvas({
          width: 200,
          height: 200,
        });
        if (canvas) {
          previewRef.value.innerHTML = '';
          previewRef.value.appendChild(canvas);
        }
      }
    },
    crop() {
      // Обновляем превью при изменении обрезки
      if (previewRef.value && cropper) {
        const canvas = cropper.getCroppedCanvas({
          width: 200,
          height: 200,
        });
        if (canvas) {
          previewRef.value.innerHTML = '';
          previewRef.value.appendChild(canvas);
        }
      }
    },
  });
}

function confirmCrop() {
  if (!cropper || !selectedFile.value) return;

  cropper.getCroppedCanvas({
    width: 800,
    height: 800,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  }).toBlob((blob) => {
    if (blob) {
      const file = new File([blob], selectedFile.value!.name, {
        type: 'image/webp',
        lastModified: Date.now(),
      });
      emit('upload', file);
    }
  }, 'image/webp', 0.9);

  // Очистка
  if (cropImageRef.value) {
    const url = cropImageRef.value.src;
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
  
  destroyCropper();
  showCropModal.value = false;
  selectedFile.value = null;
}

function cancelCrop() {
  if (cropImageRef.value) {
    const url = cropImageRef.value.src;
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
  
  destroyCropper();
  showCropModal.value = false;
  selectedFile.value = null;
}

function destroyCropper() {
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
}

function handleDelete() {
  if (confirm('Вы уверены, что хотите удалить аватар?')) {
    emit('delete');
  }
}

watch(showCropModal, (show) => {
  if (show) {
    // Небольшая задержка для монтирования DOM
    setTimeout(() => {
      initCropper();
    }, 100);
  } else {
    destroyCropper();
  }
});

onUnmounted(() => {
  destroyCropper();
  if (cropImageRef.value) {
    const url = cropImageRef.value.src;
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
});
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-wrapper {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(225, 234, 248, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(4, 9, 16, 0.5);
  position: relative;
}

.avatar-wrapper--has-image {
  border-color: rgba(145, 33, 56, 0.5);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(145, 33, 56, 0.2);
}

.avatar-placeholder svg {
  width: 60%;
  height: 60%;
}

.avatar-actions {
  display: flex;
  gap: 0.75rem;
}

.avatar-action-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: 'Involve', Arial, sans-serif;
  text-transform: lowercase;
}

.avatar-action-btn--upload {
  background: rgba(145, 33, 56, 0.8);
  color: #e1eaf8;
}

.avatar-action-btn--upload:hover {
  background: rgba(145, 33, 56, 1);
}

.avatar-action-btn--delete {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.avatar-action-btn--delete:hover {
  background: rgba(255, 107, 107, 0.3);
}

.avatar-file-input {
  display: none;
}

/* Модальное окно обрезки */
.crop-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.crop-modal-content {
  background: rgba(26, 22, 28, 0.95);
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(225, 234, 248, 0.1);
}

.crop-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(225, 234, 248, 0.1);
}

.crop-modal-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #e1eaf8;
  text-transform: lowercase;
  font-family: 'Involve', Arial, sans-serif;
}

.crop-modal-close {
  background: none;
  border: none;
  color: #e1eaf8;
  font-size: 32px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.crop-modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.crop-modal-body {
  padding: 1.5rem;
  display: flex;
  gap: 2rem;
  flex: 1;
  overflow: auto;
}

.crop-preview-container {
  display: flex;
  gap: 2rem;
  width: 100%;
  align-items: flex-start;
}

.crop-image {
  max-width: 500px;
  max-height: 500px;
  flex: 1;
}

.crop-preview-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(145, 33, 56, 0.5);
  flex-shrink: 0;
  background: rgba(4, 9, 16, 0.5);
}

.crop-preview {
  width: 100%;
  height: 100%;
}

.crop-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(225, 234, 248, 0.1);
}

.crop-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: 'Involve', Arial, sans-serif;
  text-transform: lowercase;
}

.crop-btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: #e1eaf8;
}

.crop-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
}

.crop-btn-confirm {
  background: rgba(145, 33, 56, 0.8);
  color: #e1eaf8;
}

.crop-btn-confirm:hover {
  background: rgba(145, 33, 56, 1);
}

@media (max-width: 768px) {
  .crop-preview-container {
    flex-direction: column;
    align-items: center;
  }

  .crop-image {
    max-width: 100%;
    max-height: 400px;
  }

  .crop-preview-circle {
    width: 150px;
    height: 150px;
  }
}
</style>

